import { Agent, tool } from '@openai/agents'
import z from "zod"

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
    'You provide assistance with anything!.',
  tools: [weatherTool],
});