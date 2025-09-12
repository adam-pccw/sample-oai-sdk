import express from 'express'
import { Langfuse } from "langfuse"
import cors from "cors"
import { getConfig, loadConfig } from './config.js'
import { listChats, pullChat, storeChat, deleteChat } from './chatStore.js'
import { simpleRun } from './workflows.js'
import bodyParser from 'body-parser'
import multer from 'multer'
import path from 'node:path'
import { fileToBase64 } from './utils.js'
import { UserMessageItem } from '@openai/agents'
import { fileURLToPath } from 'url';

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
const upload = multer({ dest: 'uploads/' })

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
  const t = thread.concat({ role: 'user', content: userMessage })
  console.log(t)
  const result = await simpleRun(t);
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

app.post('/file/upload/:chatId', upload.single('file'), async (req: express.Request, res: express.Response) => {

  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  console.log('File uploaded:', );

  const chatId = req.params.chatId;
  const thread = await pullChat(chatId) 

  const filePath = 'uploads/' + req.file.filename
  const b64File = fileToBase64(filePath)

  /*
  const message: UserMessageItem = 
     {
      role: 'user',
      content: "Here is a base64-encoded PDF file: " + b64File
    }
  */

  const message: UserMessageItem = {
      role: 'user',
      content: [{
        type: "input_image",
        image: "data:image/png;base64," + b64File
      },
      {
        type: "input_text",
        text: "Here is an image, please summarize the contents"
    }],
  }

  const result = await simpleRun(
    thread.concat(message)
  );
  const newThread = result.history;
  await storeChat(chatId, newThread)
  console.log(result.finalOutput.toString())
  res.send(result.finalOutput.toString())
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
