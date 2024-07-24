export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: string
  username: string
  role?: string
  email?: string
  phone?: string
  address?: string
  firstName?: string
  lastName?: string
  avatar?: string | null
  clinicId?: string
  clinicParentId?: string
  token?: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
