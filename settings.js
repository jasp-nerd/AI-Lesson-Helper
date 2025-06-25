// Settings page script for VU Education Lab AI Assistant
// Handles Gemini API key change logic

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('settings-api-key');
  const saveApiKeyBtn = document.getElementById('settings-save-api-key');
  const apiStatus = document.getElementById('settings-api-status');
  const backBtn = document.getElementById('settings-back-btn');
  const languageToggleBtn = document.getElementById('settings-language-toggle');
  const languageStatus = document.getElementById('settings-language-status');
  const floatingPopupToggle = document.getElementById('settings-floating-popup-toggle');
  const floatingPopupStatus = document.getElementById('settings-floating-popup-status');

  // --- TRANSLATION SUPPORT FOR SETTINGS PAGE ---
  let settingsTranslations = {};
  let settingsCurrentLang = 'en';
  function getSettingsTranslation(key) {
    return (settingsTranslations[settingsCurrentLang] && settingsTranslations[settingsCurrentLang][key]) || key;
  }
  async function loadSettingsTranslations(lang) {
    let localeFile = lang === 'nl' ? 'locales/nl.json' : 'locales/en.json';
    try {
      const res = await fetch(localeFile);
      settingsTranslations[lang] = await res.json();
    } catch (e) {
      settingsTranslations[lang] = {};
    }
  }
  function updateSettingsUILanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && getSettingsTranslation(key)) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = getSettingsTranslation(key);
        } else if (el.tagName === 'BUTTON') {
          el.textContent = getSettingsTranslation(key);
        } else {
          // For elements containing HTML (e.g., links)
          el.innerHTML = getSettingsTranslation(key);
        }
      }
    });
  }
  // --- END TRANSLATION SUPPORT ---

  // Load current API key (mask if set) and language
  chrome.storage.local.get(['gemini_api_key', 'language'], async (result) => {
    if (result.gemini_api_key) {
      apiKeyInput.value = '••••••••••••••••••••••••••';
      apiKeyInput.classList.add('has-content');
      apiStatus.textContent = 'API key is set';
      apiStatus.className = 'success';
    }
    // Set language toggle button text
    const lang = result.language === 'nl' ? 'nl' : 'en';
    languageToggleBtn.textContent = lang.toUpperCase();
    languageToggleBtn.setAttribute('aria-label', lang === 'nl' ? 'Switch to English' : 'Switch to Dutch');
    // Load and apply translations
    settingsCurrentLang = lang;
    await loadSettingsTranslations('en');
    await loadSettingsTranslations('nl');
    updateSettingsUILanguage();
  });

  // Load floating popup setting
  chrome.storage.local.get(['show_floating_popup'], (result) => {
    const showFloating = result.show_floating_popup !== false; // default true
    updateFloatingPopupToggle(showFloating);
  });

  function updateFloatingPopupToggle(showFloating) {
    floatingPopupToggle.textContent = showFloating ? 'ON' : 'OFF';
    floatingPopupToggle.className = showFloating ? 'settings-toggle-on' : 'settings-toggle-off';
    floatingPopupToggle.setAttribute('aria-pressed', showFloating);
  }

  // Save API key logic
  saveApiKeyBtn.addEventListener('click', saveApiKey);
  apiKeyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveApiKey();
  });

  function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey || apiKey === '••••••••••••••••••••••••••') {
      apiStatus.textContent = 'Please enter a valid API key';
      apiStatus.className = 'error';
      apiKeyInput.focus();
      shakeElement(apiKeyInput);
      return;
    }
    saveApiKeyBtn.classList.add('loading');
    saveApiKeyBtn.disabled = true;
    chrome.storage.local.set({ gemini_api_key: apiKey }, () => {
      saveApiKeyBtn.classList.remove('loading');
      saveApiKeyBtn.disabled = false;
      apiStatus.textContent = 'API key saved successfully';
      apiStatus.className = 'success';
      apiKeyInput.value = '••••••••••••••••••••••••••';
      apiKeyInput.classList.add('has-content');
      setTimeout(() => {
        if (apiStatus.textContent === 'API key saved successfully') {
          apiStatus.textContent = '';
        }
        // Redirect to popup after save
        window.location.href = 'popup.html';
      }, 1200);
    });
  }

  // Language toggle logic
  languageToggleBtn.addEventListener('click', () => {
    chrome.storage.local.get(['language'], (result) => {
      let newLang = (result.language === 'nl') ? 'en' : 'nl';
      chrome.storage.local.set({ language: newLang }, async () => {
        languageToggleBtn.textContent = newLang.toUpperCase();
        languageToggleBtn.setAttribute('aria-label', newLang === 'nl' ? 'Switch to English' : 'Switch to Dutch');
        languageStatus.textContent = newLang === 'nl' ? getSettingsTranslation('settingsLanguageStatusNL') : getSettingsTranslation('settingsLanguageStatusEN');
        languageStatus.className = 'success';
        settingsCurrentLang = newLang;
        await loadSettingsTranslations('en');
        await loadSettingsTranslations('nl');
        updateSettingsUILanguage();
        setTimeout(() => { languageStatus.textContent = ''; }, 1200);
        // Reload the page to apply language immediately
        window.location.reload();
      });
    });
  });

  // Add shake animation (copied from popup.js)
  function shakeElement(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }

  // Back to popup
  backBtn.addEventListener('click', () => {
    window.location.href = 'popup.html';
  });

  floatingPopupToggle.addEventListener('click', () => {
    const isCurrentlyOn = floatingPopupToggle.textContent === 'ON';
    const showFloating = !isCurrentlyOn;
    chrome.storage.local.set({ show_floating_popup: showFloating }, () => {
      updateFloatingPopupToggle(showFloating);
      floatingPopupStatus.textContent = showFloating ? getSettingsTranslation('settingsFloatingPopupEnabled') : getSettingsTranslation('settingsFloatingPopupDisabled');
      floatingPopupStatus.className = showFloating ? 'success' : 'error';
      setTimeout(() => { floatingPopupStatus.textContent = ''; }, 1200);
    });
  });
});
