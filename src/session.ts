import { AgentInputItem } from '@openai/agents'

let sessionStore: Record<string, AgentInputItem[]> = {}

const pullSession = async (sessionId: string) => {
    return sessionStore[sessionId]
}

const storeSession = async (sessionId: string, thread: AgentInputItem[]) => {
    sessionStore[sessionId] = thread
}

export { pullSession, storeSession }