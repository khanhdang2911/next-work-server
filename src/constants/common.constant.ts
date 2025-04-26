enum ROLES {
  ADMIN = 'admin',
  USER = 'user'
}

const MAX_AGE = 7 * 24 * 60 * 60 * 1000

enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female'
}

enum CONVERSATION_TYPE {
  CHANNEL = 'channel',
  DIRECT = 'direct'
}

enum USER_STATUS {
  ONLINE = 'Online',
  AWAY = 'Away'
}

export { ROLES, MAX_AGE, GENDER, CONVERSATION_TYPE, USER_STATUS }
