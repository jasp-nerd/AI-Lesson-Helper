# VU Amsterdam AI Assistant for Teachers

A Chrome extension that leverages Google Gemini AI to help teachers extract educational value from web content. The assistant analyzes web pages and provides summaries, quiz questions, simplified explanations, and teaching suggestions to support educational activities.

![Example Image](https://i.imgur.com/9qX7e7c.png)

## Features

- **Summarize**: Generate concise summaries of web pages for lesson planning with customizable length options (Short, Medium, Long).
- **Quiz**: Create quiz questions based on the current page content with different question types (Multiple Choice, True/False, Short Answer, Mixed) and difficulty/level settings.
- **Explain**: Simplify difficult concepts from web content for different educational levels (Beginner, Intermediate, Advanced).
- **Teaching**: Get teaching tips and activity ideas based on web content for different formats (Lecture, Discussion, Activity, Assessment).
- **Key Term Highlighting**: Highlights important terms directly on the web page.
- **Export Options**: Copy results to clipboard or download as text files.
- **Intelligent Content Extraction**: Automatically identifies headings, paragraphs, and lists from web pages.

![Example Image](https://i.imgur.com/J72b6Zd.png)

## Installation

### From the Chrome Web Store (Future)
Once published:
1. Visit the Chrome Web Store
2. Search for "VU Amsterdam AI Assistant for Teachers"
3. Click "Add to Chrome"
4. Follow the prompts to complete installation

### Direct Installation (Developer Mode)
1. Download and extract the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right
4. Click "Load unpacked" button
5. Select the extracted folder (vu_extension) and click "Open"

## Setup and Usage

### Initial Setup
1. Click the extension icon in your Chrome toolbar.
2. Enter your Google Gemini API key and click "Save".
   - Your API key is required to use the Gemini model via API.
   - The key is stored locally in your browser and only used for API requests.

### Using the Extension
1. Navigate to any webpage (works best on educational or informational pages).
2. Click the extension icon to open the popup.
3. Select one of the tabs:
   - **Summarize**: Generate content summaries.
   - **Quiz**: Create quiz questions.
   - **Explain**: Get simplified explanations.
   - **Teaching**: Receive teaching suggestions.
4. Configure options (length, format, difficulty, etc.).
5. Click the appropriate "Generate" button.
6. View the results, then copy or download as needed.

## Privacy
- Your Google Gemini API key is only stored locally in your browser and never shared externally except for making requests to the Gemini API.
- No user data is collected or transmitted elsewhere.

## Development

### Project Structure
- `manifest.json`: Extension configuration
- `popup.html`, `popup.js`, `popup.css`: User interface files (popup window)
- `content.js`, `content.css`: Web page interaction and content extraction
- `background.js`: Background processes
- `api.js`: Handles communication with the Google Gemini API

### Requirements
- Chrome Browser
- Google Gemini API key
- Internet connection for API communication

## Credits

Developed for Vrije Universiteit Amsterdam to enhance teaching with AI assistance.