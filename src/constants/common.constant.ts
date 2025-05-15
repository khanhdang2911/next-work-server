enum ROLES {
  USER = 'user',
  CHANNEL_ADMIN = 'channel_admin',
  WORKSPACE_ADMIN = 'workspace_admin',
  ADMIN = 'admin'
}

const MAX_AGE = 7 * 24 * 60 * 60 * 1000

enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female'
}

enum CONVERSATION_TYPE {
  CHANNEL = 'channel',
  DIRECT = 'direct',
  CHATBOT = 'chatbot'
}

enum USER_STATUS {
  ONLINE = 'Online',
  AWAY = 'Away'
}

export { ROLES, MAX_AGE, GENDER, CONVERSATION_TYPE, USER_STATUS }
