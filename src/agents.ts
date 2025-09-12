import { Agent, tool } from '@openai/agents'
import z from "zod"
import  { getAllMemoryTool, addToMemoryTool, searchMemoryTool } from "./memory.js"

const weatherTool = tool({
  name: 'weather_tool',
  description: 'Tells the weather',
  parameters: z.object({}),
  execute: async () => {
    return 'It is 27 degrees.';
  },
});

export default new Agent({
  name: 'Main Agent',
  instructions:
    'You are a helpful assistant with memory capabilities. You can:' +
    '1. Store new information using add_to_memory' +
    '2. Search existing information using search_memory' +
    '3. Retrieve all stored information using get_all_memory' +
    '4. Receive files and give reports on the information they contain' +
    'When users ask questions: ' +
    '- If they want to store information, use add_to_memory' +
    '- If they are searching for specific information, use search_memory' +
    '- If they want to see everything stored, use get_all_memory' +
    'Please do not store any information that might identify someone such as: ' +
    '- name' +
    '- address ' +
    '- date of birth' + 
    'When receiving a file:' +
    '- Please inform the user your have received the file and print the name of the file.', 
  tools: [weatherTool, getAllMemoryTool, addToMemoryTool, searchMemoryTool],
});