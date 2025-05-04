import { Server } from 'socket.io'

// Map<conversationId, userId[]>
const conversations = new Map<string, Set<string>>()
// Map<workspaceId, Array<{ userId: string, socketId: string }>>
const workspaceOnlineUsers = new Map<string, Map<string, string>>()
const socketHandler = (io: Server) => {
  io.on('connection', (socket) => {
    // conversation
    socket.on('join-conversation', (conversationId, userId) => {
      socket.join(conversationId)
      if (!conversations.has(conversationId)) {
        conversations.set(conversationId, new Set())
      }
      conversations.get(conversationId)?.add(userId)
      socket.data.userId = userId
    })

    socket.on('send-message', (message) => {
      socket.to(message.conversationId).emit('receive-message', message)
      // await notificationMessageService.....
    })
    socket.on('edit-message', (message) => {
      socket.to(message.conversationId).emit('receive-edit-message', message)
    })
    socket.on('delete-message', (message) => {
      socket.to(message.conversationId).emit('receive-delete-message', message)
    })
    socket.on('react-message', (message) => {
      socket.to(message.conversationId).emit('receive-react-message', message)
    })

    socket.on('leave-conversation', (conversationId, userId) => {
      socket.leave(conversationId)
      conversations.get(conversationId)?.delete(userId)
      if (conversations.get(conversationId)?.size === 0) {
        conversations.delete(conversationId)
      }
    })
    // workspace online users
    socket.on('join-workspace-online', (workspaceId, userId) => {
      socket.data.userId = userId
      socket.join(workspaceId)
      if (!workspaceOnlineUsers.has(workspaceId)) {
        workspaceOnlineUsers.set(workspaceId, new Map())
      }
      workspaceOnlineUsers.get(workspaceId)?.set(userId, socket.id)
      socket.emit('users-online', Array.from(workspaceOnlineUsers.get(workspaceId)?.keys() || []))
      socket.to(workspaceId).emit('user-online', userId)
    })

    socket.on('disconnect', () => {
      const userId = socket.data.userId
      if (!userId) return
      // offline user
      for (const [workspaceId, users] of workspaceOnlineUsers.entries()) {
        if (users.has(userId)) {
          users.delete(userId)
          socket.to(workspaceId).emit('user-offline', userId)
          if (users.size === 0) {
            workspaceOnlineUsers.delete(workspaceId)
          }
        }
      }
    })
  })
}

export default socketHandler
