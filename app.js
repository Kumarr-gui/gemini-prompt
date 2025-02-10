import { GoogleGenerativeAI } from "@google/generative-ai";
import express, { response } from "express";
import 'dotenv/config';
import fs from 'fs';
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

//gardeManual
const gradeManual = await genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `Strictly give response in this format:
[
  {"" : "text"}
]
`,
});


// Read the JSON file
fs.readFile('final-transcript.json','utf-8',(err, data) =>{
    if(err){
        console.error(err);
        return;
    }
    const parsedJSON = JSON.parse(data);

    parsedJSON.forEach(finalTranscript=>{
        const id = finalTranscript.id;
        const speaker = finalTranscript.speaker;
        const text = finalTranscript.text;

        console.log(`ID:${id}`)
        console.log(`Speaker : ${speaker}`);
        console.log(`Text: ${text}\n`);
    }
    )
})

// provide the prompt here 
const prompt = "";

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
    let parsedResponse;
    try{
        parsedResponse = JSON.parse(clearResponse);
    }catch(error){
        console.error('Error while parsing the response',error);
        return res.status(500).json({message:'Internam server error'}); 
    }
    res.json({response:clearResponse});

    }catch(error){
        console.error('Something Went Wrong',error);
        return res.status(500).json({message:'Internal server error'});
    }
})


app.listen(process.env.PORT,()=>{
    console.log(`server started at ${process.env.PORT}`);
})


