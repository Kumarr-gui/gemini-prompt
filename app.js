import { GoogleGenerativeAI } from "@google/generative-ai";
import express, { response } from "express";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const gradeManual = await genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `Strictly respond in this format:
[
  {"language name" : "benefits"}
]
`,
  });
const prompt = " give me a list of programming language with their benefits";

const result = await gradeManual.generateContent(prompt);
const promptResponse = await result.response;
const text = promptResponse.text();

console.log(result.response.text());

const app = express();
app.use(express.json());

app.post('/generate',async (req, res)=>{
    try{
        const {prompt} = req.body;
    if(!prompt){
        return res.status(400).json({message:'Prompt invalid'});
    }
    const result = await gradeManual.generateContent(prompt);
    let responseResult = result.response.text();

    const clearResponse = responseResult.replace(/```json\n|\n```/g, "").trim();
    res.json({response:clearResponse});

    }catch(error){
        console.error('Something Went Wrong',error);
        return res.status(500).json({message:'Internal server error'});
    }
})

app.listen(process.env.PORT,()=>{
    console.log(`server started`);
})
