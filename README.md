# VU Amsterdam AI Assistant for Teachers

A Chrome extension that leverages AI to help teachers quickly extract educational value from web content. The assistant analyzes web pages and provides summaries, quiz questions, simplified explanations, and teaching suggestions to support educational activities.

## Features

### Content Summarization
Generate concise summaries of web pages for lesson planning with customizable length options:
- Short (1-2 paragraphs)
- Medium (3-4 paragraphs)
- Long (5+ paragraphs)

### Quiz Question Generation
Create quiz questions based on the current page content with different question types:
- Multiple Choice
- True/False
- Short Answer
- Mixed (combination of types)

### Complex Topic Explanation
Simplify difficult concepts from web content for different educational levels:
- Beginner
- Intermediate
- Advanced

### Teaching Suggestions
Get teaching tips and activity ideas based on web content for different formats:
- Lecture
- Discussion
- Activity
- Assessment

### Additional Features
- **Intelligent Content Extraction**: Automatically identifies headings, paragraphs, and lists from web pages
- **Key Term Highlighting**: Identifies and highlights important terms directly on the web page
- **Export Options**: Copy results to clipboard or download as text files

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
1. Click the extension icon in your Chrome toolbar
2. Enter your OpenAI API key and click "Save"
   - The key is required to use the Gemini 2.0 Flash model via API
   - Your key is stored locally and only used for API requests

### Using the Extension
1. Navigate to any educational webpage
2. Click the extension icon to open the popup
3. Select one of the tabs:
   - **Summarize**: Generate content summaries
   - **Quiz**: Create quiz questions
   - **Explain**: Get simplified explanations
   - **Teaching Tips**: Receive teaching suggestions
4. Configure options (length, format, etc.)
5. Click the appropriate "Generate" button
6. View the results, then copy or download as needed

## Technical Details

### Architecture
- **Background Script**: Handles API communication
- **Content Script**: Extracts content from web pages and applies highlighting
- **Popup Interface**: Provides the user interface and controls
- **API Integration**: Uses the Gemini 2.0 Flash model via API

### Privacy & Security
- API keys are stored locally in Chrome's storage
- Web page content is processed via the API
- No data persistence beyond local browser storage
- No tracking or analytics included

## Development

### Project Structure
- `manifest.json`: Extension configuration
- `popup.html/js/css`: User interface files
- `content.js/css`: Web page interaction
- `background.js`: Background processes
- `api.js`: API communication

### Requirements
- Chrome Browser
- OpenAI API key with access to Gemini models
- Internet connection for API communication

## Support

If you encounter issues:
1. Verify your API key is correct
2. Check that the webpage content is accessible
3. Try refreshing the page or restarting Chrome
4. Contact VU Amsterdam IT support for assistance

## Credits

Developed for Vrije Universiteit Amsterdam to enhance teaching with AI assistance. 