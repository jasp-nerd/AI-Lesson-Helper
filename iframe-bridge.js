// Bridge script for communication between iframe and parent page
// This script is loaded in popup.html when it's used in an iframe

// Check if we're in an iframe
const isInIframe = window !== window.top;

if (isInIframe) {
  console.log('VU Amsterdam AI Assistant running in iframe mode');
  
  // Listen for messages from the parent window
  window.addEventListener('message', (event) => {
    // Only accept messages from the same origin for security
    if (event.origin !== window.location.origin) return;
    
    if (event.data.action === 'getPageContent') {
      // Request page content from parent via content script
      window.parent.postMessage({ action: 'requestPageContent' }, '*');
    }
    
    if (event.data.action === 'receivePageContent') {
      // Forward the content to the extension's popup script
      if (window.receivePageContentFromParent) {
        window.receivePageContentFromParent(event.data.content);
      }
    }
  });
  
  // Override the chrome.tabs API for iframe context
  if (window.chrome && window.chrome.tabs) {
    const originalQuery = chrome.tabs.query;
    
    // Override the chrome.tabs.query method
    chrome.tabs.query = function(queryInfo, callback) {
      if (queryInfo.active && queryInfo.currentWindow) {
        // We're in an iframe, so we need to get the parent page content
        window.parent.postMessage({ action: 'requestPageContent' }, '*');
        
        // Store the callback to be called when we receive the content
        window.receivePageContentFromParent = function(content) {
          callback([{
            id: 0,
            url: content.url,
            title: content.title,
            active: true,
            currentWindow: true
          }]);
        };
      } else {
        // Fall back to original behavior for other queries
        originalQuery(queryInfo, callback);
      }
    };
    
    // Override the chrome.tabs.sendMessage method
    chrome.tabs.sendMessage = function(tabId, message, callback) {
      if (message.action === 'getPageContent') {
        // Request the content from the parent page
        window.parent.postMessage({ 
          action: 'requestPageContent',
          forwarded: true
        }, '*');
        
        // Store the callback to be called when we receive the content
        window.receivePageContentFromParent = function(content) {
          if (callback) {
            callback({ content: content });
          }
        };
      } else if (message.action === 'highlightText') {
        // Forward highlight request to the parent page
        window.parent.postMessage({ 
          action: 'highlightText',
          text: message.text
        }, '*');
        
        if (callback) {
          callback({ success: true });
        }
      } else if (message.action === 'clearHighlights') {
        // Forward clear highlights request to the parent page
        window.parent.postMessage({ 
          action: 'clearHighlights'
        }, '*');
        
        if (callback) {
          callback({ success: true });
        }
      }
    };
  }
} 