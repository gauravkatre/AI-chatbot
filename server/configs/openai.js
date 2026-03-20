import {OpenAI} from 'openai.js'

const openai = new OpenAI({
    apiKey: process.env.GEMINI_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

export default openai;
