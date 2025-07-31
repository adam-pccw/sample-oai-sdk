import express from 'express'
import { Runner, AgentInputItem } from '@openai/agents'

import MainAgent from './agents.js'
import { getConfig, loadConfig } from './config.js'
import { pullSession, storeSession } from './session.js'

// config
await loadConfig()
const config = await getConfig()
const port = config.port
const model = config.model

// app initialization
const app = express()
app.use(express.json());
const runner = new Runner({ model })

// endpoint declarations
app.get('/createSession', async (req: express.Request, res: express.Response) => {
  const sessionId = crypto.randomUUID()
  console.log(`\n\STARTING SESSION: ${sessionId}\n\n`)
  await storeSession(sessionId, [])
  res.send(sessionId)
})

app.post('/', async (req: express.Request, res: express.Response) => {
  const r = req.body;
  const userMessage = r.message
  const sessionId = r.sessionId;
  const thread = await pullSession(sessionId) 
  const result = await runner.run(
    MainAgent,
    thread.concat({ role: 'user', content: userMessage }),
  );
  const newThread = result.history;
  await storeSession(sessionId, newThread)
  res.send(result.finalOutput)
})

// start server
app.listen(port, () => {
  console.log(`Open AI Agentic SDK Sample running on port ${port}`)
})