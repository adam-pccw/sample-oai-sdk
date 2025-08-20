import express from 'express'
import { Langfuse } from "langfuse"
 

import { getConfig, loadConfig } from './config.js'
import { pullSession, storeSession } from './session.js'
import { simpleRun } from './workflows.js'
import bodyParser from 'body-parser'

new Langfuse();

// config
await loadConfig()
const config = await getConfig()
const port = config.port

// app initialization
const app = express()
app.use(bodyParser.text());
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended: true}));

// endpoint declarations
app.get('/createSession', async (req: express.Request, res: express.Response) => {
  const sessionId = crypto.randomUUID()
  console.log(`\nSTARTING SESSION: ${sessionId}\n\n`)
  await storeSession(sessionId, [])
  res.send(sessionId)
  res.end()
})

app.post('/', async (req: express.Request, res: express.Response) => {
  const r = req.body;
  const userMessage = r.message
  const sessionId = r.sessionId;
  const thread = await pullSession(sessionId) 
  const result = await simpleRun(
    thread.concat({ role: 'user', content: userMessage })
  );
  const newThread = result.history;
  await storeSession(sessionId, newThread)
  res.send(result.finalOutput.toString())
  res.end()
})

// start server
app.listen(port, () => {
  console.log(`Open AI Agentic SDK Sample running on port ${port}`)
})