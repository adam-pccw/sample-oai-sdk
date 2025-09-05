import { AgentInputItem } from '@openai/agents'

const sessionStore: Record<string, AgentInputItem[]> = {}

const pullChat = async (sessionId: string) => {
    return sessionStore[sessionId]
}

const storeChat = async (sessionId: string, thread: AgentInputItem[]) => {
    sessionStore[sessionId] = thread
}

const listChats = async () => {
    return Object.keys(sessionStore).map((k: string) => {return {id:k, title: "test", createAt: Date().toString(), visibility: "private"}})
}

const deleteChat = async (sessionId: string) => {
    delete sessionStore[sessionId]
}

export { pullChat, storeChat, listChats, deleteChat }