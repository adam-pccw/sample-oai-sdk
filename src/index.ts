import express from 'express'
import { config } from 'dotenv'
import MainAgent from './agents.js'
import { run } from '@openai/agents'

config({ path: '.env' })

const app = express()
const port = process.env['PORT']

app.get('/', async (req, res) => {

  const result = await run(MainAgent, 'What is the weather?');
  res.send(result.finalOutput)
})

app.listen(port, () => {
  console.log(`Open AI Agentic SDK Sample running on port ${port}`)
})