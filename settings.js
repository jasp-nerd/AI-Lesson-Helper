// Settings page script for VU Education Lab AI Assistant
// Handles Gemini API key change logic

document.addEventListener('DOMContentLoaded', () => {
  const checkBackendBtn = document.getElementById('settings-check-backend');
  const backendStatus = document.getElementById('settings-backend-status');
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

  // Load language settings and check backend connection
  chrome.storage.local.get(['language'], async (result) => {
    // Set language toggle button text
    const lang = result.language === 'nl' ? 'nl' : 'en';
    languageToggleBtn.textContent = lang.toUpperCase();
    languageToggleBtn.setAttribute('aria-label', lang === 'nl' ? 'Switch to English' : 'Switch to Dutch');
    // Load and apply translations
    settingsCurrentLang = lang;
    await loadSettingsTranslations('en');
    await loadSettingsTranslations('nl');
    updateSettingsUILanguage();
    
    // Check backend connection status
    checkBackendConnection();
  });

  // Load floating popup setting
  chrome.storage.local.get(['show_floating_popup'], (result) => {
    const showFloating = result.show_floating_popup !== false; // default true
    updateFloatingPopupToggle(showFloating);
  });

  function updateFloatingPopupToggle(showFloating) {
    floatingPopupToggle.textContent = showFloating ? 'ON' : 'OFF';
    floatingPopupToggle.setAttribute('aria-pressed', showFloating);
    // Apply visual styling based on state
    if (showFloating) {
      floatingPopupToggle.style.backgroundColor = 'var(--vu-green)';
    } else {
      floatingPopupToggle.style.backgroundColor = 'var(--vu-orange)';
    }
  }

  // Backend connection checking logic
  checkBackendBtn.addEventListener('click', checkBackendConnection);

  async function checkBackendConnection() {
    backendStatus.textContent = 'Checking connection...';
    backendStatus.className = '';
    checkBackendBtn.disabled = true;
    checkBackendBtn.textContent = 'Checking...';
    
    try {
      const isConnected = await window.GeminiAPI.validateConnection();
      
      if (isConnected) {
        backendStatus.textContent = 'Backend server is connected and API key is configured!';
        backendStatus.className = 'success';
        checkBackendBtn.textContent = '✓ Connected';
      } else {
        const backendInfo = await window.GeminiAPI.getBackendStatus();
        backendStatus.textContent = 'Backend server is reachable but API key is not configured properly.';
        backendStatus.className = 'error';
        checkBackendBtn.textContent = '⚠️ API Key Issue';
      }
    } catch (error) {
      console.error('Backend connection check failed:', error);
      backendStatus.textContent = 'Unable to connect to backend server. Please ensure it is running.';
      backendStatus.className = 'error';
      checkBackendBtn.textContent = '❌ Connection Failed';
    }
    
      setTimeout(() => {
      checkBackendBtn.disabled = false;
      checkBackendBtn.textContent = 'Check Connection';
    }, 3000);
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
