import * as readline from 'readline-sync';

import Client from "./client.js";

const App = async () => {

  const agentURL = process.env['AGENT_URL'] ?? "http://127.0.0.1:3001"
  const client = new Client(agentURL);

  // start a new session
  const sessionId = await client.createSession()

  while (true) {
    const prompt = readline.question("Prompt: \n");
 
    if (typeof prompt !== "string" || prompt === "exit") {
      return 
    }

    let response: string = ""
    try {
      response = await client.userMessage(prompt, sessionId);
      console.log("\n")
      console.log(response)
      console.log("\n")
    } catch (e: any) {
      console.log("\n")
      console.log("Error: " + e.toString())
      console.log("\n")
    }
  }
}

export default App