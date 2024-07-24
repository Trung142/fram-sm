// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
// import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
// import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styles
// import './index.module.scss'
import styles from './index.module.scss'
import { gql, useLazyQuery } from '@apollo/client'

// ** Styled Components
const LoginIllustration = styled('img')({
  height: '100%',
  width: '100%',
  maxWidth: '100%',
  objectFit: 'cover'
})

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('lg')]: {
    maxWidth: 480
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 635
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(12)
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  username: yup.string().min(3).required(),
  password: yup.string().min(3).required()
})

const defaultValues = {
  username: '',
  password: ''
}

interface FormData {
  username: string
  password: string
}

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      userId
      userName
      isParentClinic
      parentClinicId
      parentClinicName
      clinicId
      clinicName
      phone
      address
      firstName
      lastName
      token
    }
  }
`

const Login = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()

  // const bgColors: UseBgColorType = useBgColor()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  // ** Var
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const [queryVariables, setQueryVariables] = useState({ username: '', password: '' })
  const [fetchData, { loading: queryLoading, error, data }] = useLazyQuery(LOGIN_QUERY, {
    variables: queryVariables,
    onCompleted: data => {
      console.log('data', data)
      const loginData = data.login
      if (loginData) {
        const user = {
          id: loginData.userId,
          role: 'admin',
          firstName: loginData.firstName,
          lastName: loginData.lastName,
          username: loginData.userName,
          clinicId: loginData.clinicId,
          parentClinicId: loginData.parentClinicId,
          isParentClinic: loginData.isParentClinic,
          phone: loginData.phone,
          address: loginData.address,
          email: loginData.email,
          token: loginData.token
        }

        localStorage.setItem('userData', JSON.stringify(user))
        localStorage.setItem('token', user.token)
        auth.setUser(user)
        auth.setLoading(false)

        // redirect to home page
        window.location.href = '/'
      }
    },
    onError: error => {
      setError('username', {
        type: 'manual',
        message: 'Username or Password is invalid'
      })
      setError('password', {
        type: 'manual',
        message: 'Username or Password is invalid'
      })
    }
  })

  const onSubmit = (data: FormData) => {
    const { username, password } = data
    fetchData({ variables: { username: username, password: password } })

    // auth.login({ username, password, rememberMe }, () => {
    //   setError('username', {
    //     type: 'manual',
    //     message: 'Username or Password is invalid'
    //   })
    // })
  }

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginIllustration alt='login-illustration' src={`/images/pages/login_bg.png`} />
        </Box>
      ) : null}
      <RightWrapper
        sx={{ ...(skin === 'bordered' && !hidden && { borderLeft: `1px solid ${theme.palette.divider}` }) }}
      >
        <Box sx={{ mx: 'auto', maxWidth: 400 }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center' }}>
            <div className={styles.label}>
              <div className={styles.flexcontainer}>
                <p className={styles.text}>
                  <span className={styles.textWrapper}>
                    PHẦN MỀM QUẢN LÝ <br />
                  </span>
                </p>
                <p className={styles.text}>
                  <span className={styles.textWrapper}>PHÒNG KHÁM CLINIC</span>
                </p>
              </div>
            </div>
          </Box>
          <Typography variant='h6' sx={{ mb: 1.5 }}>
            Đăng nhập 🚀
          </Typography>
          {/* <Typography sx={{ mb: 6, color: 'text.secondary' }}>
            Please sign-in to your account and start the adventure
          </Typography> */}
          {/* <Alert icon={false} sx={{ py: 3, mb: 6, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
            <Typography variant='caption' sx={{ mb: 2, display: 'block', color: 'primary.main' }}>
              Admin: <strong>admin@sneat.com</strong> / Pass: <strong>admin</strong>
            </Typography>
            <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
              Client: <strong>client@sneat.com</strong> / Pass: <strong>client</strong>
            </Typography>
          </Alert> */}
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Tên đăng nhập'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.username)}
                    placeholder='admin@sneat.com'
                  />
                )}
              />
              {errors.username && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                Mật khẩu
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Mật khẩu'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon fontSize={20} icon={showPassword ? 'bx:show' : 'bx:hide'} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                label='Lưu thông tin đăng nhập'
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: 'text.secondary' } }}
                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
              />
              <LinkStyled href='/forgot-password'>Quên mật khẩu?</LinkStyled>
            </Box>
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
              Sign in
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2 }}>
                Bạn chưa có tai khoản?
              </Typography>
              <Typography>
                <LinkStyled href='/register'>Tạo tài khoản</LinkStyled>
              </Typography>
            </Box>
            <Divider sx={{ my: `${theme.spacing(6)} !important` }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#497ce2' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <Icon icon='bxl:facebook-circle' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#1da1f2' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <Icon icon='bxl:twitter' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                sx={{ color: theme.palette.mode === 'light' ? '#272727' : 'grey.300' }}
              >
                <Icon icon='bxl:github' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#db4437' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <Icon icon='bxl:google' />
              </IconButton>
            </Box>
          </form>
        </Box>
      </RightWrapper>
    </Box>
  )
}

export default Login
