// Enhanced content script for VU Amsterdam AI Assistant
// Runs in the context of web pages

// Global variables
let vuHighlightStyle = null;
let vuDraggableWindow = null;
let vuFloatingIcon = null;

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

// Listen for messages from iframe
window.addEventListener('message', (event) => {
  // Verify the sender origin for security
  if (event.origin !== window.location.origin) return;
  
  if (event.data.action === 'requestPageContent') {
    // Extract content and send back to iframe
    const content = extractStructuredContent();
    
    // Send the content back to the iframe
    if (vuDraggableWindow) {
      const iframe = vuDraggableWindow.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          action: 'receivePageContent',
          content: content
        }, '*');
      }
    }
  }
  
  if (event.data.action === 'highlightText') {
    highlightText(event.data.text);
  }
  
  if (event.data.action === 'clearHighlights') {
    clearHighlights();
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

// Create floating icon
function createFloatingIcon() {
  // Check if icon already exists
  if (vuFloatingIcon) {
    return vuFloatingIcon;
  }
  
  // Create the floating icon
  const icon = document.createElement('button');
  icon.className = 'vu-ai-floating-icon';
  icon.setAttribute('aria-label', 'Open VU Assistant');
  icon.setAttribute('title', 'Open VU Amsterdam AI Assistant');
  
  // Create the icon image
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('images/icon48.png');
  img.alt = 'VU Amsterdam AI Assistant';
  
  // Add image to icon
  icon.appendChild(img);
  
  // Add click event to show draggable window
  icon.addEventListener('click', toggleDraggableWindow);
  
  // Add the icon to the page
  document.body.appendChild(icon);
  
  // Store reference
  vuFloatingIcon = icon;
  
  return icon;
}

// Create draggable window
function createDraggableWindow() {
  // Check if window already exists
  if (vuDraggableWindow) {
    return vuDraggableWindow;
  }
  
  // Create the window container
  const window = document.createElement('div');
  window.className = 'vu-ai-draggable-window hidden';
  
  // Create window header
  const header = document.createElement('div');
  header.className = 'vu-ai-window-header';
  
  // Add title
  const title = document.createElement('h1');
  title.className = 'vu-ai-window-title';
  title.textContent = 'VU Amsterdam AI Assistant';
  
  // Add window actions
  const actions = document.createElement('div');
  actions.className = 'vu-ai-window-actions';
  
  // Add minimize button
  const minimizeBtn = document.createElement('button');
  minimizeBtn.className = 'vu-ai-window-button';
  minimizeBtn.innerHTML = '&minus;';
  minimizeBtn.setAttribute('aria-label', 'Minimize');
  minimizeBtn.setAttribute('title', 'Minimize');
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'vu-ai-window-button';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.setAttribute('title', 'Close');
  
  // Add buttons to actions
  actions.appendChild(minimizeBtn);
  actions.appendChild(closeBtn);
  
  // Add title and actions to header
  header.appendChild(title);
  header.appendChild(actions);
  
  // Create window content
  const content = document.createElement('div');
  content.className = 'vu-ai-window-content';
  
  // Create iframe for extension popup
  const iframe = document.createElement('iframe');
  iframe.className = 'vu-ai-window-iframe';
  iframe.src = chrome.runtime.getURL('popup.html');
  iframe.setAttribute('allow', 'clipboard-read; clipboard-write');
  
  // Add iframe to content
  content.appendChild(iframe);
  
  // Add header and content to window
  window.appendChild(header);
  window.appendChild(content);
  
  // Add window to the page
  document.body.appendChild(window);
  
  // Store reference
  vuDraggableWindow = window;
  
  // Add event listeners for drag functionality
  makeDraggable(window, header);
  
  // Add event listeners for buttons
  minimizeBtn.addEventListener('click', () => {
    hideDraggableWindow();
  });
  
  closeBtn.addEventListener('click', () => {
    hideDraggableWindow();
  });
  
  return window;
}

// Make an element draggable
function makeDraggable(element, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  handle.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e.preventDefault();
    // Get the initial mouse cursor position
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
    // Remove bottom positioning if dragged
    element.style.bottom = 'auto';
    element.style.right = 'auto';
  }
  
  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Toggle the draggable window
function toggleDraggableWindow() {
  // Create window if it doesn't exist
  if (!vuDraggableWindow) {
    createDraggableWindow();
  }
  
  // Toggle visibility
  if (vuDraggableWindow.classList.contains('hidden')) {
    showDraggableWindow();
  } else {
    hideDraggableWindow();
  }
}

// Show the draggable window
function showDraggableWindow() {
  if (!vuDraggableWindow) {
    createDraggableWindow();
  }
  
  vuDraggableWindow.classList.remove('hidden');
  
  // Add a slight delay to ensure the iframe is ready
  setTimeout(() => {
    const iframe = vuDraggableWindow.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      // Let the iframe know the current page content
      const content = extractStructuredContent();
      iframe.contentWindow.postMessage({
        action: 'receivePageContent',
        content: content
      }, '*');
    }
  }, 500);
}

// Hide the draggable window
function hideDraggableWindow() {
  if (vuDraggableWindow) {
    vuDraggableWindow.classList.add('hidden');
  }
}

// Check if the current page is likely educational
function isEducationalPage() {
  const educationalDomains = [
    '.edu', '.ac.', 'scholar.', 'academic.', 'research.', 'science.', 
    'learning.', 'study.', 'course.', 'class.', 'lecture.', 'school.',
    'university.', 'college.', 'academy.', 'institute.', 'faculty.'
  ];
  
  const url = window.location.hostname.toLowerCase();
  const metaTags = document.querySelectorAll('meta[name="keywords"], meta[name="description"]');
  const metaContent = Array.from(metaTags).map(tag => tag.getAttribute('content') || '').join(' ').toLowerCase();
  
  // Check domain
  const isEduDomain = educationalDomains.some(domain => url.includes(domain));
  
  // Check meta content for educational keywords
  const eduKeywords = ['education', 'learning', 'academic', 'course', 'study', 'research', 'school', 'university', 'college', 'lecture', 'class'];
  const hasEduKeywords = eduKeywords.some(keyword => metaContent.includes(keyword));
  
  // Check content
  const pageText = document.body.innerText.toLowerCase();
  const contentEduScore = eduKeywords.filter(keyword => pageText.includes(keyword)).length;
  
  // For development, always return true
  // return true;
  
  // Return true if likely educational
  return isEduDomain || hasEduKeywords || contentEduScore >= 3;
}

// Initialize content script
function initialize() {
  console.log('VU Amsterdam AI Assistant content script loaded');
  
  // Check if we should show the floating icon (only on educational pages)
  if (isEducationalPage()) {
    // Create the floating icon after a short delay
    setTimeout(() => {
      createFloatingIcon();
    }, 1500);
  }
}

// Run initialization
initialize();
