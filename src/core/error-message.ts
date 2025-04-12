const ERROR_MESSAGES = {
  // auth
  USER_NOT_FOUND: 'User not found.',
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
  USER_NOT_IN_WORKSPACE: 'You are not in this workspace, please join the workspace first.',
  // channel
  CHANNEL_EXISTED: 'Channel already exists.'
}
export default ERROR_MESSAGES
