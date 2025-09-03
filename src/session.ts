import { AgentInputItem } from '@openai/agents'

const sessionStore: Record<string, AgentInputItem[]> = {}

const pullChat = async (sessionId: string) => {
    return sessionStore[sessionId]
}

const storeChat = async (sessionId: string, thread: AgentInputItem[]) => {
    sessionStore[sessionId] = thread
}

export { pullChat, storeChat }