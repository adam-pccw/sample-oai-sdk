import express from 'express'
import { Langfuse } from "langfuse"
import cors from "cors"
import { getConfig, loadConfig } from './config.js'
import { listChats, pullChat, storeChat, deleteChat } from './chatStore.js'
import { simpleRun } from './workflows.js'
import bodyParser from 'body-parser'
// import multer from 'multer'

new Langfuse();

// config
await loadConfig()
const config = await getConfig()
const port = config.port

// app initialization
const app = express()
app.use(bodyParser.text());
app.use(cors());
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended: true}));
// const upload = multer({ dest: 'uploads/' })

// endpoint declarations
app.get('/createChat', async (req: express.Request, res: express.Response) => {
  const chatId = crypto.randomUUID()
  console.log(`\nSTARTING CHAT: ${chatId}\n\n`)
  await storeChat(chatId, [])
  res.send(chatId)
  res.end()
})

app.post('/', async (req: express.Request, res: express.Response) => {
  const r = req.body;
  const userMessage = r.message
  const chatId = r.chatId;
  const thread = await pullChat(chatId) 
  const result = await simpleRun(
    thread.concat({ role: 'user', content: userMessage })
  );
  const newThread = result.history;
  await storeChat(chatId, newThread)
  res.send(result.finalOutput.toString())
  res.end()
})

app.get('/chatMessages/:chatId', async (req: express.Request, res: express.Response) => {
  const chatId = req.params.chatId;
  console.log(`\nGETTING CHAT: ${chatId}\n\n`)
  const thread = await pullChat(chatId)
  res.send({chat: thread})
  res.end()
})

app.get('/listChats', async (req: express.Request, res: express.Response) => {
  const chats = await listChats()
  res.send({chats})
  res.end()
})

app.delete('/chat/:chatId', async (req: express.Request, res: express.Response) => {
  const chatId = req.params.chatId;
  console.log(`\nDELETING CHAT: ${chatId}\n\n`)
  await deleteChat(chatId)
  res.send({})
  res.end()
})


// start server
try {
  app.listen(port, () => {
    console.log(`Open AI Agentic SDK Sample running on port ${port}`)
  })
} catch (e) {
  console.log("Error" + e)
}
