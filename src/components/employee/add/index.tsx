// ** React Imports
import { ChangeEvent, ElementType, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Icon from 'src/@core/components/icon'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SaveSharpIcon from '@mui/icons-material/SaveSharp'
import ReplySharpIcon from '@mui/icons-material/ReplySharp'
import {
  Button,
  Autocomplete,
  ButtonProps,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  backdropClasses,
  Input
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiSelect from 'src/@core/components/mui/select'
import MUIDialog from 'src/@core/components/dialog'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'

// ** GraphQL
// import { useMutation, useQuery } from '@apollo/client'
//import { PatientInput } from './graphql/variables'
// import { ADD_PATIENT, UPDATE_PATIENT } from './graphql/mutation'
// import { GET_SEARCH_DATA } from './graphql/query'

// ** Custom Components Imports
import EthnicDialog from 'src/components/dialog/ethnic'
import JobDialog from 'src/components/dialog/job'
import PatientGroupDialog from 'src/components/dialog/patient-group'
import PatientTypeDialog from 'src/components/dialog/patient-type'
import OldPlaceTreatmentDialog from 'src/components/dialog/place-treatment'
import toast from 'react-hot-toast'
import moment from 'moment'
import axios from 'axios'
import { GetID } from 'src/hooks/usePrefix'
import { border } from '@mui/system'
import { useRouter } from 'next/navigation'
import Job_Information from './job_information'
import Economic_Information from './economic_information'
import Other_Information from './other_information'
import General_Information from './general-information/general_information'
import { AddEmployeeVariables, AddUserRole } from './graphql/variables'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_USER, ADD_USER_ROLE } from './graphql/mutation'
import { number } from 'yup'
import { add } from 'date-fns'
import { set } from 'nprogress'

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  minHeight: 40,
  marginRight: theme.spacing(4),
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    alignItems: 'flex-start',
    minHeight: 40,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5)
  }
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

// ** Vars

const AddEmployee = (props: any) => {
  const { data } = props
  //hook
  const router = useRouter()
  const [tab, setTab] = useState('thongtinchung')
  const [userData, setuserData] = useState({})
  //DATA
  const [input, setInput] = useState<AddEmployeeVariables>({
    ...data,
    index: undefined,
    __typename: 'User'
  })
  const [inputRole, setinputRole] = useState<AddUserRole>({
    ...data,
    index: undefined,
    __typename: 'UserRole'
  })
  //onchange
  const handleaddUser = (key: string, newvalue: any) => {
    const newInput = { ...input, [key]: newvalue }
    setInput(newInput)
    setuserData(newInput)
    setinputRole(newInput)
  }
  //update
  const [AddEmloyeedata, { data: addData, error: error, loading: loading }] = useMutation(ADD_USER)
  const [AddUserRoledata] = useMutation(ADD_USER_ROLE)
  //submmmit
  const onError = useCallback(() => {
    toast.error('loi 500 vui long thu lai')
  }, [])
  const onCompleted = useCallback(() => {
    toast.success('Them thanh cong!')
  }, [])

  //randomid
  function getRandomInt(length: number, characters: string) {
    let result = ''
    const character = characters
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
  }
  const handlesubmmit = useCallback(() => {
    if (input?.fristName && input?.lastName && input?.email && input?.password) {
      console.log(inputRole)
      const id = `doc${getRandomInt(15, '202311160000012')}`
      const update = { ...input }
      let UpdateRole = { ...inputRole }
      const update2 = {
        fristName: update?.fristName,
        lastName: update?.lastName,
        email: update?.email,
        address: update?.address,
        gender: update?.gender,
        clinicId: update?.clinicId,
        password: update?.password,
        userCccd: update?.userCccd,
        userVneid: update?.userCccd,
        phone: update?.phone,
        status: update?.status,
        userName: `${update?.lastName} ${update?.fristName}`,
        id: id
      }
      if (inputRole) {
        const userRoleId = `usr${getRandomInt(15, '202311160000012')}`
        UpdateRole = {
          roleId: inputRole?.roleId,
          id: userRoleId,
          userId: id,
          parentClinicId: inputRole?.clinicId,
          clinicId: inputRole?.clinicId
        }
      }
      console.log('check', UpdateRole)
      if (id) {
        if (update2?.userVneid) {
          AddEmloyeedata({ variables: { input: update2 }, onError, onCompleted })
          if (inputRole) {
            AddUserRoledata({ variables: { input: UpdateRole }, onError, onCompleted })
          }
        } else {
          toast.error('Vui long nhap cccd vne')
        }
      } else {
        toast.error('errr id')
      }
    } else {
      toast.error('Vui long nhap day du thong tin')
    }
  }, [AddEmloyeedata, input, inputRole])
  return (
    <Grid container sx={{ height: '100%' }}>
      <Card sx={{ width: '100%', height: '100%' }}>
        <CardHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Nhân viên /</span>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Thêm mới nhân viên
              </Typography>
            </div>
          }
          action={
            <Box sx={{ display: 'flex' }}>
              <Box>
                <Button
                  color='primary'
                  variant='contained'
                  sx={{ width: 172, height: 42, ml: 2 }}
                  onClick={() => handlesubmmit()}
                >
                  <SaveSharpIcon sx={{ mr: 1 }} />
                  LƯU
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Button
                  variant='outlined'
                  sx={{ backgroundColor: 'white', borderTopRightRadius: 0, width: 172, height: 42, ml: 2 }}
                  onClick={() => router.push('/system/employee')}
                >
                  <ReplySharpIcon sx={{ mr: 1 }} />
                  QUAY LẠI
                </Button>
              </Box>
            </Box>
          }
        />
        <TabContext value={tab}>
          <Grid container display='flex' flexDirection='row'>
            <Grid item xs={4} display='flex' flexDirection='column' minWidth={260} sx={{ width: '100%' }}>
              <Box
                sx={{
                  p: 5,
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
              >
                <ButtonStyled component='label' htmlFor='account-settings-upload-image' sx={{ padding: 0 }}>
                  <img
                    alt='avatar'
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover'
                      // borderRadius: '50%',
                    }}
                  />
                  <input hidden type='file' accept='image/png, image/jpeg' id='account-settings-upload-image' />
                </ButtonStyled>
                <Typography sx={{ mt: 2, color: 'text.disabled' }}>Bấm vào ảnh để thay đổi</Typography>
                <Box sx={{ pt: 10, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h6'>Mã nhân viên :</Typography>
                    <span>m01</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h6'>E-mail :</Typography>
                    <span>m01</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h6'>Số điện thoại :</Typography>
                    <span>m01</span>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', pt: 10, width: '100%' }}>
                <TabList
                  orientation='vertical'
                  onChange={(e, newValue) => setTab(newValue)}
                  centered={false}
                  sx={{ width: '100%', borderBottom: '1px solid #E5E5E5', p: 0 }}
                >
                  <Tab
                    value='thongtinchung'
                    label='Thông tin chung'
                    sx={{ width: '100%', borderBottom: '1px solid #E5E5E5' }}
                  />
                  <Tab
                    value='thongtincongviec'
                    label='Thông tin công việc'
                    sx={{ width: '100%', borderBottom: '1px solid #E5E5E5' }}
                  />
                  <Tab
                    value='thongtintaichinh'
                    label='Thông tin tài chính'
                    sx={{ width: '100%', borderBottom: '1px solid #E5E5E5' }}
                  />
                  <Tab
                    value='thongtinkhac'
                    label='Thông tin khác'
                    sx={{ width: '100%', borderBottom: '1px solid #E5E5E5' }}
                  />
                </TabList>
              </Box>
            </Grid>
            <Grid item flex={1} xs={8}>
              <TabPanel value='thongtinchung'>
                <General_Information handleaddUser={handleaddUser} input={userData} />
              </TabPanel>
              <TabPanel value='thongtincongviec'>
                <Job_Information handleaddUser={handleaddUser} input={userData} />
              </TabPanel>
              <TabPanel value='thongtintaichinh'>
                <Economic_Information />
              </TabPanel>
              <TabPanel value='thongtinkhac'>
                <Other_Information />
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Card>
    </Grid>
  )
}

AddEmployee.defaultProps = {
  type: 'add'
}

export default AddEmployee
