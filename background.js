// Background script for VU Education Lab AI Assistant
// Handles communication between content script and popup

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "analyzeContent":
      chrome.runtime.sendMessage({
        action: "processAPIRequest",
        content: request.content,
        prompt: request.prompt
      });
      break;
    case "getPageContent":
      chrome.scripting.executeScript({
        target: { tabId: request.tabId },
        function: getPageContent
      }).then(results => {
        sendResponse({ content: results[0].result });
      });
      return true; // Required for async sendResponse
    default:
      break;
  }
});

// Function to extract page content
function getPageContent() {
  return {
    title: document.title,
    url: window.location.href,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    headings: Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => h.innerText)
      .join('\n'),
    bodyText: document.body.innerText
  };
}
