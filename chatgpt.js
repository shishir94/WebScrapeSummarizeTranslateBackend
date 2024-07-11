import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import OpenAI from "openai"

import {getTextFromUrl} from "./urlText.js"
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.post("/chat", async (req, res) => {
  try {
    const { apikey,url, language } = req.body;
    const prompt = await getTextFromUrl(url)
    const openai = new OpenAI({
      apiKey: apikey,
    });
    const messages = [
      {
        "role": "user",
        "content": `Write the summary of ${prompt} in less than 80 words`
      },
      {
        "role": "user",
        "content": `Convert the above summary in ${language}. I need the summary to be exactly in ${language} not in english. You have to exactly use this language in your output.If the 
        ${language} is english just write the summary in english.`
      }
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(completion.choices[0]);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/typing-text", async (req, res) => {
  try {
    const { apikey, level} = req.body;
    const openai = new OpenAI({
      apiKey: apikey,
    });
    const messages = [
      {
        "role": "user",
        "content": `I am giving a typing test. Give me text of ${level} level difficulty having around 120 words for the typing test. Just give me the required text and nothing else. I need only the typing text and nothing else, as I will give your output directly to the end user for typing test
                  Dont start with irrelevant info like : "Sure, here is the text"`
      },
    ];
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.json(completion.choices[0]);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
