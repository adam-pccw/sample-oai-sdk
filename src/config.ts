import { Langfuse } from "langfuse"
import { observeOpenAI } from "langfuse";
import { config } from 'dotenv'
import { setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from '@openai/agents'
import OpenAI from 'openai'

let configSingleton = null

const loadConfig = async () => {

    config({ path: '.env' })
    new Langfuse();

    const openai_base = new OpenAI({
        apiKey: process.env['GOOGLE_API_KEY'],
        baseURL: process.env['OPENAI_API_BASE_URL'] ?? "https://generativelanguage.googleapis.com/v1beta/openai/"
    })

    setOpenAIAPI('chat_completions')
    setTracingDisabled(true)
    const openai = observeOpenAI(openai_base)
    setDefaultOpenAIClient(openai)

    configSingleton = {
        model: process.env['OPENAI_API_MODEL'] ?? 'gemini-2.5-flash',
        port: process.env['PORT'] ?? '3001'
    }

}

const getConfig = async () => {
    return configSingleton
}

export { loadConfig, getConfig }