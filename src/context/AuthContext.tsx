// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { gql, useLazyQuery, useQuery } from '@apollo/client'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}


const AuthProvider = ({ children }: Props) => {
    // const { loading: queryLoading, error, data } = useQuery(LOGIN_QUERY, {
    //   variables: queryVariables
    // })

  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {

    const initAuth = async (): Promise<void> => {
    // //   //const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
    //setLoading(false)
    const userString = localStorage.getItem('userData')!;
    const user = JSON.parse(userString);

    console.log('user', user);

      if (user) {
        setLoading(false)
        setUser(user);
      }
      //else {
    //     const user = {
    //       id: 1,
    //       role: 'admin',
    //       password: 'admin',
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       username: 'johndoe',
    //       clinicId: '1',
    //       clinicParentId: '1',
    //       token: 'token',
    //       email: ''
    //     };
    //     setUser(user);
    //     setLoading(false);
    //     localStorage.setItem('userData', JSON.stringify(user));
    //   }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const returnUrl = router.query.returnUrl

    // Call graphql login here
    //setQueryVariables({ username: params.username, password: params.password })



    //setUser(user);
    //const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

    //router.replace(redirectURL as string)
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
