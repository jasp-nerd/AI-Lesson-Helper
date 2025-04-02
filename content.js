// Enhanced content script for VU Amsterdam AI Assistant
// Runs in the context of web pages

// Global variables
let vuHighlightStyle = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    // Extract page content with more structure
    const content = extractStructuredContent();
    sendResponse({ content: content });
    return true;
  }
  
  if (request.action === "highlightText") {
    highlightText(request.text);
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === "clearHighlights") {
    clearHighlights();
    sendResponse({ success: true });
    return true;
  }
});

// Function to extract structured content from the page
function extractStructuredContent() {
  // Get basic page info
  const pageInfo = {
    title: document.title,
    url: window.location.href,
    text: document.body.innerText
  };
  
  // Extract headings for better structure
  const headings = {};
  const h1Elements = document.querySelectorAll('h1');
  const h2Elements = document.querySelectorAll('h2');
  const h3Elements = document.querySelectorAll('h3');
  
  headings.h1 = Array.from(h1Elements).map(el => el.innerText);
  headings.h2 = Array.from(h2Elements).map(el => el.innerText);
  headings.h3 = Array.from(h3Elements).map(el => el.innerText);
  
  // Extract paragraphs for better content analysis
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map(el => el.innerText)
    .filter(text => text.trim().length > 0);
  
  // Extract lists for better structured content
  const lists = Array.from(document.querySelectorAll('ul, ol'))
    .map(list => {
      const items = Array.from(list.querySelectorAll('li')).map(li => li.innerText);
      return {
        type: list.tagName.toLowerCase(),
        items: items
      };
    });
  
  // Extract images with alt text for context
  const images = Array.from(document.querySelectorAll('img'))
    .filter(img => img.alt && img.alt.trim().length > 0)
    .map(img => ({
      alt: img.alt,
      src: img.src
    }));
  
  // Extract tables for structured data
  const tables = Array.from(document.querySelectorAll('table'))
    .map(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText);
      const rows = Array.from(table.querySelectorAll('tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
      ).filter(row => row.length > 0);
      
      return {
        headers: headers,
        rows: rows
      };
    });
  
  // Extract meta description if available
  let metaDescription = "";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDescription = metaDesc.getAttribute("content");
  }
  
  // Combine all extracted content
  return {
    ...pageInfo,
    metaDescription,
    headings,
    paragraphs,
    lists,
    images,
    tables
  };
}

// Function to highlight text on the page
function highlightText(text) {
  if (!text) return;
  
  // Clear any existing highlights first
  clearHighlights();
  
  const regex = new RegExp(text, 'gi');
  const walker = document.createTreeWalker(
    document.body, 
    NodeFilter.SHOW_TEXT, 
    null, 
    false
  );
  
  const nodesToHighlight = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue.match(regex)) {
      nodesToHighlight.push(node);
    }
  }
  
  nodesToHighlight.forEach(node => {
    const highlightedContent = node.nodeValue.replace(
      regex, 
      match => `<span class="vu-ai-highlight">${match}</span>`
    );
    
    const span = document.createElement('span');
    span.innerHTML = highlightedContent;
    node.parentNode.replaceChild(span, node);
  });
  
  // Add highlight style if not already added
  if (!vuHighlightStyle) {
    vuHighlightStyle = document.createElement('style');
    vuHighlightStyle.textContent = `
      .vu-ai-highlight {
        background-color: #0077B3;
        color: white;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(vuHighlightStyle);
  }
}

// Function to clear all highlights
function clearHighlights() {
  const highlights = document.querySelectorAll('.vu-ai-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    const text = document.createTextNode(highlight.textContent);
    parent.replaceChild(text, highlight);
  });
}

// Function to add annotation to the page
function addAnnotation(text, position) {
  const annotation = document.createElement('div');
  annotation.className = 'vu-ai-annotation';
  annotation.textContent = text;
  
  // Position the annotation
  annotation.style.position = 'absolute';
  annotation.style.top = `${position.y}px`;
  annotation.style.left = `${position.x}px`;
  
  // Style the annotation
  annotation.style.backgroundColor = '#0077B3';
  annotation.style.color = 'white';
  annotation.style.padding = '8px 12px';
  annotation.style.borderRadius = '4px';
  annotation.style.maxWidth = '300px';
  annotation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  annotation.style.zIndex = '10000';
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '2px';
  closeBtn.style.right = '5px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.cursor = 'pointer';
  
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(annotation);
  });
  
  annotation.appendChild(closeBtn);
  document.body.appendChild(annotation);
  
  return annotation;
}

// Initialize content script
console.log('VU Amsterdam AI Assistant content script loaded');
