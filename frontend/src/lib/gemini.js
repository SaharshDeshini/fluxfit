import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client. 
// Requires VITE_GEMINI_API_KEY in the frontend/.env file
const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/**
 * Sends a structured prompt to Gemini 2.5 Flash and forces a JSON response
 * matching the schema provided in the prompt.
 * 
 * @param {string} promptText The compiled instruction string containing the user data and exact JSON schema.
 * @returns {Promise<Object>} The parsed JSON object containing program and routine arrays.
 */
export const generateWorkoutProgram = async (promptText) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("Missing VITE_GEMINI_API_KEY. Please add it to your .env file.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promptText,
            config: {
                // Enforce strict JSON output from the model
                responseMimeType: "application/json",
                // Fast generation, precise schema adherence
                temperature: 0.2,
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }

        throw new Error("Empty response received from Gemini.");

    } catch (error) {
        console.error("Failed to generate workout program:", error);
        throw error;
    }
};
