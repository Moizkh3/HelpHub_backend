import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const testAi = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Using API Key:", apiKey ? "FOUND" : "MISSING");
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("Sending test prompt...");
        const result = await model.generateContent("Say hello world in 2 words.");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (error) {
        console.error("AI TEST FAILED:", error.message);
    }
};

testAi();
