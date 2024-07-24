// ** React Imports

import { ReactNode } from "react"
import BlankLayout from "src/@core/layouts/BlankLayout"
import Login from "src/components/login"

const LoginPage = () => {
  return (
    <Login />
  )
}


LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
