import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generates smart suggestions for a help request title and description.
 * returns { suggestedCategory, detectedUrgency, suggestedTags, rewriteSuggestion }
 */
export const getSmartSuggestions = async (title = '', description = '') => {
    try {
        console.log(`[AI] Generating suggestions for: "${title}"`);
        if (!title && !description) return null;

        const prompt = `
            You are an AI assistant for "HelpHub", a community help platform.
            Analyze the following help request:
            Title: "${title}"
            Description: "${description}"

            Provide a JSON response with the following fields:
            1. "suggestedCategory": Choose one from [Web Development, Design, Data Science, Career, Community, Marketing].
            2. "detectedUrgency": Choose one from [Low, Medium, High].
            3. "suggestedTags": An array of up to 5 relevant technical or topical strings.
            4. "rewriteSuggestion": A more professionally written, clear, and actionable version of the title and summary (max 2 sentences).

            Return ONLY the raw JSON. No conversational filler, no markdown formatting like \`\`\`json.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        
        // Robust JSON extraction
        if (text.includes("```")) {
            text = text.replace(/```json|```/g, "").trim();
        }
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        throw new Error("Invalid AI response format: " + text);
    } catch (error) {
        console.error("AI Assistant Error:", error);
        // Fallback to basic logic if AI fails
        return {
            suggestedCategory: 'Community',
            detectedUrgency: 'Medium',
            suggestedTags: ['Help Needed'],
            rewriteSuggestion: 'Start describing your problem to generate a professional rewrite.'
        };
    }
};

/**
 * Generates a concise AI summary for a help request.
 */
export const generateAiSummary = async (description) => {
    try {
        if (!description) return "";

        const prompt = `
            Summarize the following help request in a single, professional sentence that highlights exactly what the user is struggling with and what they need.
            Description: "${description}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Summary Error:", error);
        return description.substring(0, 150) + "...";
    }
};
