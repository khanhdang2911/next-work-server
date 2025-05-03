interface MessageDTO {
  content: string
  senderId: string
  conversationId: string
  reactions?: {
    emoji: string
    count: number
    users: string[]
  }[]
  attachments?: {
    name: string
    type: string
    size: number
    url: string
  }[]
}

interface ReactMessageDTO {
  emoji: string
}
export { MessageDTO, ReactMessageDTO }
