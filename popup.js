// Popup script for VU Amsterdam AI Assistant

// DOM elements
let apiKeyInput, saveApiKeyBtn, apiStatus;
let featuresSection, apiKeySection;
let tabButtons, tabPanes;
let resultContainer, resultContent, loadingIndicator, resultActions;
let copyResultBtn, downloadResultBtn;

// Feature buttons
let generateSummaryBtn, generateQuizBtn, generateExplanationBtn, generateSuggestionsBtn;

// Current active tab
let activeTab = 'summarize';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  apiKeyInput = document.getElementById('api-key');
  saveApiKeyBtn = document.getElementById('save-api-key');
  apiStatus = document.getElementById('api-status');
  featuresSection = document.getElementById('features-section');
  apiKeySection = document.getElementById('api-key-section');
  
  tabButtons = document.querySelectorAll('.tab-btn');
  tabPanes = document.querySelectorAll('.tab-pane');
  
  resultContainer = document.getElementById('result-container');
  resultContent = document.getElementById('result-content');
  loadingIndicator = document.getElementById('loading');
  resultActions = document.querySelector('.result-actions');
  
  copyResultBtn = document.getElementById('copy-result');
  downloadResultBtn = document.getElementById('download-result');
  
  generateSummaryBtn = document.getElementById('generate-summary');
  generateQuizBtn = document.getElementById('generate-quiz');
  generateExplanationBtn = document.getElementById('generate-explanation');
  generateSuggestionsBtn = document.getElementById('generate-suggestions');
  
  // Check if API key is already saved
  checkApiKey();
  
  // Set up event listeners
  saveApiKeyBtn.addEventListener('click', saveApiKey);
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  
  // Feature buttons
  generateSummaryBtn.addEventListener('click', generateSummary);
  generateQuizBtn.addEventListener('click', generateQuiz);
  generateExplanationBtn.addEventListener('click', generateExplanation);
  generateSuggestionsBtn.addEventListener('click', generateSuggestions);
  
  // Result actions
  copyResultBtn.addEventListener('click', copyResult);
  downloadResultBtn.addEventListener('click', downloadResult);
});

// Check if API key exists in storage
function checkApiKey() {
  chrome.storage.local.get(['openai_api_key'], (result) => {
    if (result.openai_api_key) {
      apiKeyInput.value = '••••••••••••••••••••••••••';
      apiStatus.textContent = 'API key is set';
      apiStatus.style.color = 'green';
      showFeaturesSection();
    }
  });
}

// Save API key to storage
function saveApiKey() {
  const apiKey = apiKeyInput.value.trim();
  
  if (!apiKey) {
    apiStatus.textContent = 'Please enter a valid API key';
    apiStatus.style.color = 'red';
    return;
  }
  
  // Save to Chrome storage
  chrome.storage.local.set({ openai_api_key: apiKey }, () => {
    apiStatus.textContent = 'API key saved successfully';
    apiStatus.style.color = 'green';
    apiKeyInput.value = '••••••••••••••••••••••••••';
    showFeaturesSection();
  });
}

// Show features section after API key is set
function showFeaturesSection() {
  featuresSection.classList.remove('hidden');
}

// Switch between tabs
function switchTab(tabId) {
  activeTab = tabId;
  
  // Update active tab button
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabId) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Show active tab content
  tabPanes.forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
}

// Get current tab content
async function getCurrentTabContent() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "getPageContent" },
        (response) => {
          if (response && response.content) {
            resolve(response.content);
          } else {
            // If content script hasn't responded, try using the background script
            chrome.runtime.sendMessage(
              { 
                action: "getPageContent",
                tabId: activeTab.id
              },
              (response) => {
                resolve(response ? response.content : { 
                  title: activeTab.title,
                  url: activeTab.url,
                  text: "Could not extract page content."
                });
              }
            );
          }
        }
      );
    });
  });
}

// Generate summary of current page
async function generateSummary() {
  showLoading();
  
  const summaryLength = document.getElementById('summary-length').value;
  const pageContent = await getCurrentTabContent();
  
  // Create a more structured prompt using the enhanced content extraction
  let structuredContent = `Title: ${pageContent.title}\n`;
  
  if (pageContent.metaDescription) {
    structuredContent += `Description: ${pageContent.metaDescription}\n`;
  }
  
  if (pageContent.headings && pageContent.headings.h1 && pageContent.headings.h1.length > 0) {
    structuredContent += `Main Headings: ${pageContent.headings.h1.join(', ')}\n`;
  }
  
  if (pageContent.paragraphs && pageContent.paragraphs.length > 0) {
    structuredContent += `\nContent:\n${pageContent.paragraphs.join('\n\n')}\n`;
  } else {
    structuredContent += `\nContent:\n${pageContent.text}\n`;
  }
  
  const prompt = `Summarize the following content for a teacher's lesson planning. 
  Length: ${summaryLength}.
  Focus on educational value, key concepts, and learning objectives.
  Organize the summary with clear sections and highlight important terminology.
  Include 2-3 potential discussion questions at the end.
  IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.
  
  ${structuredContent}`;
  
  callOpenAI(prompt, 'summarize');
  
  // Highlight key terms on the page
  highlightKeyTerms();
}

// Generate quiz questions from current page
async function generateQuiz() {
  showLoading();
  
  const questionType = document.getElementById('question-type').value;
  const questionCount = document.getElementById('question-count').value;
  const pageContent = await getCurrentTabContent();
  
  // Create a more structured prompt using the enhanced content extraction
  let structuredContent = `Title: ${pageContent.title}\n`;
  
  if (pageContent.headings && pageContent.headings.h1 && pageContent.headings.h1.length > 0) {
    structuredContent += `Main Headings: ${pageContent.headings.h1.join(', ')}\n`;
  }
  
  if (pageContent.paragraphs && pageContent.paragraphs.length > 0) {
    structuredContent += `\nContent:\n${pageContent.paragraphs.join('\n\n')}\n`;
  } else {
    structuredContent += `\nContent:\n${pageContent.text}\n`;
  }
  
  // Include lists if available
  if (pageContent.lists && pageContent.lists.length > 0) {
    structuredContent += `\nLists:\n`;
    pageContent.lists.forEach(list => {
      structuredContent += `${list.type.toUpperCase()}:\n`;
      list.items.forEach((item, index) => {
        structuredContent += `${index + 1}. ${item}\n`;
      });
      structuredContent += `\n`;
    });
  }
  
  const prompt = `Create ${questionCount} ${questionType} quiz questions based on the following content.
  Include answers for each question.
  For multiple choice questions, provide 4 options with one correct answer.
  For true/false questions, clearly state whether the statement is true or false.
  For short answer questions, provide a model answer.
  Ensure questions test different cognitive levels (knowledge, comprehension, application, analysis).
  IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.
  
  ${structuredContent}`;
  
  callOpenAI(prompt, 'quiz');
}

// Generate explanation of complex topics
async function generateExplanation() {
  showLoading();
  
  const topic = document.getElementById('topic-input').value;
  const level = document.getElementById('explanation-level').value;
  const pageContent = await getCurrentTabContent();
  
  // Create a more structured prompt using the enhanced content extraction
  let structuredContent = `Title: ${pageContent.title}\n`;
  
  if (pageContent.headings && pageContent.headings.h1 && pageContent.headings.h1.length > 0) {
    structuredContent += `Main Headings: ${pageContent.headings.h1.join(', ')}\n`;
  }
  
  if (pageContent.paragraphs && pageContent.paragraphs.length > 0) {
    structuredContent += `\nContent:\n${pageContent.paragraphs.join('\n\n')}\n`;
  } else {
    structuredContent += `\nContent:\n${pageContent.text}\n`;
  }
  
  let prompt;
  if (topic) {
    prompt = `Explain the concept of "${topic}" from the following content at a ${level} level.
    Make it easy for teachers to explain to their students.
    Include:
    1. A simple definition
    2. Real-world examples or analogies
    3. Visual description that could be drawn on a board
    4. Common misconceptions to avoid
    5. Step-by-step explanation for complex processes
    IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.
    
    ${structuredContent}`;
  } else {
    prompt = `Identify and explain 3-5 complex concepts from the following content at a ${level} level.
    Make it easy for teachers to explain to their students.
    For each concept include:
    1. A simple definition
    2. Real-world examples or analogies
    3. Visual description that could be drawn on a board
    4. Common misconceptions to avoid
    IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.
    
    ${structuredContent}`;
  }
  
  callOpenAI(prompt, 'explain');
  
  // If a specific topic was provided, highlight it on the page
  if (topic) {
    highlightSpecificTerm(topic);
  }
}

// Generate teaching suggestions
async function generateSuggestions() {
  showLoading();
  
  const format = document.getElementById('teaching-format').value;
  const pageContent = await getCurrentTabContent();
  
  // Create a more structured prompt using the enhanced content extraction
  let structuredContent = `Title: ${pageContent.title}\n`;
  
  if (pageContent.headings && pageContent.headings.h1 && pageContent.headings.h1.length > 0) {
    structuredContent += `Main Headings: ${pageContent.headings.h1.join(', ')}\n`;
  }
  
  if (pageContent.paragraphs && pageContent.paragraphs.length > 0) {
    structuredContent += `\nContent:\n${pageContent.paragraphs.join('\n\n')}\n`;
  } else {
    structuredContent += `\nContent:\n${pageContent.text}\n`;
  }
  
  const prompt = `Provide teaching suggestions and activity ideas for a ${format} based on the following content.
  Include:
  1. 3-5 specific teaching activities with clear instructions
  2. Estimated time for each activity
  3. Required materials or preparation
  4. Learning objectives addressed
  5. Assessment strategies to measure understanding
  6. Differentiation options for various student levels
  IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.
  
  ${structuredContent}`;
  
  callOpenAI(prompt, 'suggest');
}

// Highlight key terms on the page
async function highlightKeyTerms() {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "clearHighlights" }
      );
    });
  } catch (error) {
    console.error('Error clearing highlights:', error);
  }
}

// Highlight specific term on the page
async function highlightSpecificTerm(term) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(
        activeTab.id,
        { 
          action: "highlightText",
          text: term
        }
      );
    });
  } catch (error) {
    console.error('Error highlighting term:', error);
  }
}

// Call OpenAI API (Gemini 2.0 Flash)
async function callOpenAI(prompt, feature) {
  // Get API key from storage
  chrome.storage.local.get(['openai_api_key'], async (result) => {
    if (!result.openai_api_key) {
      hideLoading();
      resultContent.textContent = 'API key not found. Please set your OpenAI API key.';
      return;
    }
    
    try {
      // Prepare system prompt based on feature
      let systemPrompt;
      switch (feature) {
        case 'summarize':
          systemPrompt = "You are an AI assistant for teachers. Summarize the content in a clear, concise way that would be useful for lesson planning. Focus on key concepts, main ideas, and educational value. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.";
          break;
        case 'quiz':
          systemPrompt = "You are an AI assistant for teachers. Generate quiz questions based on the content provided. Include a mix of question types and provide answers. Format the questions clearly with numbered items. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.";
          break;
        case 'explain':
          systemPrompt = "You are an AI assistant for teachers. Explain complex concepts from the content in simpler terms that would be easy for teachers to use with their students. Break down difficult ideas into understandable components. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.";
          break;
        case 'suggest':
          systemPrompt = "You are an AI assistant for teachers. Provide teaching suggestions, activity ideas, and discussion points based on the content. Focus on practical, engaging approaches that would work well in a classroom setting. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.";
          break;
      }
      
      // Set options for API call
      const options = {
        systemPrompt: systemPrompt,
        temperature: 0.7,
        maxTokens: 1024
      };
      
      // Call the API using the window.GeminiAPI exported from api.js
      const response = await window.GeminiAPI.generateContent(
        result.openai_api_key,
        prompt, 
        options
      );
      
      // Display the response
      displayResult(response);
      
    } catch (error) {
      hideLoading();
      resultContent.textContent = `Error: ${error.message}`;
      console.error('API Error:', error);
    }
  });
}

// Display API response
function displayResult(text) {
  hideLoading();
  resultContent.textContent = text;
  resultActions.classList.remove('hidden');
}

// Show loading indicator
function showLoading() {
  resultContent.textContent = '';
  resultActions.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
}

// Hide loading indicator
function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

// Copy result to clipboard
function copyResult() {
  navigator.clipboard.writeText(resultContent.textContent)
    .then(() => {
      const originalText = copyResultBtn.textContent;
      copyResultBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyResultBtn.textContent = originalText;
      }, 2000);
    });
}

// Download result as text file
function downloadResult() {
  const text = resultContent.textContent;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activeTab}-result.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
