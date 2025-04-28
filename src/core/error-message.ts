const ERROR_MESSAGES = {
  // auth
  USER_NOT_FOUND: 'User not found in our system.',
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  ACCOUNT_NOT_ACTIVATED: 'Your account is not activated, please check your email to activate account and try again',
  EMAIL_ALREADY_EXIST: 'Email is already exist.',
  // mail
  CHECK_EMAIL: 'Please check your email to verify your account and try again...',
  INVALID_OTP: 'Invalid OTP token.',
  // resource
  RESOURCE_ALREADY_EXIST: 'Resource already exists.',
  ROLE_ALREADY_EXIST: 'Role already exists.',
  // workspace
  WORKSPACE_NOT_FOUND: 'Workspace not found.',
  WORKSPACE_EXISTED: 'Workspace already exists.',
  USER_NOT_IN_WORKSPACE: 'User are not in this workspace, please join the workspace first.',
  NOT_ADMIN_WORKSPACE: 'You are not admin of this workspace, you can not invite user to this workspace.',
  ALREADY_SEND_INVITATION: 'Invitation already sent to this email.',
  INVITATION_NOT_FOUND: 'Invitation not found or expired.',
  USER_ALREADY_IN_WORKSPACE: 'User already in this workspace, go to specific channel to invite them.',
  // channel
  CHANNEL_EXISTED: 'Channel already exists.',
  CHANNEL_NOT_FOUND: 'Channel not found in this workspace.',
  USER_ALREADY_IN_CHANNEL: 'User already in this channel',
  USER_NOT_IN_CHANNEL: 'User not in this channel',
  CONVERSATION_NOT_FOUND: 'Conversation not found.',
  USER_NOT_IN_CONVERSATION: 'User not in this conversation.',
  CONVERSATION_IS_EXISTED: 'Conversation already exists.',
  // upload file
  FILE_TOO_BIG: 'File too big, limited to 40MB!',
  TOO_MANY_FILES: 'Too many files, limited to 5 files!',
  ERROR_UPLOADING_FILES: 'Error uploading file, please try again.',
  INVALID_FILE_TYPE: 'Invalid file type, only image files are allowed!',
  // message
  MESSAGE_NOT_FOUND: 'Message not found.'
}
export default ERROR_MESSAGES
