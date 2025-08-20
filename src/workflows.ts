import MainAgent from './agents.js'
import { Runner, AgentInputItem } from '@openai/agents'
import { getConfig, loadConfig } from './config.js'

await loadConfig()
const config = await getConfig()
const model = config.model
const runner = new Runner({ model })

const simpleRun = async (thread: AgentInputItem[]) => {
    return await runner.run(
        MainAgent,
        thread,
    );
}

export { simpleRun }
