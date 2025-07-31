import express from 'express'
import { config } from 'dotenv'
import MainAgent from './agents.js'
import { run, setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from '@openai/agents'
import OpenAI from 'openai'
import { Runner } from '@openai/agents';

config({ path: '.env' })

console.log(process.env['OPENAI_API_BASE_URL'])

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  baseURL: process.env['OPENAI_API_BASE_URL'] ?? "https://generativelanguage.googleapis.com/v1beta/openai/"
})
const runner = new Runner({ model: 'gemini-2.5-pro' })
setDefaultOpenAIClient(openai)
setOpenAIAPI('chat_completions')
setTracingDisabled(true)

const app = express()
const port = process.env['PORT']

app.get('/', async (req, res) => {
  
  const result = await runner.run(MainAgent, 'What is the weather?');
  res.send(result.finalOutput)
})

app.listen(port, () => {
  console.log(`Open AI Agentic SDK Sample running on port ${port}`)
})