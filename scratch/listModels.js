import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const listModels = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The SDK might not have a direct listModels, but we can try to find one or use a common model name.
        // Let's try 'gemini-1.5-flash-8b' or 'gemini-pro'
        
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        for (const m of models) {
             try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`Model ${m} WORKS`);
                return;
             } catch (e) {
                console.log(`Model ${m} FAILED: ${e.message}`);
             }
        }
    } catch (error) {
        console.error("List failed:", error.message);
    }
};

listModels();
