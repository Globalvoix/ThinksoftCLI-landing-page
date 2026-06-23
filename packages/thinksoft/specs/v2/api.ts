// @ts-nocheck

import { Thinksoft } from "@thinksoft/core"
import { ReadTool } from "@thinksoft/core/tools"

const Thinksoft = Thinksoft.make({})

Thinksoft.tool.add(ReadTool)

Thinksoft.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

Thinksoft.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

Thinksoft.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await Thinksoft.session.create({
  agent: "build",
})

Thinksoft.subscribe((event) => {
  console.log(event)
})

await Thinksoft.session.prompt({
  sessionID,
  text: "hey what is up",
})

await Thinksoft.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await Thinksoft.session.wait()

console.log(await Thinksoft.session.messages(sessionID))
