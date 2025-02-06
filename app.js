import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import 'dotenv/config'
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = "what is JSON format";

const result = await model.generateContent(prompt);
console.log(result.response.text());

const app = express();
app.use(express.json());

app.post('/generate', async (req , res)=>{
    try{
        const { prompt}  = req.body;
        if(!prompt){
            return res.status(400).json({error: "Prompt is required"})
        }
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ response: responseText })
    }catch(error){
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
)
app.listen(process.env.PORT, ()=>{
    console.log("Port is listening at 5505")
})