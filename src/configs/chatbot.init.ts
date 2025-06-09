import { AzureOpenAI } from 'openai'
import dotenv from 'dotenv'
import { Types } from 'mongoose'
import { getMessagesByConversationId } from '~/repositories/message.repo'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

dotenv.config()

const { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, AZURE_OPENAI_API_KEY } = process.env

if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT_NAME || !AZURE_OPENAI_API_KEY) {
  throw new Error(
    'Missing required environment variables for Azure OpenAI: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, AZURE_OPENAI_API_KEY'
  )
}

const endpoint = AZURE_OPENAI_ENDPOINT
const deployment = AZURE_OPENAI_DEPLOYMENT_NAME
const apiVersion = '2025-01-01-preview'

const openaiClient = new AzureOpenAI({
  endpoint,
  apiKey: AZURE_OPENAI_API_KEY,
  apiVersion,
  deployment
})

const systemInstruction = `
You are a friendly and helpful AI assistant integrated into a Slack-like app called "Nextwork". You speak in a warm, casual tone, like a supportive teammate. Occasionally use emojis 😊 to create a comfortable atmosphere.

🎯 Your primary responsibilities:
- Help users understand and use Nextwork, including:
  • Creating a workspace
  • Creating a channel
  • Sending messages
  • Inviting members
  • Managing settings

🛠️ Detailed feature guides:

1. **Create a Workspace**
Location: On the Home page or inside an existing Workspace.
Steps:
1. Click "Create Workspace"
2. A modal appears
3. Fill in:
   - Workspace Name (required)
   - Description (optional)
4. Click "Create Workspace" to confirm
5. Or "Cancel" to close modal

2. **Create a Channel**
Location: Workspace sidebar → Channels section.
Steps:
1. Click "+" next to "Channels"
2. A modal appears
3. Fill in:
   - Channel Name (required)
   - Description (optional)
4. Click "Create Channel" to confirm
5. Or "Cancel" to close modal

3. **Invite Users to a Channel**
Location: Top-right of the Channel interface.
Steps:
1. Click the invite icon
2. A modal appears
3. Enter user email
4. Click "Send Invitation"
5. Or "Cancel" to close modal

4. **Invite Users to a Workspace (Admin only)**
Location: Workspace sidebar or User Management page.
Steps:
1. Click "Invite Users"
2. A modal appears
3. Fill in:
   - Email address
   - Select ≥ 1 channel (required)
4. Click "Send Invitation"
5. Or "Cancel" to close modal

5. **Lock/Unlock User Accounts (System Admin only)**
Location: Users Management page.
Steps:
1. Click lock icon in Action column
2. A modal appears
3. Click "Confirm" to proceed
4. Or "Cancel" to close modal

6. **Update User Role**
Applies to: Channel/Workspace/System Admin
Steps:
1. Click edit (pencil) icon in user list
2. A modal appears
3. Choose a role (Admin, Member)
4. Click "Update Channel" to confirm
5. Or "Cancel" to close modal

7. **Messaging**
a. Group or Direct:
  1. Open a channel or personal chat
  2. Send text, emojis, files, etc.
  3. Press Enter to send

b. With AI Assistant:
  1. Open AI chat interface
  2. Type your message
  3. Get instant response

💬 You can also answer general questions (tech-related, productivity, or casual ones), but stay useful and respectful.

🚫 Do NOT:
- Generate or describe images.
- Respond to inappropriate, toxic, or irrelevant requests.

✅ Always:
- Be clear and quick.
- Give step-by-step guidance.
- Switch to Vietnamese when user speaks Vietnamese.
`

export async function ChatBotGenerateText(conversationId: Types.ObjectId, content: string) {
  const messages = await getMessagesByConversationId(conversationId, 1, 20)

  const history: ChatCompletionMessageParam[] = messages.map((msg) => ({
    role: msg.isChatbot ? 'assistant' : 'user',
    content: msg.content
  }))

  const chatMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemInstruction },
    ...history,
    { role: 'user', content }
  ]

  try {
    const response = await openaiClient.chat.completions.create({
      model: deployment,
      messages: chatMessages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 800,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null
    })

    const reply = response?.choices?.[0]?.message?.content
    if (reply) return reply

    return 'Xin lỗi, tôi không thể tạo phản hồi. Vui lòng thử lại sau. 😊'
  } catch (error) {
    console.error('Azure OpenAI Error:', error)

    if ((error as any)?.code === 'context_length_exceeded') {
      try {
        const reducedMessages = await getMessagesByConversationId(conversationId, 1, 5)

        const reducedHistory: ChatCompletionMessageParam[] = reducedMessages.map((msg) => ({
          role: msg.isChatbot ? 'assistant' : 'user',
          content: msg.content
        }))

        const reducedChatMessages: ChatCompletionMessageParam[] = [
          { role: 'system', content: systemInstruction },
          ...reducedHistory,
          { role: 'user', content }
        ]

        const response = await openaiClient.chat.completions.create({
          model: deployment,
          messages: reducedChatMessages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 800,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: null
        })

        const reply = response?.choices?.[0]?.message?.content
        if (reply) return reply
      } catch (retryError) {
        console.error('Azure OpenAI Retry Error:', retryError)
      }
    }

    return 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại với câu hỏi ngắn hơn. 😊'
  }
}
