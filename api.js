// API integration module for VU Amsterdam AI Assistant
// Direct implementation using REST API approach for Chrome extension compatibility

/**
 * Generate content using Gemini model via direct REST API call
 * @param {string} apiKey - The Gemini API key
 * @param {string} prompt - The user prompt
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The generated content
 */
async function generateContent(apiKey, prompt, options = {}) {
  try {
    console.log(`Starting API request with prompt: ${prompt?.substring(0, 100)}...`);

    // Prepare request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: options.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt
            }
          ]
        }
      ]
    };

    // Log the request for debugging
    console.log("Request body:", JSON.stringify(requestBody));

    // Make direct REST API call to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Get the raw response text for better error handling
    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", parseError);
      throw new Error(`Failed to parse API response: ${responseText.substring(0, 100)}...`);
    }

    // Check if response is successful
    if (!response.ok) {
      // Enhanced error handling with detailed information
      const errorMessage = data.error?.message || response.statusText;
      const errorCode = data.error?.code || response.status;

      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorCode,
        errorMessage,
        data
      });

      throw new Error(`API Error (${errorCode}): ${errorMessage}`);
    }

    // Verify the response structure and extract the content
    if (!data.candidates?.[0]?.content) {
      console.error("Unexpected API response structure:", data);
      throw new Error("Unexpected API response structure. Check console for details.");
    }

    // Extract the text from the response
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Return a more user-friendly error message
    throw new Error(`API Error: ${error.message || "Unknown error occurred. Please check your API key and try again."}`);
  }
}

/**
 * Validate the API key by making a simple request
 * @param {string} apiKey - The Gemini API key to validate
 * @returns {Promise<boolean>} - Whether the API key is valid
 */
async function validateApiKey(apiKey) {
  try {
    if (!apiKey?.trim()) {
      console.error("Empty API key provided");
      return false;
    }

    console.log("Validating API key...");

    // Make a simple request to check if API key is valid
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Get the raw response for better error handling
    const responseText = await response.text();
    console.log("Validation response:", responseText);

    if (!response.ok) {
      console.error("API key validation failed:", response.status, responseText);
      return false;
    }

    // Try to parse the response
    try {
      const data = JSON.parse(responseText);
      const isValid = !!(data.models && data.models.length > 0);
      console.log("API key validation result:", isValid);
      return isValid;
    } catch (parseError) {
      console.error("Failed to parse validation response:", parseError);
      return false;
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

// Export functions for use in popup.js
window.GeminiAPI = {
  generateContent,
  validateApiKey
};
