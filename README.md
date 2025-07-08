# VU Education Lab AI Assistant for Teachers

[![License](https://img.shields.io/github/license/jasp-nerd/AI-Lesson-Helper)](LICENSE)

A Chrome extension that leverages Google Gemini AI to help VU teachers extract educational value from web content. The assistant analyzes web pages through a secure backend server and provides summaries, quiz questions, simplified explanations, and teaching suggestions to support educational activities.

![VU Education Lab AI Assistant](https://i.imgur.com/9qX7e7c.png)

## Features

- **Summarize**: Generate concise summaries of web pages for lesson planning with customizable length options (Short, Medium, Long)
- **Quiz**: Create quiz questions based on current page content with different types (Multiple Choice, True/False, Short Answer, Mixed) and difficulty levels
- **Explain**: Simplify difficult concepts from web content for different educational levels (Beginner, Intermediate, Advanced)
- **Teaching**: Get teaching tips and activity ideas based on web content for various formats (Lecture, Discussion, Activity, Assessment, Essay)
- **Custom Prompts**: Ask any question about the current page content with pre-built templates
- **Multilingual Support**: Available in English and Dutch
- **Content Export**: Copy results to clipboard for easy integration into lesson plans
- **Intelligent Content Extraction**: Automatically identifies and processes headings, paragraphs, and lists from web pages
- **Floating Popup**: Optional floating popup for quick access on any webpage

![Extension Interface](https://i.imgur.com/J72b6Zd.png)

## Installation

### From the Chrome Web Store
1. Visit the Chrome Web Store
2. Search for "VU Education Lab AI Assistant for Teachers"
3. Click "Add to Chrome"
4. Follow the prompts to complete installation

### Manual Installation (Developer Mode)
1. Download and extract the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" button
5. Select the extension folder and click "Open"

## Setup and Usage

### Getting Started
1. Click the extension icon in your Chrome toolbar
2. The extension connects automatically to our secure backend server
3. No API key setup required - everything is handled securely on the server side

### Using the Extension
1. Navigate to any educational or informational webpage
2. Click the extension icon to open the popup
3. Choose from five main features:
   - **Summarize**: Generate content summaries with length options
   - **Quiz**: Create quiz questions with customizable types and difficulty
   - **Explain**: Get simplified explanations for complex topics
   - **Teaching**: Receive pedagogical suggestions and activity ideas
   - **Custom**: Use your own prompts or select from templates

4. Configure your preferences (length, difficulty, format, etc.)
5. Click "Generate" to process the content
6. Review the AI-generated results
7. Copy content to clipboard for use in your lesson plans

### Settings
Access the settings page to:
- Switch between English and Dutch interface
- Toggle the floating popup feature
- Check backend connection status
- Access AI literacy resources

## Features in Detail

### Summarize
- **Short**: 1-2 paragraph summaries
- **Medium**: 3-4 paragraph summaries  
- **Long**: 5+ paragraph detailed summaries
- Formatted with markdown for easy classroom use

### Quiz Generation
- **Multiple Choice**: Traditional A, B, C, D questions
- **True/False**: Simple binary questions
- **Short Answer**: Open-ended response questions
- **Mixed**: Combination of all types
- Adjustable difficulty levels and question counts

### Explain Topics
- Automatically detects complex concepts on the page
- Manual topic input for specific explanations
- Three complexity levels: Beginner, Intermediate, Advanced
- Includes practical applications and teaching tips

### Teaching Suggestions
- **Lecture**: Structured presentation ideas
- **Discussion**: Conversation starters and debate topics
- **Activity**: Interactive classroom exercises
- **Assessment**: Evaluation strategies
- **Essay**: Writing prompts and assignment ideas

### Custom Prompts
Pre-built templates include:
- Main Arguments Analysis
- Concept Mapping
- Student Implications
- Bias Analysis
- Multi-modal Representations
- Reflection Questions

## Privacy & Security

- **No Data Collection**: No personal data is stored or transmitted
- **Secure Backend**: All AI processing happens on our secure servers
- **Local Storage Only**: Extension preferences stored locally in your browser
- **No API Keys Required**: No need to manage or expose personal API credentials

## Technical Details

### Browser Compatibility
- Chrome 88+ (Manifest V3 compatible)
- Internet connection required for AI processing

### Backend Architecture
- Secure Express.js backend server
- Google Gemini AI integration
- Deployed on Heroku for reliability
- Rate limiting and error handling

## Support

For questions, issues, or feature requests:
- Email: onderwijswerkplaats@vu.nl
- Documentation: Extension settings page includes AI literacy resources

## License

This project is licensed under the terms specified in the LICENSE file.

## Credits

Developed by **Vrije Universiteit Amsterdam Education Lab** to enhance teaching with responsible AI assistance.