import { AgentInputItem } from '@openai/agents'
import prisma from '../prisma'

const pullChat = async (sessionId: string): Promise<AgentInputItem[]> => 
    JSON.parse((await prisma.session.findUnique({
        where: { id: sessionId },
        select: { content: true }
    }))?.content ?? '[]') ?? []

const storeChat = async (sessionId: string, thread: AgentInputItem[]) =>
    await prisma.session.upsert({
        where: { id: sessionId },
        update: { content: JSON.stringify(thread) },
        create: { id: sessionId, content: JSON.stringify(thread) }
    })

const listChats = async () =>
    (await prisma.session.findMany({
        select: { id: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    }))
    .map(s => ({
        id: s.id,
        title: 'test-petros',
        createAt: s.createdAt,
        visibility: 'private'
    }))

const deleteChat = async (sessionId: string) =>
    await prisma.session.delete({ where: { id: sessionId } })

export { pullChat, storeChat, listChats, deleteChat }