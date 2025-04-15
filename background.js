// Background script for VU Amsterdam AI Assistant
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
  const bodyText = document.body.innerText;
  const title = document.title;

  let description = "";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    description = metaDesc.getAttribute("content");
  }

  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .map(h => h.innerText)
    .join('\n');

  return {
    title,
    description,
    headings,
    bodyText
  };
}
