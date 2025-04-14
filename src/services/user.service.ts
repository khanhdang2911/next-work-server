import { User } from '~/models/user.model'

const getALlUsersService = async () => {
  const users = await User.find()
  return users
}

const searchUserService = async (keyword: string, userId: string) => {
  const users = await User.find({
    $text: {
      $search: keyword
    }
  }).select('name email avatar gender')
  return users.filter((user) => user._id.toString() !== userId)
}
export { getALlUsersService, searchUserService }
