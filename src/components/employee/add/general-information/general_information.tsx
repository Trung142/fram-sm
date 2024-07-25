import {
  Button,
  Autocomplete,
  ButtonProps,
  CardContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { TabPanel, TabContext } from '@mui/lab'
import { useEffect, useMemo, useState } from 'react'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { styled } from '@mui/material/styles'
import Acount_Information from './acount_information'
import { useQuery } from '@apollo/client'
import { GET_CLINIC, GET_EXAM_DEFAULT_TYPE, GET_ROLE } from '../graphql/query'
import Branch_Access from './branch_access'
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

type Props = {
  handleaddUser: (key: string, newvalue: any) => void
  input: any
}
type UserType = {
  keySearch: string
  roleId: string
  clinicId: string
}
//thong tin chung
const General_Information = (props: Props) => {
  const { handleaddUser, input } = props
  const [tab2, setTab2] = useState('thongtintaikhoan')

  const handleChange = (event: React.SyntheticEvent, val: any) => {
    setTab2(val)
  }

  //search
  const [searchData, setSearchData] = useState<UserType>({
    keySearch: '',
    roleId: '',
    clinicId: ''
  })
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {}
  })
  // query
  const { data: roledata } = useQuery(GET_ROLE, {
    variables: queryVariables
  })
  //khoa
  const { data: ExamData } = useQuery(GET_EXAM_DEFAULT_TYPE, {
    variables: queryVariables
  })
  //phong kham
  const { data: PlinicData } = useQuery(GET_CLINIC)

  const ExamDefaultType: any = useMemo(() => {
    return ExamData?.getExamDefaultType?.items ?? []
  }, [ExamData])
  console.log(ExamDefaultType)
  const DATAROLE: any = useMemo(() => {
    return roledata?.getRole?.items ?? []
  }, [roledata])
  const DATAClinict: any = useMemo(() => {
    return PlinicData?.getClinic?.items ?? []
  }, [PlinicData])
  console.log(input)
  useEffect(() => {
    const searchUpdate = {
      input: {
        clinicId: {
          contains: input?.clinicId
        }
      }
    }
    setQueryVariables(searchUpdate)
  }, [input])
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Typography>Thông tin chung</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={2.4}>
            <TextField
              fullWidth
              label={
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Họ <span style={{ color: 'red' }}>*</span>
                </Typography>
              }
              placeholder='Nhập Họ'
              InputLabelProps={{ shrink: true }}
              value={input?.lastName}
              onChange={e => {
                handleaddUser('lastName', e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={2.4}>
            <TextField
              fullWidth
              label={
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Tên <span style={{ color: 'red' }}>*</span>
                </Typography>
              }
              InputLabelProps={{ shrink: true }}
              placeholder='Nhập Tên'
              value={input?.fristName}
              onChange={e => handleaddUser('fristName', e.target.value)}
            />
          </Grid>
          <Grid item xs={3.2}>
            <Autocomplete
              autoHighlight
              openOnFocus
              filterSelectedOptions
              options={DATAROLE?.map((option: any) => option.name)}
              onChange={(event, newvalue) => {
                handleaddUser('roleId', DATAROLE?.find((option: any) => option.name === newvalue)?.id)
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      Loại nhân sự<span style={{ color: 'red' }}>*</span>
                    </Typography>
                  }
                  placeholder='Chọn loại nhân sự'
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>Giới tính</Typography>
            <RadioGroup
              row
              name='controlled'
              value={input?.gender}
              onChange={e => handleaddUser('gender', e.target.value)}
            >
              <FormControlLabel value='Nam' control={<Radio />} label='Nam' />
              <FormControlLabel value='Nữ' control={<Radio />} label='Nữ' />
            </RadioGroup>
          </Grid>
          <Grid item xs={2}>
            <Typography>Trạng thái</Typography>
            <FormControlLabel
              control={<Switch />}
              label=''
              value={input?.status}
              checked={input?.status}
              onChange={(e, newvalue) => handleaddUser('status', newvalue)}
            />
          </Grid>
          <Grid item xs={2.5}>
            <TextField
              fullWidth
              label='Số điện thoại'
              InputLabelProps={{ shrink: true }}
              type='number'
              placeholder='Nhập số điện thoại'
              value={input?.phone}
              onChange={e => handleaddUser('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={3.5}>
            <TextField
              fullWidth
              label={
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Email <span style={{ color: 'red' }}>*</span>
                </Typography>
              }
              InputLabelProps={{ shrink: true }}
              type='email'
              placeholder='Nhập Email'
              value={input?.email}
              onChange={e => handleaddUser('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={2.5}>
            <TextField
              fullWidth
              type='date'
              InputLabelProps={{ shrink: true, placeholder: 'Nhập ngày sinh' }}
              label='Ngày sinh'
              placeholder='Nhập ngày sinh'
              // onChange={e => handleaddUser('dateOfBirth', e.target.value)}
            />
          </Grid>
          <Grid item xs={3.5}>
            <TextField
              fullWidth
              label='Địa chỉ'
              placeholder='Nhập địa chỉ'
              InputLabelProps={{ shrink: true }}
              value={input?.address}
              onChange={e => handleaddUser('address', e.target.value)}
            />
          </Grid>
          {/*  */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Chứng chí hành nghề'
              value={input?.practicingCertificate}
              onChange={e => handleaddUser('practicingCertificate', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              id='country-select-demo'
              autoHighlight
              openOnFocus
              filterSelectedOptions
              options={ExamDefaultType?.map((option: any) => option.name)}
              onChange={(event, newvalue) =>
                handleaddUser('examDefaultTypeId', ExamDefaultType?.find((option: any) => option.name === newvalue)?.id)
              }
              renderInput={params => (
                <TextField {...params} label='Khoa' placeholder='Chọn Khoa' InputLabelProps={{ shrink: true }} />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              id='country-select-demo'
              autoHighlight
              openOnFocus
              filterSelectedOptions
              options={['xin chai', 'hello']}
              onChange={(event, newvalue) => handleaddUser('specialistId', newvalue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Chuyên Khoa'
                  placeholder='Chọn Chuyên Khoa'
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: '3rem' }}>
        <TabContext value={tab2}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              aria-label='lab API tabs example'
              sx={{
                '& .MuiTabs-indicator': {
                  color: '#0292B1'
                },
                ml: '0.5rem'
              }}
            >
              <Tab
                value='thongtintaikhoan'
                sx={{
                  border: '1px solid #e0e0e0',
                  mr: '0.5rem',
                  borderRadius: '9px 9px 0 0',
                  ...(tab2 === 'thongtintaikhoan' ? { border: '1px solid #0292B1' } : {})
                }}
                label={
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ...(tab2 === 'thongtintaikhoan' ? { color: '#0292B1' } : {})
                    }}
                  >
                    Thông tin tài khoản
                  </Typography>
                }
              />
              <Tab
                value='truycapchinhanh'
                sx={{
                  border: '1px solid #e0e0e0',
                  mr: '0.5rem',
                  borderRadius: '9px 9px 0 0',
                  ...(tab2 === 'truycapchinhanh' ? { border: '1px solid #0292B1' } : {})
                }}
                label={
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ...(tab2 === 'truycapchinhanh' ? { color: '#0292B1' } : {})
                    }}
                  >
                    Truy cấp chi nhánh
                  </Typography>
                }
              />
              <Tab
                value='truycapkho'
                sx={{
                  border: '1px solid #e0e0e0',
                  mr: '0.5rem',
                  borderRadius: '9px 9px 0 0',
                  ...(tab2 === 'truycapkho' ? { border: '1px solid #0292B1' } : {})
                }}
                label={
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ...(tab2 === 'truycapkho' ? { color: '#0292B1' } : {})
                    }}
                  >
                    Truy cấp kho
                  </Typography>
                }
              />
            </TabList>
          </Box>
          <TabPanel value='thongtintaikhoan'>
            <Acount_Information
              DATAROLE={DATAROLE}
              DATACLinict={DATAClinict}
              handleaddUser={handleaddUser}
              input={input}
            />
          </TabPanel>
          <TabPanel value='truycapchinhanh'>
            <Branch_Access />
          </TabPanel>
          <TabPanel value='truycapkho'>
            <Typography></Typography>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  )
}

export default General_Information
