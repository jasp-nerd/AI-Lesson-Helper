// Settings page script for VU Amsterdam AI Assistant
// Handles Gemini API key change logic

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('settings-api-key');
  const saveApiKeyBtn = document.getElementById('settings-save-api-key');
  const apiStatus = document.getElementById('settings-api-status');
  const backBtn = document.getElementById('settings-back-btn');

  // Load current API key (mask if set)
  chrome.storage.local.get(['gemini_api_key'], (result) => {
    if (result.gemini_api_key) {
      apiKeyInput.value = '••••••••••••••••••••••••••';
      apiKeyInput.classList.add('has-content');
      apiStatus.textContent = 'API key is set';
      apiStatus.className = 'success';
    }
  });

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

  // Add shake animation (copied from popup.js)
  function shakeElement(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }

  // Back to popup
  backBtn.addEventListener('click', () => {
    window.location.href = 'popup.html';
  });
});
