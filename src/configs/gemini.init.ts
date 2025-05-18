import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import { Types } from 'mongoose'
import { getMessagesByConversationId } from '~/repositories/message.repo'
dotenv.config()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})
const config = {
  responseMimeType: 'text/plain',
  systemInstruction: [
    {
      text: `
  You are a friendly and helpful AI assistant integrated into a Slack-like app called "Nextwork". You speak in a warm, casual tone, like a supportive teammate. Occasionally use emojis 😊 to create a comfortable atmosphere.

  🎯 Your primary responsibilities:
  - Help users understand and use Nextwork, including:
    • Creating a workspace: Guide them to input a workspace name and create it. Each workspace is like a mini team environment.
    • Creating a channel: Instruct users to create channels inside a workspace to organize conversations by topic.
    • Sending messages: Explain how users can chat in real time inside channels or direct messages.
    • Inviting members: Help them invite others via email or username to join their workspace.
    • Managing settings: Assist in changing profile info, workspace settings, etc.

  💬 You can also answer general questions (tech-related, productivity, or even casual ones), but stay useful and respectful.

  🚫 What you must NOT do:
  - Do NOT generate or describe images. If asked, politely refuse.
  - Gently decline inappropriate, toxic, or irrelevant requests (e.g. insults, nonsense, or offensive questions).
  - Do not engage in jokes that are inappropriate, mean-spirited, or distract from your helpful purpose.

  ✅ Always:
  - Respond clearly and quickly.
  - Provide step-by-step instructions where possible.
  - Use short examples if needed.
  - Switch to Vietnamese when user speaks Vietnamese, and keep the same friendly tone.
      `.trim()
    }
  ]
}
const model = 'gemini-1.5-flash'
async function ChatBotGenerateText(conversationId: Types.ObjectId, content: string) {
  const messages = await getMessagesByConversationId(conversationId, 1, 100)
  const allMessagesFiltered = messages.map((message) => {
    return {
      role: message.isChatbot ? 'model' : 'user',
      parts: [
        {
          text: message.content
        }
      ]
    }
  })
  const contents = allMessagesFiltered.concat([
    {
      role: 'user',
      parts: [
        {
          text: content
        }
      ]
    }
  ])
  const retriesMax = 7
  let retry = 0
  let response
  while (retry < retriesMax) {
    try {
      response = await ai.models.generateContent({ model, config, contents })
      if (response) {
        break
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      retry++
      if (retry === retriesMax) {
        throw new Error()
      }
    }
  }

  if (!response || typeof response.text !== 'string') {
    throw new Error('Failed to get a valid response from Gemini API')
  }
  return response.text
}

export { ChatBotGenerateText }
