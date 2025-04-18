// Utility: safely get element by id
function $(id) {
  return document.getElementById(id);
}

// i18n: Load translation files dynamically
let translations = {};
let currentLanguage = 'english';

// Loads the translation JSON for the selected language
async function loadTranslations(lang) {
  if (!['english', 'dutch'].includes(lang)) lang = 'english';
  let localeFile = lang === 'english' ? 'locales/en.json' : 'locales/nl.json';
  try {
    const res = await fetch(localeFile);
    translations[lang] = await res.json();
  } catch (e) {
    console.error('Failed to load translations:', localeFile, e);
    translations[lang] = {};
  }
}

// Centralized translation getter
function getTranslation(key) {
  return (translations[currentLanguage] && translations[currentLanguage][key]) || key;
}

// Helper: Get language name in English for prompt suffix
function getLanguageDisplayName(lang) {
  switch (lang) {
    case 'dutch': return 'Dutch';
    // Add more languages as needed
    default: return lang.charAt(0).toUpperCase() + lang.slice(1);
  }
}

// Helper: Get prompt from EN locale, regardless of current language
function getEnglishPrompt(key) {
  if (translations['english'] && translations['english'][key]) {
    return translations['english'][key];
  }
  return key;
}

// Modify prompt before sending to Gemini
function getPromptWithLanguageSuffix(promptKey) {
  let prompt = getTranslation(promptKey);
  if (currentLanguage !== 'english') {
    // Always use the English prompt template, not the translation key value
    prompt = getEnglishPrompt(promptKey);
    return prompt + ` IMPORTANT: Please use ${getLanguageDisplayName(currentLanguage)} in your response.`;
  }
  return prompt;
}

// Update all UI elements with translation keys
function updateUILanguage() {
  // Title
  if ($("title")) $("title").innerText = getTranslation('title');
  // Language toggle button
  if (languageToggleBtn) languageToggleBtn.innerText = currentLanguage === 'english' ? 'NL' : 'EN';

  // Tabs
  const tabKeys = ['summarize', 'quiz', 'explain', 'suggest', 'custom'];
  tabButtons.forEach((button, idx) => {
    const tabKey = tabKeys[idx];
    if (tabKey && getTranslation(tabKey)) {
      button.textContent = getTranslation(tabKey);
    }
  });

  // Summarize tab
  const summarizeH2 = document.querySelector('#summarize h2');
  if (summarizeH2) summarizeH2.textContent = getTranslation('summarizeTitle');
  const summarizeDescP = document.querySelector('#summarize p');
  if (summarizeDescP) summarizeDescP.textContent = getTranslation('summarizeDesc');
  const summaryLengthShort = document.querySelector('#summary-length option[value="short"]');
  if (summaryLengthShort) summaryLengthShort.textContent = getTranslation('short');
  const summaryLengthMedium = document.querySelector('#summary-length option[value="medium"]');
  if (summaryLengthMedium) summaryLengthMedium.textContent = getTranslation('medium');
  const summaryLengthLong = document.querySelector('#summary-length option[value="long"]');
  if (summaryLengthLong) summaryLengthLong.textContent = getTranslation('long');
  if (generateSummaryBtn) generateSummaryBtn.textContent = getTranslation('generate');

  // Quiz tab
  const quizH2 = document.querySelector('#quiz h2');
  if (quizH2) quizH2.textContent = getTranslation('quizTitle');
  const quizDescP = document.querySelector('#quiz p');
  if (quizDescP) quizDescP.textContent = getTranslation('quizDesc');
  const questionTypeMultiple = document.querySelector('#question-type option[value="multiple-choice"]');
  if (questionTypeMultiple) questionTypeMultiple.textContent = getTranslation('multipleChoice');
  const questionTypeTrueFalse = document.querySelector('#question-type option[value="true-false"]');
  if (questionTypeTrueFalse) questionTypeTrueFalse.textContent = getTranslation('trueFalse');
  const questionTypeShortAnswer = document.querySelector('#question-type option[value="short-answer"]');
  if (questionTypeShortAnswer) questionTypeShortAnswer.textContent = getTranslation('shortAnswer');
  const questionTypeMixed = document.querySelector('#question-type option[value="mixed"]');
  if (questionTypeMixed) questionTypeMixed.textContent = getTranslation('mixed');
  const questionCount = document.querySelector('#question-count');
  if (questionCount) questionCount.placeholder = getTranslation('questionCount');
  const quizDifficulty = document.querySelector('#quiz-difficulty');
  if (quizDifficulty) quizDifficulty.placeholder = getTranslation('difficulty');
  const quizDifficultyEasy = document.querySelector('#quiz-difficulty option[value="easy"]');
  if (quizDifficultyEasy) quizDifficultyEasy.textContent = getTranslation('easy');
  const quizDifficultyMedium = document.querySelector('#quiz-difficulty option[value="medium"]');
  if (quizDifficultyMedium) quizDifficultyMedium.textContent = getTranslation('medium');
  const quizDifficultyHard = document.querySelector('#quiz-difficulty option[value="hard"]');
  if (quizDifficultyHard) quizDifficultyHard.textContent = getTranslation('hard');
  if (generateQuizBtn) generateQuizBtn.textContent = getTranslation('generate');

  // Explain tab
  const explainH2 = document.querySelector('#explain h2');
  if (explainH2) explainH2.textContent = getTranslation('explainTitle');
  const explainDescP = document.querySelector('#explain p');
  if (explainDescP) explainDescP.textContent = getTranslation('explainDesc');
  const topicInput = document.querySelector('#topic-input');
  if (topicInput) topicInput.placeholder = getTranslation('topicPlaceholder');
  const explanationLevelBeginner = document.querySelector('#explanation-level option[value="beginner"]');
  if (explanationLevelBeginner) explanationLevelBeginner.textContent = getTranslation('beginner');
  const explanationLevelIntermediate = document.querySelector('#explanation-level option[value="intermediate"]');
  if (explanationLevelIntermediate) explanationLevelIntermediate.textContent = getTranslation('intermediate');
  const explanationLevelAdvanced = document.querySelector('#explanation-level option[value="advanced"]');
  if (explanationLevelAdvanced) explanationLevelAdvanced.textContent = getTranslation('advanced');
  if (generateExplanationBtn) generateExplanationBtn.textContent = getTranslation('explain');

  // Suggest tab
  const suggestH2 = document.querySelector('#suggest h2');
  if (suggestH2) suggestH2.textContent = getTranslation('suggestTitle');
  const suggestDescP = document.querySelector('#suggest p');
  if (suggestDescP) suggestDescP.textContent = getTranslation('suggestDesc');
  const teachingFormatLecture = document.querySelector('#teaching-format option[value="lecture"]');
  if (teachingFormatLecture) teachingFormatLecture.textContent = getTranslation('lecture');
  const teachingFormatDiscussion = document.querySelector('#teaching-format option[value="discussion"]');
  if (teachingFormatDiscussion) teachingFormatDiscussion.textContent = getTranslation('discussion');
  const teachingFormatActivity = document.querySelector('#teaching-format option[value="activity"]');
  if (teachingFormatActivity) teachingFormatActivity.textContent = getTranslation('activity');
  const teachingFormatAssessment = document.querySelector('#teaching-format option[value="assessment"]');
  if (teachingFormatAssessment) teachingFormatAssessment.textContent = getTranslation('assessment');
  if (generateSuggestionsBtn) generateSuggestionsBtn.textContent = getTranslation('getSuggestions');

  // Loading
  const loadingP = document.querySelector('#loading p');
  if (loadingP) loadingP.textContent = getTranslation('processing');

  // Result actions
  if (copyResultBtn) copyResultBtn.textContent = getTranslation('copy');
  if (downloadResultBtn) downloadResultBtn.textContent = getTranslation('download');

  // Footer
  const footerP = document.querySelector('footer p');
  if (footerP) footerP.textContent = getTranslation('footer');

  // Custom tab
  const customH2 = document.querySelector('#custom h2');
  if (customH2) customH2.textContent = getTranslation('customTitle');
  const customDescP = document.querySelector('#custom p');
  if (customDescP) customDescP.textContent = getTranslation('customDesc');
  const customPromptInput = document.querySelector('#custom-prompt');
  if (customPromptInput) customPromptInput.placeholder = getTranslation('customPlaceholder');
  if (generateCustomBtn) generateCustomBtn.textContent = getTranslation('ask');
  const templateLabel = document.querySelector('.template-label');
  if (templateLabel) templateLabel.textContent = getTranslation('templateLabel');

  // Update template button texts
  const templateMainArgsBtn = document.querySelector('.template-btn[data-prompt="What are the main arguments presented in this text?"]');
  if (templateMainArgsBtn) templateMainArgsBtn.textContent = getTranslation('templateMainArgs');
  const templateConceptMapBtn = document.querySelector('.template-btn[data-prompt="Create a concept map based on this content."]');
  if (templateConceptMapBtn) templateConceptMapBtn.textContent = getTranslation('templateConceptMap');
  const templateImplicationsBtn = document.querySelector('.template-btn[data-prompt="What are the implications of this content for students?"]');
  if (templateImplicationsBtn) templateImplicationsBtn.textContent = getTranslation('templateImplications');
  const templateBiasAnalysisBtn = document.querySelector('.template-btn[data-prompt="Identify any biases or limitations in this content."]');
  if (templateBiasAnalysisBtn) templateBiasAnalysisBtn.textContent = getTranslation('templateBiasAnalysis');
  const templateLearningStylesBtn = document.querySelector('.template-btn[data-prompt="How could I adapt this content for different learning styles?"]');
  if (templateLearningStylesBtn) templateLearningStylesBtn.textContent = getTranslation('templateLearningStyles');
  const templateReflectionQuestionsBtn = document.querySelector('.template-btn[data-prompt="Create 3 reflection questions for students after studying this content."]');
  if (templateReflectionQuestionsBtn) templateReflectionQuestionsBtn.textContent = getTranslation('templateReflectionQuestions');

  // Update tooltips
  updateTooltips();
}

// Language switch handler
async function switchLanguage(lang) {
  if (!translations[lang]) await loadTranslations(lang);
  currentLanguage = lang;
  updateUILanguage();
  // Optionally, persist language choice
  localStorage.setItem('vu_extension_language', lang);
}

// On DOMContentLoaded, load default or saved language
document.addEventListener('DOMContentLoaded', async () => {
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
  
  languageToggleBtn = document.getElementById('language-toggle-btn');
  settingsBtn = document.getElementById('settings-btn');
  
  noApiKeyOverlay = document.getElementById('no-api-key-overlay');
  gotoSettingsBtn = document.getElementById('goto-settings-btn');
  
  generateCustomBtn = document.getElementById('generate-custom');
  customPromptInput = document.getElementById('custom-prompt');
  templateButtons = document.querySelectorAll('.template-btn');
  
  // Hide API key section (now only in settings)
  if (apiKeySection) apiKeySection.style.display = 'none';

  // Settings button navigation
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
  }
  
  // Go to settings from overlay
  if (gotoSettingsBtn) {
    gotoSettingsBtn.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
  }

  // Language: load saved or default
  const savedLang = localStorage.getItem('vu_extension_language');
  currentLanguage = savedLang || 'english';
  await loadTranslations('english');
  await loadTranslations('dutch');
  updateUILanguage();

  // Language toggle button
  if (languageToggleBtn) {
    languageToggleBtn.addEventListener('click', async () => {
      const nextLang = currentLanguage === 'english' ? 'dutch' : 'english';
      await switchLanguage(nextLang);
    });
  }

  // Check if API key is set, else show overlay
  chrome.storage.local.get(['gemini_api_key'], (result) => {
    if (!result.gemini_api_key) {
      if (noApiKeyOverlay) {
        noApiKeyOverlay.style.display = 'flex';
        noApiKeyOverlay.style.pointerEvents = 'auto';
      }
      if (featuresSection) featuresSection.classList.add('hidden');
    } else {
      if (noApiKeyOverlay) {
        noApiKeyOverlay.style.display = 'none';
        noApiKeyOverlay.style.pointerEvents = 'none';
      }
      if (featuresSection) featuresSection.classList.remove('hidden');
    }
  });

  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      addButtonClickEffect(button);
      switchTab(button.dataset.tab);
    });
  });
  
  // Feature buttons with click effects
  generateSummaryBtn.addEventListener('click', () => {
    addButtonClickEffect(generateSummaryBtn);
    generateSummary();
  });
  
  generateQuizBtn.addEventListener('click', () => {
    addButtonClickEffect(generateQuizBtn);
    generateQuiz();
  });
  
  generateExplanationBtn.addEventListener('click', () => {
    addButtonClickEffect(generateExplanationBtn);
    generateExplanation();
  });
  
  generateSuggestionsBtn.addEventListener('click', () => {
    addButtonClickEffect(generateSuggestionsBtn);
    generateSuggestions();
  });
  
  // Result actions
  copyResultBtn.addEventListener('click', () => {
    addButtonClickEffect(copyResultBtn);
    copyResult();
  });
  
  downloadResultBtn.addEventListener('click', () => {
    addButtonClickEffect(downloadResultBtn);
    downloadResult();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Add template button event listeners
  templateButtons.forEach(button => {
    button.addEventListener('click', () => {
      addButtonClickEffect(button);
      const prompt = currentLanguage === 'english' ? 
        button.dataset.prompt : button.dataset.promptNl;
      insertTemplate(prompt);
    });
  });
  
  generateCustomBtn.addEventListener('click', () => {
    addButtonClickEffect(generateCustomBtn);
    generateCustomResponse();
  });
  
  // Custom prompt keyboard shortcut
  customPromptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateCustomResponse();
    }
  });

  // Update tooltips based on current language
  updateTooltips();
});

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
  // Tab navigation with arrow keys when tabs are focused
  if (document.activeElement.classList.contains('tab-btn')) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      
      const activeTabIndex = Array.from(tabButtons).findIndex(btn => 
        btn.classList.contains('active')
      );
      
      let newIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (activeTabIndex + 1) % tabButtons.length;
      } else {
        newIndex = (activeTabIndex - 1 + tabButtons.length) % tabButtons.length;
      }
      
      tabButtons[newIndex].click();
      tabButtons[newIndex].focus();
    }
  }
  
  // Use Escape to clear status messages
  if (e.key === 'Escape') {
    if (apiStatus.textContent) {
      setTimeout(() => {
        apiStatus.textContent = '';
        apiStatus.className = '';
      }, 200);
    }
  }
}

// Add visual click effect to buttons
function addButtonClickEffect(button) {
  button.classList.add('button-click');
  setTimeout(() => {
    button.classList.remove('button-click');
  }, 300);
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
  
  const summaryLengthOption = document.getElementById('summary-length').value;
  const pageContent = await getCurrentTabContent();
  
  // Define specific length requirements based on the selected option
  let summaryLength;
  if (currentLanguage === 'english') {
    switch (summaryLengthOption) {
      case 'short':
        summaryLength = "Short (1-2 paragraphs, approximately 100-150 words total)";
        break;
      case 'medium':
        summaryLength = "Medium (3-4 paragraphs, approximately 250-350 words total)";
        break;
      case 'long':
        summaryLength = "Long (5+ paragraphs, approximately 500-700 words total)";
        break;
      default:
        summaryLength = "Medium (3-4 paragraphs)";
    }
  } else {
    // Dutch length descriptions
    switch (summaryLengthOption) {
      case 'short':
        summaryLength = "Kort (1-2 alinea's, ongeveer 100-150 woorden in totaal)";
        break;
      case 'medium':
        summaryLength = "Gemiddeld (3-4 alinea's, ongeveer 250-350 woorden in totaal)";
        break;
      case 'long':
        summaryLength = "Lang (5+ alinea's, ongeveer 500-700 woorden in totaal)";
        break;
      default:
        summaryLength = "Gemiddeld (3-4 alinea's)";
    }
  }
  
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
  
  const prompt = getPromptWithLanguageSuffix('summaryPrompt')
    .replace('{length}', summaryLength)
    .replace('{content}', structuredContent);
  
  callGemini(prompt, 'summarize');
  
  // Highlight key terms on the page
  highlightKeyTerms();
}

// Generate quiz questions from current page
async function generateQuiz() {
  showLoading();
  
  const questionType = document.getElementById('question-type').value;
  const questionCount = document.getElementById('question-count').value;
  const quizDifficulty = document.getElementById('quiz-difficulty').value;
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
  
  const quizOptions = getQuizOptions();
  const prompt = getPromptWithLanguageSuffix('quizPrompt')
    .replace('{count}', questionCount)
    .replace('{type}', questionType)
    .replace('{difficulty}', quizDifficulty)
    .replace('{level}', quizOptions.level)
    .replace('{content}', structuredContent);

  callGemini(prompt, 'quiz');
}

// Helper function to get quiz options
function getQuizOptions() {
  const type = document.getElementById('question-type').value;
  const difficulty = document.getElementById('quiz-difficulty').value;
  const level = 'university';
  return { type, difficulty, level };
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
    prompt = getPromptWithLanguageSuffix('explainTopicPrompt')
      .replace('{topic}', topic)
      .replace('{level}', level)
      .replace('{content}', structuredContent);
  } else {
    prompt = getPromptWithLanguageSuffix('explainGeneralPrompt')
      .replace('{level}', level)
      .replace('{content}', structuredContent);
  }
  
  callGemini(prompt, 'explain');
  
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
  
  const prompt = getPromptWithLanguageSuffix('suggestPrompt')
    .replace('{format}', format)
    .replace('{content}', structuredContent);
  
  callGemini(prompt, 'suggest');
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

// Call Gemini API
async function callGemini(prompt, feature) {
  // Get API key from storage
  chrome.storage.local.get(['gemini_api_key'], async (result) => {
    if (!result.gemini_api_key) {
      hideLoading();
      resultContent.textContent = 'API key not found. Please set your Google Gemini API key.';
      shakeElement(resultContainer);
      return;
    }
    
    try {
      // Prepare system prompt based on feature
      let systemPrompt;
      
      switch (feature) {
        case 'summarize':
          systemPrompt = getTranslation('summarizeSystemPrompt');
          break;
        case 'quiz':
          systemPrompt = getTranslation('quizSystemPrompt');
          break;
        case 'explain':
          systemPrompt = getTranslation('explainSystemPrompt');
          break;
        case 'suggest':
          systemPrompt = getTranslation('suggestSystemPrompt');
          break;
        case 'custom':
          systemPrompt = getTranslation('customSystemPrompt');
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
        result.gemini_api_key,
        prompt, 
        options
      );
      
      // Display the response with scroll effect
      displayResult(response);
      
    } catch (error) {
      hideLoading();
      resultContent.textContent = `Error: ${error.message}`;
      resultContent.classList.add('error-text');
      console.error('API Error:', error);
      shakeElement(resultContainer);
      
      setTimeout(() => {
        resultContent.classList.remove('error-text');
      }, 2000);
    }
  });
}

// Display API response with markdown formatting
function displayResult(text) {
  hideLoading();
  
  // Add animation for result appearance
  resultContent.style.opacity = '0';
  
  // Convert markdown to HTML using simple regex replacements
  const formattedText = convertMarkdownToHTML(text);
  
  // Use innerHTML to render the formatted HTML
  resultContent.innerHTML = formattedText;
  
  setTimeout(() => {
    resultContent.style.opacity = '1';
    
    // Smooth scroll to results
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Show action buttons with animation
    setTimeout(() => {
      resultActions.classList.remove('hidden');
      resultActions.style.opacity = '0';
      resultActions.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        resultActions.style.opacity = '1';
        resultActions.style.transform = 'translateY(0)';
      }, 50);
    }, 300);
  }, 150);
}

// Function to convert markdown to HTML
function convertMarkdownToHTML(text) {
  if (!text) return '';
  
  // Replace headings
  text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  text = text.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  
  // Replace bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace unordered lists
  text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*?<\/li>\n)+/gs, '<ul>$&</ul>');
  
  // Replace ordered lists (numbers)
  text = text.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*?<\/li>\n)+/gs, '<ol>$&</ol>');
  
  // Replace line breaks with paragraph tags
  const paragraphs = text.split('\n\n');
  text = paragraphs.map(p => {
    // Skip if it's already a formatted element
    if (p.trim().startsWith('<h') || 
        p.trim().startsWith('<ul') || 
        p.trim().startsWith('<ol') ||
        p.trim().startsWith('<li')) {
      return p;
    }
    return `<p>${p}</p>`;
  }).join('\n');
  
  return text;
}

// Show loading indicator
function showLoading() {
  resultContent.textContent = '';
  resultContent.style.opacity = '1';
  resultActions.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
  
  // Add fade-in animation for loading
  loadingIndicator.style.opacity = '0';
  setTimeout(() => {
    loadingIndicator.style.opacity = '1';
  }, 50);
}

// Hide loading indicator
function hideLoading() {
  // Add fade-out animation
  loadingIndicator.style.opacity = '0';
  
  setTimeout(() => {
  loadingIndicator.classList.add('hidden');
  }, 300);
}

// Copy result to clipboard
function copyResult() {
  // Create a temporary element to get the formatted text with proper line breaks
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = resultContent.innerHTML;
  
  // Process the HTML to create a clean text version with proper formatting
  const text = processHTMLForCopy(tempDiv);
  
  navigator.clipboard.writeText(text)
    .then(() => {
      const originalText = copyResultBtn.textContent;
      const originalWidth = copyResultBtn.offsetWidth;
      copyResultBtn.style.minWidth = `${originalWidth}px`;
      
      // Success feedback
      copyResultBtn.textContent = '✓ Copied!';
      copyResultBtn.classList.add('success-action');
      
      setTimeout(() => {
        copyResultBtn.textContent = originalText;
        copyResultBtn.classList.remove('success-action');
        setTimeout(() => {
          copyResultBtn.style.minWidth = '';
        }, 300);
      }, 2000);
    })
    .catch(err => {
      copyResultBtn.textContent = '❌ Failed';
      copyResultBtn.classList.add('error-action');
      
      setTimeout(() => {
        copyResultBtn.textContent = originalText;
        copyResultBtn.classList.remove('error-action');
      }, 2000);
      
      console.error('Failed to copy text: ', err);
    });
}

// Process HTML for copying with proper formatting
function processHTMLForCopy(element) {
  let result = '';
  const children = element.childNodes;
  
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      // Handle different HTML elements
      if (tagName === 'h1') {
        result += '# ' + processHTMLForCopy(node) + '\n\n';
      } else if (tagName === 'h2') {
        result += '## ' + processHTMLForCopy(node) + '\n\n';
      } else if (tagName === 'h3') {
        result += '### ' + processHTMLForCopy(node) + '\n\n';
      } else if (tagName === 'h4') {
        result += '#### ' + processHTMLForCopy(node) + '\n\n';
      } else if (tagName === 'p') {
        result += processHTMLForCopy(node) + '\n\n';
      } else if (tagName === 'strong') {
        result += '**' + processHTMLForCopy(node) + '**';
      } else if (tagName === 'em') {
        result += '*' + processHTMLForCopy(node) + '*';
      } else if (tagName === 'ul') {
        result += processHTMLForCopy(node) + '\n';
      } else if (tagName === 'ol') {
        result += processHTMLForCopy(node) + '\n';
      } else if (tagName === 'li') {
        const parent = node.parentNode;
        if (parent.tagName.toLowerCase() === 'ul') {
          result += '- ' + processHTMLForCopy(node) + '\n';
        } else if (parent.tagName.toLowerCase() === 'ol') {
          // Find the index of this li within its parent
          let index = 1;
          let sibling = node.previousElementSibling;
          while (sibling) {
            index++;
            sibling = sibling.previousElementSibling;
          }
          result += index + '. ' + processHTMLForCopy(node) + '\n';
        } else {
          result += '- ' + processHTMLForCopy(node) + '\n';
        }
      } else {
        result += processHTMLForCopy(node);
      }
    }
  }
  
  return result;
}

// Download result as text file
function downloadResult() {
  // Create a temporary element to get the formatted text
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = resultContent.innerHTML;
  
  // Process the HTML to create a clean text version with proper formatting
  const text = processHTMLForCopy(tempDiv);
  
  // Create two blob options: markdown and html
  const markdownBlob = new Blob([text], { type: 'text/markdown' });
  const htmlBlob = new Blob(['<html><head><style>body{font-family:Arial,sans-serif;line-height:1.6;max-width:800px;margin:0 auto;padding:20px}h1{color:#0077B3}h2{color:#0077B3}h3{color:#0077B3}ul,ol{margin-left:20px}li{margin-bottom:5px}</style></head><body>' + resultContent.innerHTML + '</body></html>'], { type: 'text/html' });
  
  // Create multiple download options
  const markdownUrl = URL.createObjectURL(markdownBlob);
  const htmlUrl = URL.createObjectURL(htmlBlob);
  
  // Add download animation
  downloadResultBtn.classList.add('success-action');
  
  // Create and trigger the markdown download
  const a = document.createElement('a');
  a.href = markdownUrl;
  a.download = `${activeTab}-result.md`;
  document.body.appendChild(a);
  a.click();
  
  // Small delay before the HTML download
  setTimeout(() => {
    // Create and trigger the HTML download
    const b = document.createElement('a');
    b.href = htmlUrl;
    b.download = `${activeTab}-result.html`;
    document.body.appendChild(b);
    b.click();
    document.body.removeChild(b);
    URL.revokeObjectURL(htmlUrl);
  }, 500);
  
  document.body.removeChild(a);
  URL.revokeObjectURL(markdownUrl);
  
  // Show success feedback
  const originalText = downloadResultBtn.textContent;
  downloadResultBtn.textContent = '✓ Downloaded';
  
  setTimeout(() => {
    downloadResultBtn.classList.remove('success-action');
    downloadResultBtn.textContent = originalText;
  }, 2000);
}

// Switch between tabs and update UI
function switchTab(tabName) {
  // Remove 'active' class from all tab buttons and panes
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  tabPanes.forEach(pane => {
    pane.classList.remove('active');
    pane.setAttribute('aria-hidden', 'true');
  });

  // Add 'active' class to the selected tab button and pane
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  const activePane = document.getElementById(tabName);
  if (activeBtn && activePane) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
    activePane.classList.add('active');
    activePane.setAttribute('aria-hidden', 'false');
    activeTab = tabName;
  }
}

// Shake an element to draw attention
function shakeElement(element) {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 1000);
}

// Update tooltips based on current language
function updateTooltips() {
  const tooltips = {
    'language-toggle-btn': currentLanguage === 'english' ? 'Schakel naar Nederlands' : 'Switch to English',
    'save-api-key': currentLanguage === 'english' ? 'Save your API key securely in the browser' : 'Sla je API-sleutel veilig op in de browser',
    'generate-summary': currentLanguage === 'english' ? 'Generate a summary of the current page' : 'Genereer een samenvatting van de huidige pagina',
    'generate-quiz': currentLanguage === 'english' ? 'Generate quiz questions from page content' : 'Genereer quizvragen op basis van de paginainhoud',
    'generate-explanation': currentLanguage === 'english' ? 'Get explanations of complex topics' : 'Krijg uitleg over complexe onderwerpen',
    'generate-suggestions': currentLanguage === 'english' ? 'Get teaching activity suggestions' : 'Krijg suggesties voor lesactiviteiten',
    'copy-result': currentLanguage === 'english' ? 'Copy content to clipboard' : 'Kopieer inhoud naar klembord',
    'download-result': currentLanguage === 'english' ? 'Download content as a text file' : 'Download inhoud als tekstbestand',
    'generate-custom': currentLanguage === 'english' ? 'Generate response using your custom prompt' : 'Genereer een antwoord met je aangepaste prompt'
  };
  
  // Update all tooltips
  Object.keys(tooltips).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('data-tooltip', tooltips[id]);
    }
  });
}
