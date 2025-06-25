// Enhanced content script for VU Education Lab AI Assistant
// Runs in the context of web pages

// Global variables
let vuHighlightStyle = null;
let vuDraggableWindow = null;
let vuFloatingIcon = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "getPageContent":
      sendResponse({ content: extractStructuredContent() });
      return true;
    case "highlightText":
      highlightText(request.text);
      sendResponse({ success: true });
      return true;
    case "clearHighlights":
      clearHighlights();
      sendResponse({ success: true });
      return true;
    default:
      break;
  }
});

// Listen for messages from iframe
window.addEventListener('message', (event) => {
  // Allow messages from extension iframe as well as same origin
  const extensionOrigin = chrome.runtime.getURL('').replace(/\/$/, '');
  if (
    event.origin !== window.location.origin &&
    event.origin !== extensionOrigin
  ) return;

  switch (event.data.action) {
    case 'requestPageContent': {
      // Extract content and send back to iframe
      const content = extractStructuredContent();
      // Send the content back to the iframe
      if (vuDraggableWindow) {
        const iframe = vuDraggableWindow.querySelector('iframe');
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            action: 'receivePageContent',
            content
          }, '*');
        }
      }
      break;
    }
    case 'highlightText':
      highlightText(event.data.text);
      break;
    case 'clearHighlights':
      clearHighlights();
      break;
    default:
      break;
  }
});

// Function to extract structured content from the page
function extractStructuredContent() {
  const pageInfo = {
    title: document.title,
    url: window.location.href,
    text: document.body.innerText
  };

  // Extract headings for better structure
  const headings = {
    h1: Array.from(document.querySelectorAll('h1')).map(el => el.innerText),
    h2: Array.from(document.querySelectorAll('h2')).map(el => el.innerText),
    h3: Array.from(document.querySelectorAll('h3')).map(el => el.innerText)
  };

  // Extract paragraphs for better content analysis
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map(el => el.innerText)
    .filter(text => text.trim().length > 0);

  // Extract lists for better structured content
  const lists = Array.from(document.querySelectorAll('ul, ol'))
    .map(list => ({
      type: list.tagName.toLowerCase(),
      items: Array.from(list.querySelectorAll('li')).map(li => li.innerText)
    }));

  // Extract images with alt text for context
  const images = Array.from(document.querySelectorAll('img'))
    .filter(img => img.alt?.trim())
    .map(img => ({ alt: img.alt, src: img.src }));

  // Extract tables for structured data
  const tables = Array.from(document.querySelectorAll('table'))
    .map(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText);
      const rows = Array.from(table.querySelectorAll('tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
      ).filter(row => row.length > 0);
      return { headers, rows };
    });

  // Extract meta description if available
  let metaDescription = "";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDescription = metaDesc.getAttribute("content");

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

// Utility functions for chrome.storage.local
async function saveFloatingIconState(state) {
  return new Promise(resolve => {
    chrome.storage.local.set({ vuFloatingIconState: state }, resolve);
  });
}
async function getFloatingIconState() {
  return new Promise(resolve => {
    chrome.storage.local.get(['vuFloatingIconState'], result => {
      resolve(result.vuFloatingIconState || null);
    });
  });
}

// Create floating icon
async function createFloatingIcon() {
  // Check if icon already exists
  if (vuFloatingIcon) {
    return vuFloatingIcon;
  }

  // Create the floating icon
  const icon = document.createElement('button');
  icon.className = 'vu-ai-floating-icon';
  icon.setAttribute('aria-label', 'Open VU Education Lab Assistant');
  icon.setAttribute('title', 'Open VU Education Lab AI Assistant');
  icon.style.transition = 'all 0.3s cubic-bezier(.4,2,.6,1)';
  icon.style.position = 'fixed';
  icon.style.zIndex = 10000;

  // Create the icon image
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('images/icon48.png');
  img.alt = 'VU Education Lab AI Assistant';
  img.style.transition = 'opacity 0.2s, width 0.2s, height 0.2s';
  icon.appendChild(img);

  // Add click event to show draggable window
  icon.addEventListener('click', (e) => {
    if (icon.classList.contains('minimized')) return; // Don't open if minimized
    toggleDraggableWindow();
  });

  // Add the icon to the page
  document.body.appendChild(icon);
  vuFloatingIcon = icon;

  // Restore position and minimized state from chrome.storage.local
  let iconState = await getFloatingIconState();
  if (iconState) {
    setFloatingIconPosition(icon, iconState.left, iconState.top, iconState.edge, iconState.minimized, true);
    if (iconState.minimized) {
      minimizeFloatingIcon(true);
    }
  }

  // Make draggable
  makeFloatingIconDraggable(icon);

  // Auto-minimize after inactivity
  let minimizeTimeout;
  function resetMinimizeTimer() {
    clearTimeout(minimizeTimeout);
    if (!icon.classList.contains('minimized')) {
      minimizeTimeout = setTimeout(() => minimizeFloatingIcon(), 3000);
    }
  }
  icon.addEventListener('mousemove', resetMinimizeTimer);
  icon.addEventListener('mousedown', resetMinimizeTimer);
  icon.addEventListener('mouseup', resetMinimizeTimer);
  icon.addEventListener('mouseleave', resetMinimizeTimer);
  icon.addEventListener('mouseenter', () => {
    if (icon.classList.contains('minimized')) {
      restoreFloatingIcon();
    }
    clearTimeout(minimizeTimeout);
  });
  icon.addEventListener('mouseleave', resetMinimizeTimer);
  // Start timer on creation
  resetMinimizeTimer();

  return icon;
}

function setFloatingIconPosition(icon, left, top, edge, minimized, skipSave) {
  // Clamp to viewport
  const minTop = 10;
  const maxTop = window.innerHeight - 58;
  top = Math.max(minTop, Math.min(maxTop, top || window.innerHeight - 68));
  if (edge === 'left') {
    icon.style.left = '20px';
    icon.style.right = '';
  } else {
    icon.style.left = '';
    icon.style.right = '20px';
  }
  icon.style.top = top + 'px';
  icon.style.bottom = '';
  if (typeof minimized === 'undefined') minimized = icon.classList.contains('minimized');
  if (!skipSave) {
    saveFloatingIconState({ left, top, edge, minimized });
  }
}

function makeFloatingIconDraggable(icon) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  let edge = 'right';

  icon.onmousedown = function (e) {
    if (icon.classList.contains('minimized')) return;
    if (e.target.tagName === 'IMG' || e.target === icon) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = icon.offsetLeft;
      startTop = icon.offsetTop;
      document.body.style.userSelect = 'none';
      document.onmousemove = drag;
      document.onmouseup = stopDrag;
    }
  };

  function drag(e) {
    if (!isDragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;
    // Clamp to viewport
    newTop = Math.max(10, Math.min(window.innerHeight - 58, newTop));
    newLeft = Math.max(0, Math.min(window.innerWidth - 48, newLeft));
    icon.style.left = newLeft + 'px';
    icon.style.top = newTop + 'px';
    icon.style.right = '';
    icon.style.bottom = '';
  }

  function stopDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
    document.onmousemove = null;
    document.onmouseup = null;
    // Snap to nearest edge
    let left = icon.offsetLeft;
    let edgeToSnap = (left < window.innerWidth / 2) ? 'left' : 'right';
    if (edgeToSnap === 'left') {
      icon.style.left = '20px';
      icon.style.right = '';
      edge = 'left';
    } else {
      icon.style.left = '';
      icon.style.right = '20px';
      edge = 'right';
    }
    let top = icon.offsetTop;
    setFloatingIconPosition(icon, left, top, edge);
  }
}

function minimizeFloatingIcon(instant) {
  if (!vuFloatingIcon) return;
  vuFloatingIcon.classList.add('minimized');
  vuFloatingIcon.style.width = '20px';
  vuFloatingIcon.style.height = '20px';
  vuFloatingIcon.style.borderRadius = '50%';
  vuFloatingIcon.style.overflow = 'hidden';
  vuFloatingIcon.style.opacity = '0.5';
  vuFloatingIcon.style.background = 'var(--vu-blue)';
  if (vuFloatingIcon.firstChild && vuFloatingIcon.firstChild.tagName === 'IMG') {
    vuFloatingIcon.firstChild.style.opacity = '0';
    vuFloatingIcon.firstChild.style.width = '0';
    vuFloatingIcon.firstChild.style.height = '0';
  }
  // Save state
  let left = vuFloatingIcon.offsetLeft;
  let top = vuFloatingIcon.offsetTop;
  let edge = (left < window.innerWidth / 2) ? 'left' : 'right';
  setFloatingIconPosition(vuFloatingIcon, left, top, edge, true);
}

function restoreFloatingIcon() {
  if (!vuFloatingIcon) return;
  vuFloatingIcon.classList.remove('minimized');
  vuFloatingIcon.style.width = '48px';
  vuFloatingIcon.style.height = '48px';
  vuFloatingIcon.style.borderRadius = '50%';
  vuFloatingIcon.style.opacity = '1';
  vuFloatingIcon.style.background = 'var(--vu-blue)';
  if (vuFloatingIcon.firstChild && vuFloatingIcon.firstChild.tagName === 'IMG') {
    vuFloatingIcon.firstChild.style.opacity = '1';
    vuFloatingIcon.firstChild.style.width = '28px';
    vuFloatingIcon.firstChild.style.height = '28px';
  }
  // Save state
  let left = vuFloatingIcon.offsetLeft;
  let top = vuFloatingIcon.offsetTop;
  let edge = (left < window.innerWidth / 2) ? 'left' : 'right';
  setFloatingIconPosition(vuFloatingIcon, left, top, edge, false);
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
  title.textContent = 'VU Education Lab AI Assistant';
  
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
  if (!vuDraggableWindow) {
    createDraggableWindow();
  }
  
  if (vuDraggableWindow.classList.contains('hidden')) {
    showDraggableWindow();
  } else {
    hideDraggableWindow();
  }
}

// Show the draggable window
function showDraggableWindow() {
  // Create if not exists
  if (!vuDraggableWindow) {
    createDraggableWindow();
  }
  
  // Remove hidden class
  vuDraggableWindow.classList.remove('hidden');
  
  // Position window if not already positioned
  if (!vuDraggableWindow.style.top && !vuDraggableWindow.style.left) {
    // Default to centered position
    vuDraggableWindow.style.top = '50%';
    vuDraggableWindow.style.left = '50%';
    vuDraggableWindow.style.transform = 'translate(-50%, -50%)';
  }
}

// Hide the draggable window
function hideDraggableWindow() {
  if (vuDraggableWindow) {
    vuDraggableWindow.classList.add('hidden');
  }
}

// Check if the current page is likely educational or informational
function isEducationalPage() {
  // Domains commonly used for educational or informational purposes
  const educationalDomains = [
    '.edu', '.ac.', 'scholar.', 'academic.', 'research.', 'science.',
    'learning.', 'study.', 'course.', 'class.', 'lecture.', 'school.',
    'university.', 'college.', 'academy.', 'institute.', 'faculty.',
    '.org', '.gov', '.info', 'wikipedia.', 'encyclopedia.', 'khanacademy.', 'britannica.'
  ];

  // Keywords that suggest informational or article content
  const infoKeywords = [
    'education', 'learning', 'academic', 'course', 'study', 'research', 'school', 'university', 'college', 'lecture', 'class',
    'article', 'blog', 'news', 'how to', 'guide', 'tutorial', 'encyclopedia', 'reference', 'explanation', 'information', 'faq', 'summary', 'lesson', 'curriculum', 'report', 'analysis', 'review', 'insight', 'explained'
  ];

  const url = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const metaTags = document.querySelectorAll('meta[name="keywords"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]');
  const metaContent = Array.from(metaTags).map(tag => tag.getAttribute('content') || '').join(' ').toLowerCase();

  // Check domain
  const isEduDomain = educationalDomains.some(domain => url.includes(domain));

  // Check meta content and URL for keywords
  const hasInfoKeywords = infoKeywords.some(keyword => metaContent.includes(keyword) || pathname.includes(keyword));

  // Check for article-like structure
  const hasArticleTag = document.querySelector('article, main, section');
  const hasHeadings = document.querySelector('h1, h2');
  const wordCount = document.body.innerText.split(/\s+/).length;

  // Check for Open Graph type article
  const ogType = document.querySelector('meta[property="og:type"]');
  const isOGArticle = ogType && ogType.getAttribute('content') && ogType.getAttribute('content').toLowerCase().includes('article');

  // Heuristic: If the page has a lot of text and at least one heading, it's likely informational
  const isLongInformational = wordCount > 500 && hasHeadings;

  // Return true if any of the above criteria are met
  return (
    isEduDomain ||
    hasInfoKeywords ||
    hasArticleTag ||
    isOGArticle ||
    isLongInformational
  );
}

// Initialize content script
async function initialize() {
  console.log('VU Education Lab AI Assistant content script loaded');
  if (isEducationalPage()) {
    chrome.storage.local.get(['show_floating_popup'], (result) => {
      const showFloating = result.show_floating_popup !== false; // default true
      if (showFloating) {
        setTimeout(() => {
          createFloatingIcon();
        }, 1500);
      }
    });
  }
}

// Run initialization
initialize();
