interface UserUpdateDTO {
  name: string
  status: string
  avatar: string
  gender: string
}

interface UserUpdateAdminDTO extends UserUpdateDTO {
  role: string
}

export { UserUpdateDTO, UserUpdateAdminDTO }
