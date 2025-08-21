import { Memory } from 'mem0ai/oss'
import { getConfig, loadConfig } from './config.js'
import { tool } from '@openai/agents';
import { z } from 'zod';

await loadConfig()
const config = await getConfig()

const memory = new Memory(config.memory)

const addToMemoryTool = tool({
  name: 'add_to_memory',
  description: 'Add a message to long term memory store',
  parameters: z.object({ userId: z.string(), content: z.string() }),
  async execute({ userId, content }) {
    console.log("Add to memory called")
    return await add_to_memory(userId, content)
  },
});        

const searchMemoryTool = tool({
  name: 'search_memory',
  description: 'Search a memory for a givne query from the long term memory store',
  parameters: z.object({ userId: z.string(), query: z.string() }),
  async execute({ userId, query }) {
    console.log("Search memory called")
    return await search_memory(userId, query)
  },
});    

const getAllMemoryTool = tool({
  name: 'get_all_memory',
  description: 'Get all memories for a given user from the long term memory store',
  parameters: z.object({ userId: z.string() }),
  async execute({ userId }) {
    console.log("Get all memory called")
    return await get_all_memory(userId)
  },
});    

const add_to_memory = async (
    userId: string,
    content: string,
) => {
    try {
        const messages = [{"role": "user", "content": content}]
        console.log("Adding to memory")
        await memory.add(messages, { userId: userId })
        console.log("Add to memory finihsed")
        return "Stored message: {content}"
    } catch (e: any) {
        console.log(e)
    }
}
    
const search_memory = async (
    userId: string,
    query: string,
) => {
    try {
        const memories = await memory.search(query, {userId})
        return memories
    } catch (e: any) {
        console.log(e)
    }
}
    
const get_all_memory = async (
    userId: string,
) => {
    try {
        const memories = await memory.getAll({ userId })
        return memories
    } catch (e: any) {
        console.log(e)
    }
}

export { getAllMemoryTool, addToMemoryTool, searchMemoryTool }