# VU Amsterdam AI Assistant for Teachers - Codebase Overview

## Project Purpose
The VU Amsterdam AI Assistant for Teachers is a Chrome extension designed to help educators extract educational value from web content. It leverages the Google Gemini AI API to analyze web pages and provide:
- Content summaries for lesson planning
- Automated quiz generation
- Concept explanations at different educational levels
- Teaching suggestions and activity ideas
- Interactive content highlighting

## Directory Structure
```
vu_extension/
├── manifest.json           # Extension configuration and metadata
├── api.js                 # Google Gemini API integration
├── background.js          # Chrome extension background service worker
├── content.js             # Web page interaction and content extraction
├── content.css           # Styles for web page modifications
├── popup.html            # Extension popup UI
├── popup.js              # Popup interface logic
├── popup.css            # Popup styling
├── settings.html        # API key and language settings UI
├── settings.js          # Settings management logic
├── iframe-bridge.js     # Communication between popup and content
├── images/              # Extension icons and assets
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── vu_logo.svg
└── locales/             # Internationalization
    ├── en.json         # English translations
    └── nl.json         # Dutch translations
```

## Module Descriptions

### Core Components
- **manifest.json**: Defines extension metadata, permissions, and resource locations
- **api.js**: Handles all communication with Google Gemini API, including content generation and key validation
- **background.js**: Manages extension lifecycle and cross-script communication
- **content.js**: Responsible for web page analysis, content extraction, and UI modifications
- **popup.js**: Implements the main extension interface and feature logic

### UI Components
- **popup.html/css**: Main extension interface with tabs for different features
- **settings.html/js**: API key management and language preferences
- **content.css**: Styles for webpage modifications (highlighting, annotations)
- **iframe-bridge.js**: Facilitates communication between popup and webpage context

### Supporting Files
- **locales/**: Language files for English and Dutch internationalization
- **images/**: Extension icons and visual assets

## Key Components

### Content Extraction (content.js)
```javascript
function extractStructuredContent() {
  // Extracts page content including:
  // - Title and meta information
  // - Headings (h1-h3)
  // - Paragraphs
  // - Lists
  // - Images with alt text
  // - Tables
}
```

### Feature Implementation (popup.js)
- **Summarization**: Generates concise content summaries with customizable length
- **Quiz Generation**: Creates questions with multiple formats and difficulty levels
- **Concept Explanation**: Simplifies content for different educational levels
- **Teaching Suggestions**: Provides activity ideas and lesson planning help

### API Integration (api.js)
- Secure communication with Google Gemini API
- Content generation with system prompts for different features
- API key validation and management

## Data Flow

1. **Content Extraction**:
   ```
   Webpage → content.js → extractStructuredContent() → popup.js
   ```

2. **AI Processing**:
   ```
   popup.js → api.js → Gemini API → Response → Display
   ```

3. **UI Updates**:
   ```
   User Input → popup.js → content.js → Page Modifications
   ```

## Dependencies

### External Services
- **Google Gemini API**: Primary AI model for content generation
- **Chrome Extension APIs**:
  - `chrome.tabs`
  - `chrome.storage`
  - `chrome.scripting`

### Browser Requirements
- Google Chrome or Chromium-based browser
- Active internet connection
- Valid Google Gemini API key

## Build & Deployment

### Development Setup
1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

### Production Deployment
1. Update version in manifest.json
2. Package extension:
   - Zip all files maintaining directory structure
   - Exclude any development/documentation files
3. Submit to Chrome Web Store (future)

### Testing
- Test across different types of web pages
- Verify all features with various content lengths
- Check both English and Dutch language support
- Validate API key management and error handling

## Security Considerations

- API keys stored locally in Chrome storage
- Content processing happens client-side
- Cross-origin security measures implemented
- No user data collection or external storage