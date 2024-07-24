// ** React Imports
import { ChangeEvent, ElementType, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Icon from 'src/@core/components/icon'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import {
  Button,
  ButtonProps,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiSelect from 'src/@core/components/mui/select'
import MUIDialog from 'src/@core/components/dialog'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'

// ** GraphQL
import { useMutation, useQuery } from '@apollo/client'
import { ResExamInput } from '../res_exam/graphql/variables'
// import { PatientInput } from './graphql/variables'
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
import { dialogType, data } from 'src/components/examination/res_exam/index'
import TabList from '@mui/lab/TabList'
import { effect, signal } from '@preact/signals'
import ExamInfo from './ExamInfo'
import Service from './Service'
import Medicine from './Medicine'
import ExamSchedule from './ExamSchedule'
import MedicineHistory from './MedicineHistory'
import { useRouter } from 'next/router'
import { GET_RES_EXAM } from './graphql/query'
import { UPDATE_RES_EXAM } from './graphql/mutation'

type Props = {
  id?: string | undefined
}

export const resExamInput = signal<ResExamInput>({})
export const patName = signal('123')

const TabListWrapper = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    borderBottom: '0px solid',
    gap: 10
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    backgroundColor: '#E0E0E0',
    border: 0,
    color: '#32475CDE',
    borderBottom: '0px solid',
    borderRadius: '6px',
    minWidth: '200px',
    '&:hover': {
      color: '#0292B1',
      border: '2px solid #0292B1'
    },
    '&.Mui-selected': {
      backgroundColor: '#fff',
      color: '#0292B1',
      border: '2px solid #0292B1',
      borderRadius: '6px'
    }
  }
}))

const UpdateResExam = (props: Props) => {
  const [resExam, setResExam] = useState<ResExamInput>()
  const router = useRouter()

  console.log(router.query)
  const { tabName } = router.query
  let tabIndex: string
  if (tabName == 'Prescription') {
    tabIndex = '3'
  } else tabIndex = '1'
  const [updateResExam] = useMutation(UPDATE_RES_EXAM)
  const [tab, setTab] = useState('1')
  // const input = resExamInput.value;
  const [input, setInput] = useState<ResExamInput>({})

  // Lấy dữ liệu
  const [queryVariables, setQueryVariables] = useState<any>({
    skip: 0,
    take: 10,
    input: {
      id: props.id ? { eq: props.id } : undefined
    }
  })

  const {
    data: queryData,
    loading,
    error,
    refetch
  } = useQuery(GET_RES_EXAM, {
    variables: queryVariables
  })

  useEffect(() => {
    const data = queryData?.getResExam?.items[0]
    if (data) {
      resExamInput.value = data
      patName.value = data.patName ?? ''
      setResExam(data)
    }
  }, [queryData])

  useEffect(() => {
    resExamInput.subscribe(value => {
      setInput(value)
    })
  }, [])
  const onCompleted = useCallback(() => {
    toast.success('Đơn khám bệnh đã được hoàn thành')
  }, [])
  const completeResExam = async () => {
    await updateResExam({
      variables: {
        input: JSON.stringify({
          id: input.id,
          status: '106'
        })
      },
      onCompleted: async () => {
        await refetch()
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader
          title={<Typography variant='h4'>Khám bệnh / {input.patName}</Typography>}
          action={
            <>
              <Button
                variant='contained'
                color='primary'
                sx={{ pl: 5, pr: 8 }}
                onClick={() => router.push('/examination/examination-list')}
              >
                <Icon icon='bx:chevron-left' fontSize={20} style={{ marginRight: 5 }} />
                Quay lại
              </Button>
              {input?.status !== '106' && (
                <Button
                  variant='contained'
                  color='success'
                  sx={{ pl: 4, pr: 8, marginLeft: '5px' }}
                  onClick={() => completeResExam()}
                >
                  <Icon icon='mdi:success' fontSize={20} style={{ marginRight: 7 }} />
                  Hoàn Thành
                </Button>
              )}
            </>
          }
        />
        <CardContent>
          <TabContext value={tab}>
            {/* <Grid container display='flex' flexDirection='row' > */}
            <Box sx={{ display: 'flex' }}>
              <TabListWrapper onChange={(e, newValue) => setTab(newValue)}>
                <Tab value='1' label='Thông tin khám' />
                <Tab value='2' label='Dịch vụ' />
                <Tab value='3' label='Đơn thuốc' />
                <Tab value='4' label='Lịch khám bệnh' />
                <Tab value='5' label='Lịch sử thuốc' />
              </TabListWrapper>
            </Box>

            <Paper>
              <TabPanel value='1'>{resExam && <ExamInfo input={resExam} />}</TabPanel>
              <TabPanel value='2' style={{ padding: 0 }}>
                <Paper style={{ backgroundColor: '#D9D9D9', padding: 15, marginTop: 10 }}>
                  {/* <span style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 20, color: '#000' }}>Dịch vụ chỉ định</span> */}
                  <Typography variant='h5' sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Dịch vụ chỉ định
                  </Typography>
                </Paper>
                <div style={{ padding: 25 }}>
                  <Service />
                </div>
              </TabPanel>
              <TabPanel value='3' style={{ padding: 0 }}>
                <Paper style={{ backgroundColor: '#D9D9D9', padding: 15, marginTop: 10 }}>
                  {/* <span style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 20, color: '#000' }}>Thông tin thuốc / Vật tư</span> */}
                  <Typography variant='h5' sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Thông tin thuốc / Vật tư
                  </Typography>
                </Paper>
                <div style={{ padding: 25 }}>
                  <Medicine />
                </div>
              </TabPanel>
              <TabPanel value='4'>
                <ExamSchedule />
              </TabPanel>
              <TabPanel value='5'>
                <MedicineHistory />
              </TabPanel>
            </Paper>
            {/* </Grid> */}
          </TabContext>
        </CardContent>
      </Card>
    </>
  )
}

export default UpdateResExam
