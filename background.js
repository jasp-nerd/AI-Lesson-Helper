// Background script for VU Amsterdam AI Assistant
// Handles communication between content script and popup

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeContent") {
    // Forward the content to the API handler in popup.js
    chrome.runtime.sendMessage({
      action: "processAPIRequest",
      content: request.content,
      prompt: request.prompt
    });
  }
  
  if (request.action === "getPageContent") {
    // Execute script to get page content
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      function: getPageContent
    }).then(results => {
      sendResponse({ content: results[0].result });
    });
    return true; // Required for async sendResponse
  }
});

// Function to extract page content
function getPageContent() {
  // Get the main content of the page
  const bodyText = document.body.innerText;
  const title = document.title;
  
  // Get meta description if available
  let description = "";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    description = metaDesc.getAttribute("content");
  }
  
  // Get headings for structure
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .map(h => h.innerText)
    .join('\n');
  
  return {
    title: title,
    description: description,
    headings: headings,
    bodyText: bodyText
  };
}
