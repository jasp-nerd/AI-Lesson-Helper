// Popup script for VU Amsterdam AI Assistant

// Language translations
const translations = {
  english: {
    title: 'AI Assistant for Teachers',
    apiKeySetup: 'API Key Setup',
    apiKeyInstructions: 'Enter your Google Gemini API key to use the Gemini 2.0 Flash model:',
    enterApiKey: 'Enter your Google Gemini API key',
    save: 'Save',
    apiKeySet: 'API key is set',
    apiKeyInvalid: 'Please enter a valid API key',
    apiKeySaved: 'API key saved successfully',
    
    // Tabs
    summarize: 'Summarize',
    quiz: 'Quiz',
    explain: 'Explain',
    suggest: 'Teaching',
    
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
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    
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
STRICTLY adhere to the specified length requirement:
- Short: 1-2 paragraphs (approx. 100-150 words)
- Medium: 3-4 paragraphs (approx. 250-350 words)
- Long: 5+ paragraphs

The summary must be structured for university-level comprehension, focusing on educational value, key concepts, and learning objectives. Use clear sections with markdown headings (##), highlight important terminology in **bold**, and ensure clarity for teaching purposes.

Include:
- 2-3 key learning outcomes students should achieve
- 2-3 potential discussion questions that promote critical thinking at the end
- A bullet list for key points and concepts to enhance scannability for busy teachers

{content}`,
    
    // Quiz prompts
    quizPrompt: `Create {count} {type} quiz questions based on the following content for classroom assessment.

Requirements:
- All questions must be at the university level, but use the specified university difficulty: low, medium, or high.
- Strictly adhere to the requested question type: only {type} questions
- Assign a university difficulty level to each question: {difficulty}
- Format using markdown for clarity:
  - **Bold** for question numbers
  - Numbered list for multiple choice options
  - *Italics* for correct answer explanations

Question Format:
- Multiple Choice: 4 options, one correct answer. use ABCD
- True/False: clearly state true or false
- Short Answer: provide a model answer

Questions should target a range of cognitive levels (knowledge, comprehension, application, analysis) per Bloom's taxonomy, and align with specific learning objectives where possible.

IMPORTANT: Strictly follow this format for each question:
1. The question (with university difficulty in parentheses)
2. For MC: numbered options
3. The answer (clearly indicated)
4. *Explanation* (in italics)

{content}`,
    
    // Explain prompts
    explainTopicPrompt: `Explain the concept of "{topic}" from the following content at a {level} level in a way that teachers can easily adapt for their classrooms.
Structure your response with markdown for easy scanning and classroom use:

## Simple Definition
Provide a clear, concise definition appropriate for {level} students.

## Real-World Examples and Analogies
Include 2-3 concrete examples or analogies that connect to students' everyday experiences.

## Visual Concept
Describe a visual representation that teachers could quickly draw on a board, or use in a handout.

## Common Misconceptions
List 2-3 common misconceptions students have about this topic with brief corrections.

## Teaching Sequence
Provide a clear step-by-step explanation that teachers can follow when introducing this concept.

## Quick Assessment
Include 1-2 quick formative assessment questions teachers can use to check understanding.

{content}`,
    
    explainGeneralPrompt: `Identify and explain 3-5 complex concepts from the following content at a {level} level that teachers need to emphasize.
Format your response using markdown for easy classroom preparation:

# Key Concepts Overview
Begin with a brief overview of how these concepts connect to one another.

For each concept, provide the following sections:

## [Concept Name]
**Definition:** A clear, concise definition appropriate for {level} students.

**Real-world Applications:** 
- 2-3 examples that connect to students' experiences
- How this concept appears in everyday contexts

**Visual Representation:**
Describe a simple diagram, chart or illustration that teachers could use to visualize this concept.

**Common Misconceptions:**
- List common student misunderstandings
- Provide quick corrections for each

**Teaching Tips:**
Brief strategies for introducing and reinforcing this concept effectively.

{content}`,
    
    // Suggest prompts
    suggestPrompt: `Design a comprehensive {format} plan based on the following content that aligns with educational best practices.
Format your response using markdown for maximum clarity and usability:

# {format} Plan: [Create an engaging title]

## Learning Objectives
List 3-5 specific, measurable learning objectives that students should achieve.

## Preparation
- **Time Required:** Estimate the total time needed
- **Materials:** List all necessary materials/resources
- **Prerequisites:** Note any prior knowledge students should have
- **Technology Needs:** Specify any digital tools required

## Detailed Plan
Provide a structured, step-by-step implementation guide with timing for each segment:

### Opening (Engagement)
How to activate prior knowledge and motivate students.

### Main Activities
Detailed instructions for core learning activities, including:
- Discussion prompts
- Group/individual work instructions
- Differentiation options for various learning needs
- Digital or analog resources to incorporate

### Conclusion
Strategies for summarizing key points and checking for understanding.

## Assessment
Concrete methods to evaluate student learning, including:
- Formative assessment techniques
- Potential assignment/project ideas
- Evaluation criteria or rubrics

## Extension Activities
Suggestions for additional activities for advanced students or further exploration.

{content}`,
    
    // System prompts
    summarizeSystemPrompt: "You are an AI assistant for teachers. Summarize the content in a clear, structured way that would be useful for lesson planning and classroom preparation. It is CRITICAL that you follow the exact specified length requirements provided in the prompt (e.g., short, medium, or long). Focus on key concepts, main ideas, and educational value. Use markdown formatting (headings, bullet points, bold for emphasis) to enhance readability and organization. Your goal is to create a summary that teachers can quickly scan and use directly in their teaching preparations.",
    
    quizSystemPrompt: "You are an AI assistant for teachers. Generate pedagogically sound quiz questions based on the content provided. Include appropriate question types and provide detailed answers. Format questions using markdown for clarity (bold, numbered lists, etc.) to create assessment materials that are immediately usable in the classroom. Align questions with different cognitive levels of Bloom's taxonomy to ensure comprehensive assessment of student understanding.",
    
    explainSystemPrompt: "You are an AI assistant for teachers. Explain complex concepts from the content in structured, clear terms that teachers can directly adapt for their students. Use markdown formatting (headings, bullet points, emphasis) to organize information in a classroom-ready format. Break down difficult ideas into understandable components and provide concrete teaching strategies. Your explanations should be immediately usable as teaching resources.",
    
    suggestSystemPrompt: "You are an AI assistant for teachers. Provide comprehensive teaching plans, activity ideas, and discussion prompts based on the content. Focus on practical, evidence-based approaches that align with modern pedagogical best practices. Use markdown formatting to create well-structured, easily scannable lesson plans. Include clear objectives, timing guidance, and assessment strategies to support effective classroom implementation.",
    
    // Custom tab
    custom: 'Custom',
    customTitle: 'Custom Prompt',
    customDesc: 'Ask any question or request about the current page content.',
    customPlaceholder: 'Enter your custom prompt or question here...',
    ask: 'Ask',
    templateLabel: 'Quick templates:',
    templateMainArgs: 'Main Arguments',
    templateConceptMap: 'Concept Map',
    templateImplications: 'Student Implications',
    templateBiasAnalysis: 'Bias Analysis',
    templateLearningStyles: 'Learning Styles',
    templateReflectionQuestions: 'Reflection Questions',
    
    // Custom prompts
    customPrompt: `Answer the following request based on the content of the page, creating an educationally valuable response:
{prompt}

Structure your response with appropriate markdown formatting (headings, lists, emphasis) to enhance clarity and usability for teaching purposes.

Here is the content to analyze:
{content}`,
    
    customSystemPrompt: "You are an AI assistant for teachers. Answer the user's specific question or request about the content provided. Focus on educational relevance and provide well-structured, pedagogically sound responses. Use appropriate markdown formatting (headings, bullet points, emphasis) to organize information in a way that's immediately useful in educational contexts. Prioritize creating responses that can be directly applied in teaching settings."
  },
  
  dutch: {
    title: 'AI-assistent voor Docenten',
    apiKeySetup: 'API-sleutel Instellen',
    apiKeyInstructions: 'Voer je Google Gemini API-sleutel in om het Gemini 2.0 Flash model te gebruiken:',
    enterApiKey: 'Voer je Google Gemini API-sleutel in',
    save: 'Opslaan',
    apiKeySet: 'API-sleutel is ingesteld',
    apiKeyInvalid: 'Voer een geldige API-sleutel in',
    apiKeySaved: 'API-sleutel succesvol opgeslagen',
    
    // Tabs
    summarize: 'Samenvatten',
    quiz: 'Quiz',
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
    difficulty: 'Moeilijkheidsgraad',
    easy: 'Makkelijk',
    medium: 'Gemiddeld',
    hard: 'Moeilijk',
    
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
Houd je STRIKT aan de opgegeven lengte-eis - schrijf niet meer of minder dan gevraagd.
Focus op educatieve waarde, kernconcepten en leerdoelen.
Organiseer de samenvatting met duidelijke secties door gebruik van markdown koppen (##) en markeer belangrijke terminologie met **vetgedrukte tekst**.
Identificeer 2-3 belangrijke leerresultaten die leerlingen zouden moeten bereiken.
Voeg aan het einde 2-3 potentiële discussievragen toe die kritisch denken bevorderen.
Gebruik opsommingstekens voor kernpunten en concepten om scanbaarheid voor drukke docenten te verbeteren.

{content}`,
    
    // Quiz prompts
    quizPrompt: `Maak {count} {type} quizvragen op basis van de volgende inhoud afgestemd op klaslokaaltoetsing.
Vereisten:
- Alle vragen moeten op universitair niveau zijn, maar gebruik het opgegeven universitair moeilijkheidsniveau: laag, medium of hoog.
- Gebruik uitsluitend het gevraagde vraagtype: alleen {type} vragen
- Ken aan elke vraag een universitair moeilijkheidsniveau toe: {difficulty} (laag/medium/hoog)
- Formatteer met markdown voor duidelijkheid:
  - **Vetgedrukt** voor vraagnummers
  - Genummerde lijst voor meerkeuzeopties
  - *Cursief* voor uitleg van het juiste antwoord

Vraagformaat:
- Meerkeuze: 4 opties, één juist antwoord. Gebruik ABCD
- Waar/Onwaar: geef duidelijk aan of de stelling waar of onwaar is
- Kort Antwoord: geef een modelantwoord

Vragen moeten verschillende cognitieve niveaus testen (kennis, begrip, toepassing, analyse) volgens de taxonomie van Bloom en aansluiten bij specifieke leerdoelen waar mogelijk.

BELANGRIJK: Volg dit format strikt voor elke vraag:
1. De vraag (met universitair moeilijkheidsniveau tussen haakjes)
2. Voor meerkeuze: genummerde opties
3. Het antwoord (duidelijk aangeven)
4. *Uitleg* (cursief)

{content}`,
    
    // Explain prompts
    explainTopicPrompt: `Leg het concept "{topic}" uit van de volgende inhoud op een {level} niveau op een manier die docenten gemakkelijk kunnen aanpassen voor hun klaslokalen.
Structureer je antwoord met markdown voor eenvoudig scannen en klaslokaalgebruik:

## Eenvoudige Definitie
Geef een heldere, beknopte definitie die geschikt is voor {level} studenten.

## Praktijkvoorbeelden en Analogieën
Neem 2-3 concrete voorbeelden of analogieën op die aansluiten bij de dagelijkse ervaringen van studenten.

## Visueel Concept
Beschrijf een visuele weergave die docenten snel op een bord kunnen tekenen of in een handout kunnen gebruiken.

## Veelvoorkomende Misvattingen
Noteer 2-3 veel voorkomende misvattingen die studenten hebben over dit onderwerp met korte correcties.

## Lesopbouw
Geef een duidelijke stap-voor-stap uitleg die docenten kunnen volgen bij het introduceren van dit concept.

## Snelle Beoordeling
Voeg 1-2 snelle formatieve beoordelingsvragen toe die docenten kunnen gebruiken om begrip te toetsen.

{content}`,
    
    explainGeneralPrompt: `Identificeer en leg 3-5 complexe concepten uit van de volgende inhoud op een {level} niveau die docenten moeten benadrukken.
Formatteer je antwoord met markdown voor eenvoudige klasvoorbereiding:

# Overzicht Hoofdconcepten
Begin met een korte toelichting over hoe deze concepten met elkaar verbonden zijn.

Voor elk concept, geef de volgende secties:

## [Conceptnaam]
**Definitie:** Een heldere, beknopte definitie die geschikt is voor {level} studenten.

**Praktijktoepassingen:** 
- 2-3 voorbeelden die aansluiten bij de ervaringen van studenten
- Hoe dit concept voorkomt in alledaagse contexten

**Visuele Weergave:**
Beschrijf een eenvoudig diagram, grafiek of illustratie die docenten kunnen gebruiken om dit concept te visualiseren.

**Veelvoorkomende Misvattingen:**
- Overzicht van veelvoorkomende misverstanden bij studenten
- Geef beknopte correcties voor elk misverstand

**Lestips:**
Korte strategieën voor het effectief introduceren en versterken van dit concept.

{content}`,
    
    // Suggest prompts
    suggestPrompt: `Ontwerp een uitgebreid {format}-plan op basis van de volgende inhoud dat aansluit bij educatieve best practices.
Formatteer je antwoord met markdown voor maximale duidelijkheid en bruikbaarheid:

# {format} Plan: [Verzin een aansprekende titel]

## Leerdoelen
Benoem 3-5 specifieke, meetbare leerdoelen die studenten zouden moeten bereiken.

## Voorbereiding
- **Benodigde Tijd:** Schat de totale benodigde tijd in
- **Materialen:** Benoem alle benodigde materialen/middelen
- **Voorkennis:** Noteer eventuele voorkennis die studenten moeten hebben
- **Technologiebehoeften:** Specificeer eventuele benodigde digitale tools

## Gedetailleerd Plan
Bied een gestructureerde, stap-voor-stap implementatiegids met tijdsindeling voor elk segment:

### Opening (Betrokkenheid)
Hoe voorkennis te activeren en studenten te motiveren.

### Hoofdactiviteiten
Gedetailleerde instructies voor kernleeractiviteiten, inclusief:
- Discussievragen
- Groeps-/individuele werkinstructies
- Differentiatieopties voor verschillende leerbehoeften
- Digitale of analoge hulpmiddelen om op te nemen

### Conclusie
Strategieën voor het samenvatten van belangrijke punten en het controleren van begrip.

## Beoordeling
Concrete methoden om het leren van studenten te evalueren, inclusief:
- Formatieve beoordelingstechnieken
- Potentiële opdracht-/projectideeën
- Evaluatiecriteria of rubrieken

## Uitbreidingsactiviteiten
Suggesties voor aanvullende activiteiten voor gevorderde studenten of verdere verkenning.

{content}`,
    
    // System prompts
    summarizeSystemPrompt: "Je bent een AI-assistent voor docenten. Vat de inhoud samen op een duidelijke, gestructureerde manier die nuttig zou zijn voor lesplanning en klasvoorbereiding. Het is CRUCIAAL dat je de exacte lengte-eisen volgt die in de prompt worden vermeld (bijv. kort, gemiddeld of lang). Focus op kernconcepten, hoofdideeën en educatieve waarde. Gebruik markdown-opmaak (koppen, opsommingstekens, vetgedrukt voor nadruk) om de leesbaarheid en organisatie te verbeteren. Je doel is om een samenvatting te maken die docenten snel kunnen scannen en direct kunnen gebruiken in hun lesvoorbereidingen.",
    
    quizSystemPrompt: "Je bent een AI-assistent voor docenten. Genereer pedagogisch verantwoorde quizvragen op basis van de geleverde inhoud. Neem passende vraagtypen op en geef gedetailleerde antwoorden. Formatteer vragen met markdown voor duidelijkheid (vetgedrukt, genummerde lijsten, enz.) om beoordelingsmaterialen te maken die onmiddellijk bruikbaar zijn in de klas. Stem vragen af op verschillende cognitieve niveaus van de taxonomie van Bloom om een uitgebreide beoordeling van het begrip van studenten te waarborgen.",
    
    explainSystemPrompt: "Je bent een AI-assistent voor docenten. Leg complexe concepten uit de inhoud uit in gestructureerde, duidelijke termen die docenten direct kunnen aanpassen voor hun studenten. Gebruik markdown-opmaak (koppen, opsommingstekens, nadruk) om informatie te organiseren in een klasklaar formaat. Breek moeilijke ideeën op in begrijpelijke componenten en bied concrete lesstrategieën. Je uitleg moet direct bruikbaar zijn als lesmateriaal.",
    
    suggestSystemPrompt: "Je bent een AI-assistent voor docenten. Bied uitgebreide lesplannen, activiteitenideeën en discussievragen op basis van de inhoud. Focus op praktische, evidence-based benaderingen die aansluiten bij moderne pedagogische best practices. Gebruik markdown-opmaak om goed gestructureerde, gemakkelijk scanbare lesplannen te maken. Neem duidelijke doelstellingen, tijdsrichtlijnen en beoordelingsstrategieën op om een effectieve implementatie in de klas te ondersteunen.",
    
    // Custom tab
    custom: 'Aangepast',
    customTitle: 'Aangepaste Prompt',
    customDesc: 'Stel een vraag of verzoek over de inhoud van de huidige pagina.',
    customPlaceholder: 'Voer hier je aangepaste prompt of vraag in...',
    ask: 'Vraag',
    templateLabel: 'Snelle sjablonen:',
    templateMainArgs: 'Hoofdargumenten',
    templateConceptMap: 'Conceptkaart',
    templateImplications: 'Gevolgen voor Studenten',
    templateBiasAnalysis: 'Vooroordelenanalyse',
    templateLearningStyles: 'Leerstijlen',
    templateReflectionQuestions: 'Reflectievragen',
    
    // Custom prompts
    customPrompt: `Beantwoord het volgende verzoek op basis van de inhoud van de pagina, door een educatief waardevolle reactie te creëren:
{prompt}

Structureer je antwoord met passende markdown-opmaak (koppen, lijsten, nadruk) om de duidelijkheid en bruikbaarheid voor onderwijsdoeleinden te verbeteren.

Hier is de inhoud om te analyseren:
{content}`,
    
    customSystemPrompt: "Je bent een AI-assistent voor docenten. Beantwoord de specifieke vraag of het verzoek van de gebruiker over de gegeven inhoud. Focus op educatieve relevantie en geef goed gestructureerde, pedagogisch verantwoorde antwoorden. Gebruik passende markdown-opmaak (koppen, opsommingstekens, nadruk) om informatie te organiseren op een manier die direct bruikbaar is in onderwijscontexten. Prioriteer het maken van antwoorden die direct kunnen worden toegepast in leersituaties."
  }
};

// Utility: debounce
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Utility: safely get element by id
function $(id) {
  return document.getElementById(id);
}

// DOM elements
let apiKeyInput, saveApiKeyBtn, apiStatus;
let featuresSection, apiKeySection;
let tabButtons, tabPanes;
let resultContainer, resultContent, loadingIndicator, resultActions;
let copyResultBtn, downloadResultBtn;
let languageToggleBtn, settingsBtn;
let noApiKeyOverlay, gotoSettingsBtn;

// Feature buttons
let generateSummaryBtn, generateQuizBtn, generateExplanationBtn, generateSuggestionsBtn;

// Current active tab
let activeTab = 'summarize';

// Current language
let currentLanguage = 'english';

// Add to the DOM Elements section
let generateCustomBtn, customPromptInput, templateButtons;

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

  // Check saved language preference
  checkLanguagePreference();
  
  // Set up event listeners
  // Remove listeners for saveApiKeyBtn, apiKeyInput, etc.
  
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

  // If running inside an iframe, notify parent window (content script)
  if (window.self !== window.top) {
    window.parent.postMessage({ action: 'changeLanguage', language: currentLanguage }, '*');
  }

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
  
  // Remove any language/opacity transition classes to prevent stuck opacity
  document.body.classList.remove('language-transition');
  document.querySelectorAll('.content-pane, .tab-pane, .container').forEach(el => {
    el.classList.remove('language-transition');
    el.style.opacity = '';
  });

  // Optionally force full opacity after language switch
  setTimeout(() => {
    document.body.style.opacity = '1';
    document.querySelectorAll('.content-pane, .tab-pane, .container').forEach(el => {
      el.style.opacity = '1';
    });
  }, 10);

  // Update page title
  document.querySelector('h1').textContent = texts.title;
  
  // Update tabs
  tabButtons.forEach(button => {
    const tabId = button.dataset.tab;
    button.textContent = texts[tabId];
  });
  
  // Update tab content
  // Summarize tab
  const summarizeH2 = document.querySelector('#summarize h2');
  if (summarizeH2) summarizeH2.textContent = texts.summarizeTitle;
  const summarizeDescP = document.querySelector('#summarize p');
  if (summarizeDescP) summarizeDescP.textContent = texts.summarizeDesc;
  const summaryLengthShort = document.querySelector('#summary-length option[value="short"]');
  if (summaryLengthShort) summaryLengthShort.textContent = texts.short;
  const summaryLengthMedium = document.querySelector('#summary-length option[value="medium"]');
  if (summaryLengthMedium) summaryLengthMedium.textContent = texts.medium;
  const summaryLengthLong = document.querySelector('#summary-length option[value="long"]');
  if (summaryLengthLong) summaryLengthLong.textContent = texts.long;
  if (generateSummaryBtn) generateSummaryBtn.textContent = texts.generate;
  
  // Quiz tab
  const quizH2 = document.querySelector('#quiz h2');
  if (quizH2) quizH2.textContent = texts.quizTitle;
  const quizDescP = document.querySelector('#quiz p');
  if (quizDescP) quizDescP.textContent = texts.quizDesc;
  const questionTypeMultiple = document.querySelector('#question-type option[value="multiple-choice"]');
  if (questionTypeMultiple) questionTypeMultiple.textContent = texts.multipleChoice;
  const questionTypeTrueFalse = document.querySelector('#question-type option[value="true-false"]');
  if (questionTypeTrueFalse) questionTypeTrueFalse.textContent = texts.trueFalse;
  const questionTypeShortAnswer = document.querySelector('#question-type option[value="short-answer"]');
  if (questionTypeShortAnswer) questionTypeShortAnswer.textContent = texts.shortAnswer;
  const questionTypeMixed = document.querySelector('#question-type option[value="mixed"]');
  if (questionTypeMixed) questionTypeMixed.textContent = texts.mixed;
  const questionCount = document.querySelector('#question-count');
  if (questionCount) questionCount.placeholder = texts.questionCount;
  const quizDifficulty = document.querySelector('#quiz-difficulty');
  if (quizDifficulty) quizDifficulty.placeholder = texts.difficulty;
  const quizDifficultyEasy = document.querySelector('#quiz-difficulty option[value="easy"]');
  if (quizDifficultyEasy) quizDifficultyEasy.textContent = texts.easy;
  const quizDifficultyMedium = document.querySelector('#quiz-difficulty option[value="medium"]');
  if (quizDifficultyMedium) quizDifficultyMedium.textContent = texts.medium;
  const quizDifficultyHard = document.querySelector('#quiz-difficulty option[value="hard"]');
  if (quizDifficultyHard) quizDifficultyHard.textContent = texts.hard;
  if (generateQuizBtn) generateQuizBtn.textContent = texts.generate;
  
  // Explain tab
  const explainH2 = document.querySelector('#explain h2');
  if (explainH2) explainH2.textContent = texts.explainTitle;
  const explainDescP = document.querySelector('#explain p');
  if (explainDescP) explainDescP.textContent = texts.explainDesc;
  const topicInput = document.querySelector('#topic-input');
  if (topicInput) topicInput.placeholder = texts.topicPlaceholder;
  const explanationLevelBeginner = document.querySelector('#explanation-level option[value="beginner"]');
  if (explanationLevelBeginner) explanationLevelBeginner.textContent = texts.beginner;
  const explanationLevelIntermediate = document.querySelector('#explanation-level option[value="intermediate"]');
  if (explanationLevelIntermediate) explanationLevelIntermediate.textContent = texts.intermediate;
  const explanationLevelAdvanced = document.querySelector('#explanation-level option[value="advanced"]');
  if (explanationLevelAdvanced) explanationLevelAdvanced.textContent = texts.advanced;
  if (generateExplanationBtn) generateExplanationBtn.textContent = texts.explain;
  
  // Suggest tab
  const suggestH2 = document.querySelector('#suggest h2');
  if (suggestH2) suggestH2.textContent = texts.suggestTitle;
  const suggestDescP = document.querySelector('#suggest p');
  if (suggestDescP) suggestDescP.textContent = texts.suggestDesc;
  const teachingFormatLecture = document.querySelector('#teaching-format option[value="lecture"]');
  if (teachingFormatLecture) teachingFormatLecture.textContent = texts.lecture;
  const teachingFormatDiscussion = document.querySelector('#teaching-format option[value="discussion"]');
  if (teachingFormatDiscussion) teachingFormatDiscussion.textContent = texts.discussion;
  const teachingFormatActivity = document.querySelector('#teaching-format option[value="activity"]');
  if (teachingFormatActivity) teachingFormatActivity.textContent = texts.activity;
  const teachingFormatAssessment = document.querySelector('#teaching-format option[value="assessment"]');
  if (teachingFormatAssessment) teachingFormatAssessment.textContent = texts.assessment;
  if (generateSuggestionsBtn) generateSuggestionsBtn.textContent = texts.getSuggestions;
  
  // Loading
  const loadingP = document.querySelector('#loading p');
  if (loadingP) loadingP.textContent = texts.processing;
  
  // Result actions
  if (copyResultBtn) copyResultBtn.textContent = texts.copy;
  if (downloadResultBtn) downloadResultBtn.textContent = texts.download;
  
  // Footer
  const footerP = document.querySelector('footer p');
  if (footerP) footerP.textContent = texts.footer;
  
  // Update tooltips
  updateTooltips();
  
  // Update custom tab
  const customH2 = document.querySelector('#custom h2');
  if (customH2) customH2.textContent = texts.customTitle;
  const customDescP = document.querySelector('#custom p');
  if (customDescP) customDescP.textContent = texts.customDesc;
  const customPromptInput = document.querySelector('#custom-prompt');
  if (customPromptInput) customPromptInput.placeholder = texts.customPlaceholder;
  if (generateCustomBtn) generateCustomBtn.textContent = texts.ask;
  const templateLabel = document.querySelector('.template-label');
  if (templateLabel) templateLabel.textContent = texts.templateLabel;
  
  // Update template button texts
  const templateMainArgsBtn = document.querySelector('.template-btn[data-prompt="What are the main arguments presented in this text?"]');
  if (templateMainArgsBtn) templateMainArgsBtn.textContent = texts.templateMainArgs;
  const templateConceptMapBtn = document.querySelector('.template-btn[data-prompt="Create a concept map based on this content."]');
  if (templateConceptMapBtn) templateConceptMapBtn.textContent = texts.templateConceptMap;
  const templateImplicationsBtn = document.querySelector('.template-btn[data-prompt="What are the implications of this content for students?"]');
  if (templateImplicationsBtn) templateImplicationsBtn.textContent = texts.templateImplications;
  const templateBiasAnalysisBtn = document.querySelector('.template-btn[data-prompt="Identify any biases or limitations in this content."]');
  if (templateBiasAnalysisBtn) templateBiasAnalysisBtn.textContent = texts.templateBiasAnalysis;
  const templateLearningStylesBtn = document.querySelector('.template-btn[data-prompt="How could I adapt this content for different learning styles?"]');
  if (templateLearningStylesBtn) templateLearningStylesBtn.textContent = texts.templateLearningStyles;
  const templateReflectionQuestionsBtn = document.querySelector('.template-btn[data-prompt="Create 3 reflection questions for students after studying this content."]');
  if (templateReflectionQuestionsBtn) templateReflectionQuestionsBtn.textContent = texts.templateReflectionQuestions;
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
  
  const texts = translations[currentLanguage];
  const prompt = texts.summaryPrompt
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
  
  const texts = translations[currentLanguage];
  const quizOptions = getQuizOptions();
  const prompt = texts.quizPrompt
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
  
  const texts = translations[currentLanguage];
  const prompt = texts.suggestPrompt
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
        case 'custom':
          systemPrompt = texts.customSystemPrompt;
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
