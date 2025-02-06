import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = "Who is Virat Kohli";

const result = await model.generateContent(prompt);
console.log(result.response.text());