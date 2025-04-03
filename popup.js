// Popup script for VU Amsterdam AI Assistant

// Language translations
const translations = {
  english: {
    title: 'AI Assistant for Teachers',
    apiKeySetup: 'API Key Setup',
    apiKeyInstructions: 'Enter your OpenAI API key to use the Gemini 2.0 Flash model:',
    enterApiKey: 'Enter your OpenAI API key',
    save: 'Save',
    apiKeySet: 'API key is set',
    apiKeyInvalid: 'Please enter a valid API key',
    apiKeySaved: 'API key saved successfully',
    
    // Tabs
    summarize: 'Summarize',
    quiz: 'Quiz Questions',
    explain: 'Explain',
    suggest: 'Teaching Tips',
    
    // Summarize tab
    summarizeTitle: 'Summarize Content',
    summarizeDesc: 'Generate a concise summary of the current page for lesson planning.',
    short: 'Short (1-2 paragraphs)',
    medium: 'Medium (3-4 paragraphs)',
    long: 'Long (5+ paragraphs)',
    generate: 'Generate',
    
    // Quiz tab
    quizTitle: 'Generate Quiz Questions',
    quizDesc: 'Create quiz questions based on the current page content.',
    multipleChoice: 'Multiple Choice',
    trueFalse: 'True/False',
    shortAnswer: 'Short Answer',
    mixed: 'Mixed',
    questionCount: 'Number of questions',
    
    // Explain tab
    explainTitle: 'Explain Complex Topics',
    explainDesc: 'Simplify difficult concepts from the current page.',
    topicPlaceholder: 'Enter specific topic or leave blank for auto-detection',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    explain: 'Explain',
    
    // Suggest tab
    suggestTitle: 'Teaching Suggestions',
    suggestDesc: 'Get teaching tips and activity ideas based on the current page content.',
    lecture: 'Lecture',
    discussion: 'Discussion',
    activity: 'Activity',
    assessment: 'Assessment',
    getSuggestions: 'Get Suggestions',
    
    // Result actions
    processing: 'Processing your request...',
    copy: 'Copy to Clipboard',
    download: 'Download',
    
    // Footer
    footer: 'Developed for Vrije Universiteit Amsterdam',
    
    // API Prompts
    // Summarize prompts
    summaryPrompt: `Summarize the following content for a teacher's lesson planning. 
Length: {length}.
Focus on educational value, key concepts, and learning objectives.
Organize the summary with clear sections and highlight important terminology.
Include 2-3 potential discussion questions at the end.
IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.

{content}`,
    
    // Quiz prompts
    quizPrompt: `Create {count} {type} quiz questions based on the following content.
Include answers for each question.
For multiple choice questions, provide 4 options with one correct answer.
For true/false questions, clearly state whether the statement is true or false.
For short answer questions, provide a model answer.
Ensure questions test different cognitive levels (knowledge, comprehension, application, analysis).
IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.

{content}`,
    
    // Explain prompts
    explainTopicPrompt: `Explain the concept of "{topic}" from the following content at a {level} level.
Make it easy for teachers to explain to their students.
Include:
1. A simple definition
2. Real-world examples or analogies
3. Visual description that could be drawn on a board
4. Common misconceptions to avoid
5. Step-by-step explanation for complex processes
IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.

{content}`,
    
    explainGeneralPrompt: `Identify and explain 3-5 complex concepts from the following content at a {level} level.
Make it easy for teachers to explain to their students.
For each concept include:
1. A simple definition
2. Real-world examples or analogies
3. Visual description that could be drawn on a board
4. Common misconceptions to avoid
IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.

{content}`,
    
    // Suggest prompts
    suggestPrompt: `Provide teaching suggestions and activity ideas for a {format} based on the following content.
Include:
1. 3-5 specific teaching activities with clear instructions
2. Estimated time for each activity
3. Required materials or preparation
4. Learning objectives addressed
5. Assessment strategies to measure understanding
6. Differentiation options for various student levels
IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.

{content}`,
    
    // System prompts
    summarizeSystemPrompt: "You are an AI assistant for teachers. Summarize the content in a clear, concise way that would be useful for lesson planning. Focus on key concepts, main ideas, and educational value. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.",
    
    quizSystemPrompt: "You are an AI assistant for teachers. Generate quiz questions based on the content provided. Include a mix of question types and provide answers. Format the questions clearly with numbered items. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.",
    
    explainSystemPrompt: "You are an AI assistant for teachers. Explain complex concepts from the content in simpler terms that would be easy for teachers to use with their students. Break down difficult ideas into understandable components. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax.",
    
    suggestSystemPrompt: "You are an AI assistant for teachers. Provide teaching suggestions, activity ideas, and discussion points based on the content. Focus on practical, engaging approaches that would work well in a classroom setting. IMPORTANT: Do NOT use Markdown formatting in your response. Use plain text only with no special formatting symbols or syntax."
  },
  
  dutch: {
    title: 'AI-assistent voor Docenten',
    apiKeySetup: 'API-sleutel Instellen',
    apiKeyInstructions: 'Voer je OpenAI API-sleutel in om het Gemini 2.0 Flash model te gebruiken:',
    enterApiKey: 'Voer je OpenAI API-sleutel in',
    save: 'Opslaan',
    apiKeySet: 'API-sleutel is ingesteld',
    apiKeyInvalid: 'Voer een geldige API-sleutel in',
    apiKeySaved: 'API-sleutel succesvol opgeslagen',
    
    // Tabs
    summarize: 'Samenvatten',
    quiz: 'Quizvragen',
    explain: 'Uitleggen',
    suggest: 'Lestips',
    
    // Summarize tab
    summarizeTitle: 'Inhoud Samenvatten',
    summarizeDesc: 'Maak een beknopte samenvatting van de huidige pagina voor lesplanning.',
    short: 'Kort (1-2 alinea\'s)',
    medium: 'Gemiddeld (3-4 alinea\'s)',
    long: 'Lang (5+ alinea\'s)',
    generate: 'Genereren',
    
    // Quiz tab
    quizTitle: 'Quizvragen Genereren',
    quizDesc: 'Maak quizvragen op basis van de inhoud van de huidige pagina.',
    multipleChoice: 'Meerkeuze',
    trueFalse: 'Waar/Onwaar',
    shortAnswer: 'Kort Antwoord',
    mixed: 'Gemengd',
    questionCount: 'Aantal vragen',
    
    // Explain tab
    explainTitle: 'Complexe Onderwerpen Uitleggen',
    explainDesc: 'Vereenvoudig moeilijke concepten van de huidige pagina.',
    topicPlaceholder: 'Voer specifiek onderwerp in of laat leeg voor automatische detectie',
    beginner: 'Beginner',
    intermediate: 'Gevorderd',
    advanced: 'Expert',
    explain: 'Uitleggen',
    
    // Suggest tab
    suggestTitle: 'Lesadviezen',
    suggestDesc: 'Krijg lestips en activiteitenideeën op basis van de inhoud van de huidige pagina.',
    lecture: 'Hoorcollege',
    discussion: 'Discussie',
    activity: 'Activiteit',
    assessment: 'Beoordeling',
    getSuggestions: 'Krijg Suggesties',
    
    // Result actions
    processing: 'Je verzoek wordt verwerkt...',
    copy: 'Kopiëren naar Klembord',
    download: 'Downloaden',
    
    // Footer
    footer: 'Ontwikkeld voor Vrije Universiteit Amsterdam',
    
    // API Prompts
    // Summarize prompts
    summaryPrompt: `Vat de volgende inhoud samen voor de lesplanning van een docent. 
Lengte: {length}.
Focus op educatieve waarde, kernconcepten en leerdoelen.
Organiseer de samenvatting met duidelijke secties en markeer belangrijke terminologie.
Voeg aan het einde 2-3 potentiële discussievragen toe.
BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.

{content}`,
    
    // Quiz prompts
    quizPrompt: `Maak {count} {type} quizvragen op basis van de volgende inhoud.
Voeg antwoorden toe voor elke vraag.
Voor meerkeuzevragen, geef 4 opties met één juist antwoord.
Voor waar/onwaar-vragen, geef duidelijk aan of de stelling waar of onwaar is.
Voor kort-antwoordvragen, geef een modelantwoord.
Zorg ervoor dat vragen verschillende cognitieve niveaus testen (kennis, begrip, toepassing, analyse).
BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.

{content}`,
    
    // Explain prompts
    explainTopicPrompt: `Leg het concept "{topic}" uit van de volgende inhoud op een {level} niveau.
Maak het makkelijk voor docenten om het aan hun studenten uit te leggen.
Neem op:
1. Een eenvoudige definitie
2. Voorbeelden uit de praktijk of analogieën
3. Visuele beschrijving die op een bord getekend kan worden
4. Veelvoorkomende misvattingen om te vermijden
5. Stap-voor-stap uitleg voor complexe processen
BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.

{content}`,
    
    explainGeneralPrompt: `Identificeer en leg 3-5 complexe concepten uit van de volgende inhoud op een {level} niveau.
Maak het makkelijk voor docenten om ze aan hun studenten uit te leggen.
Neem voor elk concept op:
1. Een eenvoudige definitie
2. Voorbeelden uit de praktijk of analogieën
3. Visuele beschrijving die op een bord getekend kan worden
4. Veelvoorkomende misvattingen om te vermijden
BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.

{content}`,
    
    // Suggest prompts
    suggestPrompt: `Geef lesadviezen en activiteitenideeën voor een {format} op basis van de volgende inhoud.
Neem op:
1. 3-5 specifieke lesactiviteiten met duidelijke instructies
2. Geschatte tijd voor elke activiteit
3. Benodigde materialen of voorbereiding
4. Behandelde leerdoelen
5. Beoordelingsstrategieën om begrip te meten
6. Differentiatieopties voor verschillende niveaus van studenten
BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.

{content}`,
    
    // System prompts
    summarizeSystemPrompt: "Je bent een AI-assistent voor docenten. Vat de inhoud samen op een duidelijke, beknopte manier die nuttig zou zijn voor lesplanning. Focus op kernconcepten, hoofdideeën en educatieve waarde. BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.",
    
    quizSystemPrompt: "Je bent een AI-assistent voor docenten. Genereer quizvragen op basis van de geleverde inhoud. Neem een mix van vraagtypes op en geef antwoorden. Formatteer de vragen duidelijk met genummerde items. BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.",
    
    explainSystemPrompt: "Je bent een AI-assistent voor docenten. Leg complexe concepten uit de inhoud uit in eenvoudigere termen die docenten gemakkelijk met hun studenten kunnen gebruiken. Breek moeilijke ideeën op in begrijpelijke componenten. BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis.",
    
    suggestSystemPrompt: "Je bent een AI-assistent voor docenten. Geef lesadviezen, activiteitenideeën en discussiepunten op basis van de inhoud. Focus op praktische, boeiende benaderingen die goed zouden werken in een klaslokaal. BELANGRIJK: Gebruik GEEN Markdown-opmaak in je antwoord. Gebruik alleen platte tekst zonder speciale opmaaksymbolen of syntaxis."
  }
};

// DOM elements
let apiKeyInput, saveApiKeyBtn, apiStatus;
let featuresSection, apiKeySection;
let tabButtons, tabPanes;
let resultContainer, resultContent, loadingIndicator, resultActions;
let copyResultBtn, downloadResultBtn;
let languageToggleBtn;

// Feature buttons
let generateSummaryBtn, generateQuizBtn, generateExplanationBtn, generateSuggestionsBtn;

// Current active tab
let activeTab = 'summarize';

// Current language
let currentLanguage = 'english';

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
  
  languageToggleBtn = document.getElementById('language-toggle-btn');
  
  // Check if API key is already saved
  checkApiKey();
  
  // Check saved language preference
  checkLanguagePreference();
  
  // Set up event listeners
  saveApiKeyBtn.addEventListener('click', saveApiKey);
  
  // API key input enhancements
  apiKeyInput.addEventListener('input', () => {
    if (apiKeyInput.value.trim()) {
      apiKeyInput.classList.add('has-content');
    } else {
      apiKeyInput.classList.remove('has-content');
    }
  });
  
  apiKeyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveApiKey();
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
  
  // Language toggle
  languageToggleBtn.addEventListener('click', () => {
    addButtonClickEffect(languageToggleBtn);
    toggleLanguage();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
});

// Add visual click effect to buttons
function addButtonClickEffect(button) {
  button.classList.add('button-click');
  setTimeout(() => {
    button.classList.remove('button-click');
  }, 300);
}

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

// Check language preference
function checkLanguagePreference() {
  chrome.storage.local.get(['language'], (result) => {
    if (result.language) {
      currentLanguage = result.language;
      updateLanguageToggleButton();
      updateUILanguage();
    }
  });
}

// Toggle between English and Dutch
function toggleLanguage() {
  currentLanguage = currentLanguage === 'english' ? 'dutch' : 'english';
  
  // Save language preference
  chrome.storage.local.set({ language: currentLanguage });
  
  // Update UI with animation
  document.body.classList.add('language-transition');
  
  setTimeout(() => {
    // Update UI
    updateLanguageToggleButton();
    updateUILanguage();
    
    setTimeout(() => {
      document.body.classList.remove('language-transition');
    }, 300);
  }, 150);
}

// Update language toggle button text and style
function updateLanguageToggleButton() {
  languageToggleBtn.textContent = currentLanguage === 'english' ? 'EN' : 'NL';
  
  if (currentLanguage === 'english') {
    languageToggleBtn.classList.remove('dutch');
  } else {
    languageToggleBtn.classList.add('dutch');
  }
}

// Update UI text based on selected language
function updateUILanguage() {
  const texts = translations[currentLanguage];
  
  // Update page title
  document.querySelector('h1').textContent = texts.title;
  
  // Update API key section
  document.querySelector('#api-key-section h2').textContent = texts.apiKeySetup;
  document.querySelector('#api-key-section p').textContent = texts.apiKeyInstructions;
  apiKeyInput.placeholder = texts.enterApiKey;
  saveApiKeyBtn.textContent = texts.save;
  
  if (apiStatus.textContent === 'API key is set' || apiStatus.textContent === translations.english.apiKeySet || apiStatus.textContent === translations.dutch.apiKeySet) {
    apiStatus.textContent = texts.apiKeySet;
    apiStatus.className = 'success';
  } else if (apiStatus.textContent === 'Please enter a valid API key' || apiStatus.textContent === translations.english.apiKeyInvalid || apiStatus.textContent === translations.dutch.apiKeyInvalid) {
    apiStatus.textContent = texts.apiKeyInvalid;
    apiStatus.className = 'error';
  } else if (apiStatus.textContent === 'API key saved successfully' || apiStatus.textContent === translations.english.apiKeySaved || apiStatus.textContent === translations.dutch.apiKeySaved) {
    apiStatus.textContent = texts.apiKeySaved;
    apiStatus.className = 'success';
  }
  
  // Update tabs
  tabButtons.forEach(button => {
    const tabId = button.dataset.tab;
    button.textContent = texts[tabId];
  });
  
  // Update tab content
  // Summarize tab
  document.querySelector('#summarize h2').textContent = texts.summarizeTitle;
  document.querySelector('#summarize p').textContent = texts.summarizeDesc;
  document.querySelector('#summary-length option[value="short"]').textContent = texts.short;
  document.querySelector('#summary-length option[value="medium"]').textContent = texts.medium;
  document.querySelector('#summary-length option[value="long"]').textContent = texts.long;
  generateSummaryBtn.textContent = texts.generate;
  
  // Quiz tab
  document.querySelector('#quiz h2').textContent = texts.quizTitle;
  document.querySelector('#quiz p').textContent = texts.quizDesc;
  document.querySelector('#question-type option[value="multiple-choice"]').textContent = texts.multipleChoice;
  document.querySelector('#question-type option[value="true-false"]').textContent = texts.trueFalse;
  document.querySelector('#question-type option[value="short-answer"]').textContent = texts.shortAnswer;
  document.querySelector('#question-type option[value="mixed"]').textContent = texts.mixed;
  document.querySelector('#question-count').placeholder = texts.questionCount;
  generateQuizBtn.textContent = texts.generate;
  
  // Explain tab
  document.querySelector('#explain h2').textContent = texts.explainTitle;
  document.querySelector('#explain p').textContent = texts.explainDesc;
  document.querySelector('#topic-input').placeholder = texts.topicPlaceholder;
  document.querySelector('#explanation-level option[value="beginner"]').textContent = texts.beginner;
  document.querySelector('#explanation-level option[value="intermediate"]').textContent = texts.intermediate;
  document.querySelector('#explanation-level option[value="advanced"]').textContent = texts.advanced;
  generateExplanationBtn.textContent = texts.explain;
  
  // Suggest tab
  document.querySelector('#suggest h2').textContent = texts.suggestTitle;
  document.querySelector('#suggest p').textContent = texts.suggestDesc;
  document.querySelector('#teaching-format option[value="lecture"]').textContent = texts.lecture;
  document.querySelector('#teaching-format option[value="discussion"]').textContent = texts.discussion;
  document.querySelector('#teaching-format option[value="activity"]').textContent = texts.activity;
  document.querySelector('#teaching-format option[value="assessment"]').textContent = texts.assessment;
  generateSuggestionsBtn.textContent = texts.getSuggestions;
  
  // Loading
  document.querySelector('#loading p').textContent = texts.processing;
  
  // Result actions
  copyResultBtn.textContent = texts.copy;
  downloadResultBtn.textContent = texts.download;
  
  // Footer
  document.querySelector('footer p').textContent = texts.footer;
  
  // Update tooltips
  updateTooltips();
}

// Update tooltips based on current language
function updateTooltips() {
  const texts = translations[currentLanguage];
  
  // Define tooltip texts based on current language
  const tooltips = {
    'language-toggle-btn': currentLanguage === 'english' ? 'Schakel naar Nederlands' : 'Switch to English',
    'save-api-key': currentLanguage === 'english' ? 'Save your API key securely in the browser' : 'Sla je API-sleutel veilig op in de browser',
    'generate-summary': currentLanguage === 'english' ? 'Generate a summary of the current page' : 'Genereer een samenvatting van de huidige pagina',
    'generate-quiz': currentLanguage === 'english' ? 'Generate quiz questions from page content' : 'Genereer quizvragen op basis van de paginainhoud',
    'generate-explanation': currentLanguage === 'english' ? 'Get explanations of complex topics' : 'Krijg uitleg over complexe onderwerpen',
    'generate-suggestions': currentLanguage === 'english' ? 'Get teaching activity suggestions' : 'Krijg suggesties voor lesactiviteiten',
    'copy-result': currentLanguage === 'english' ? 'Copy content to clipboard' : 'Kopieer inhoud naar klembord',
    'download-result': currentLanguage === 'english' ? 'Download content as a text file' : 'Download inhoud als tekstbestand'
  };
  
  // Update all tooltips
  Object.keys(tooltips).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('data-tooltip', tooltips[id]);
    }
  });
}

// Check if API key exists in storage
function checkApiKey() {
  chrome.storage.local.get(['openai_api_key'], (result) => {
    if (result.openai_api_key) {
      apiKeyInput.value = '••••••••••••••••••••••••••';
      apiKeyInput.classList.add('has-content');
      const texts = translations[currentLanguage];
      apiStatus.textContent = texts.apiKeySet;
      apiStatus.className = 'success';
      showFeaturesSection();
    }
  });
}

// Save API key to storage
function saveApiKey() {
  const apiKey = apiKeyInput.value.trim();
  const texts = translations[currentLanguage];
  
  if (!apiKey) {
    apiStatus.textContent = texts.apiKeyInvalid;
    apiStatus.className = 'error';
    apiKeyInput.focus();
    shakeElement(apiKeyInput);
    return;
  }
  
  // Add loading effect
  saveApiKeyBtn.classList.add('loading');
  saveApiKeyBtn.disabled = true;
  
  // Save to Chrome storage
  chrome.storage.local.set({ openai_api_key: apiKey }, () => {
    // Remove loading effect
    saveApiKeyBtn.classList.remove('loading');
    saveApiKeyBtn.disabled = false;
    
    apiStatus.textContent = texts.apiKeySaved;
    apiStatus.className = 'success';
    apiKeyInput.value = '••••••••••••••••••••••••••';
    
    // Show features with animation
    showFeaturesSection(true);
    
    // Auto-clear status after 3 seconds
    setTimeout(() => {
      if (apiStatus.textContent === texts.apiKeySaved) {
        apiStatus.textContent = '';
      }
    }, 3000);
  });
}

// Add shake animation to element
function shakeElement(element) {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 500);
}

// Show features section after API key is set
function showFeaturesSection(animate = false) {
  if (animate) {
    featuresSection.style.opacity = '0';
    featuresSection.style.transform = 'translateY(20px)';
    featuresSection.classList.remove('hidden');
    
    setTimeout(() => {
      featuresSection.style.opacity = '1';
      featuresSection.style.transform = 'translateY(0)';
    }, 50);
  } else {
    featuresSection.classList.remove('hidden');
  }
}

// Switch between tabs
function switchTab(tabId) {
  activeTab = tabId;
  
  // Update ARIA states
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabId) {
      button.setAttribute('aria-selected', 'true');
    } else {
      button.setAttribute('aria-selected', 'false');
    }
  });
  
  // Update active tab button
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabId) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Show active tab content with enhanced animation
  tabPanes.forEach(pane => {
    if (pane.id === tabId) {
      // Prepare for animation
      pane.style.opacity = '0';
      pane.style.transform = 'translateY(10px)';
      pane.classList.add('active');
      
      // Trigger animation
      setTimeout(() => {
        pane.style.opacity = '1';
        pane.style.transform = 'translateY(0)';
      }, 50);
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
  
  const texts = translations[currentLanguage];
  const prompt = texts.summaryPrompt
    .replace('{length}', summaryLength)
    .replace('{content}', structuredContent);
  
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
  
  const texts = translations[currentLanguage];
  const prompt = texts.quizPrompt
    .replace('{count}', questionCount)
    .replace('{type}', questionType)
    .replace('{content}', structuredContent);
  
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
  
  const texts = translations[currentLanguage];
  let prompt;
  
  if (topic) {
    prompt = texts.explainTopicPrompt
      .replace('{topic}', topic)
      .replace('{level}', level)
      .replace('{content}', structuredContent);
  } else {
    prompt = texts.explainGeneralPrompt
      .replace('{level}', level)
      .replace('{content}', structuredContent);
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
  
  const texts = translations[currentLanguage];
  const prompt = texts.suggestPrompt
    .replace('{format}', format)
    .replace('{content}', structuredContent);
  
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
      shakeElement(resultContainer);
      return;
    }
    
    try {
      // Prepare system prompt based on feature
      const texts = translations[currentLanguage];
      let systemPrompt;
      
      switch (feature) {
        case 'summarize':
          systemPrompt = texts.summarizeSystemPrompt;
          break;
        case 'quiz':
          systemPrompt = texts.quizSystemPrompt;
          break;
        case 'explain':
          systemPrompt = texts.explainSystemPrompt;
          break;
        case 'suggest':
          systemPrompt = texts.suggestSystemPrompt;
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

// Display API response
function displayResult(text) {
  hideLoading();
  
  // Add animation for result appearance
  resultContent.style.opacity = '0';
  resultContent.textContent = text;
  
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
  navigator.clipboard.writeText(resultContent.textContent)
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

// Download result as text file
function downloadResult() {
  const text = resultContent.textContent;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Add download animation
  downloadResultBtn.classList.add('success-action');
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activeTab}-result.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Show success feedback
  const originalText = downloadResultBtn.textContent;
  downloadResultBtn.textContent = '✓ Downloaded';
  
  setTimeout(() => {
    downloadResultBtn.classList.remove('success-action');
    downloadResultBtn.textContent = originalText;
  }, 2000);
}
