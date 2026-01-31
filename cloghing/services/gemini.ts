import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: We use the process.env.API_KEY as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found, returning placeholder.");
    return "This is a placeholder description. Please configure your API Key to use AI generation.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a sophisticated, short (max 2 sentences) marketing description for a clothing item.
      Item Name: ${name}
      Category: ${category}
      Tone: Modern, minimalist, high-quality.`,
    });

    return response.text?.trim() || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description. Please try again.";
  }
};
