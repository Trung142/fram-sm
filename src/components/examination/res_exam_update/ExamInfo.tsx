import {
  Grid2Props,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Autocomplete,
  Button,
  createFilterOptions,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import { resExamInput } from './index'
import { Box, Stack, padding } from '@mui/system'
import MuiSelect from 'src/@core/components/mui/select'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Icd } from './graphql/variables'
import moment from 'moment'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { GET_EXAM_RESULT, GET_EXAM_TYPE, GET_ICD } from './graphql/query'
import { ADD_DIAGNOSTICS, UPDATE_DIAGNOSTICS, UPDATE_RES_EXAM } from './graphql/mutation'
import toast from 'react-hot-toast'
import { ResExamInput } from '../res_exam/graphql/variables'
import InputICDSearch from 'src/components/inputSearch/InputICDSearch'
import useDebounce from 'src/hooks/useDebounce'

const CustomGrid = styled(Grid)<Grid2Props>(({ theme }) => ({
  '& .MuiGrid-item': {
    borderLeft: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    borderTop: '1px solid #e0e0e0'
  }
}))

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#fff',
    borderRadius: 4,
    '& input': {
      padding: '15px 14px',
      borderBottom: 'none'
    },
    '& .MuiFilledInput-underline:before': {
      display: 'none'
    },
    '& .MuiFilledInput-underline:after': {
      display: 'none'
    }
  }
}))

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#32475C05',
  width: '120px',
  minWidth: '120px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #e0e0e0'
  // borderBottom: '1px solid #e0e0e0',
}))

interface Prop {
  input: ResExamInput
}
const ExamInfo = ({ input }: Prop) => {
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [dataICD, setDataICD] = useState<Icd[]>([])
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const client = useApolloClient()
  const [isScrollBottom, setIsScrollBottom] = useState(false)
  const [resExam, setResExam] = useState<ResExamInput>({
    ...input
  })
  const {
    data: GetIcd,
    refetch: refetch,
    loading: icdLoading
  } = useQuery(GET_ICD, {
    variables: {
      input: { or: [{ id: { contains: debouncedSearchValue } }, { name: { contains: debouncedSearchValue } }] }
    }
  })

  useEffect(() => {
    setDataICD(GetIcd?.getIcd?.items ?? [])
  }, [GetIcd])

  useEffect(() => {
    hanldStroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollBottom])

  const handleOnChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
  }

  const nearBottom = (target: any) => {
    const diff = Math.round((target.scrollHeight || 0) - (target.scrollTop || 0))
    return diff - 25 <= (target.clientHeight || 0)
  }

  const hanldStroll = async () => {
    if (GetIcd?.getIcd?.totalCount <= take || GetIcd?.getIcd?.totalCount <= skip) {
      return
    }
    if (isScrollBottom) {
      if (GetIcd?.getIcd?.pageInfo?.hasNextPage) {
        const newSkip = skip + 25
        const newTake = take + 25
        const result = await client.query({
          query: GET_ICD,
          variables: {
            skip: newSkip,
            take: newTake
          }
        })
        const data = result?.data?.getIcd?.items ?? []
        setDataICD(e => [...e, ...data])
        setSkip(newSkip)
      }
      return
    }
  }
  const handleBlur = async () => {
    await refetch({ input: {}, skip: 0, take: 25 })
    setSkip(0)
    setTake(25)
  }
  // const [diagnose, setDiagnose] = useState<string>()
  useEffect(() => {
    if (resExam.height && resExam.weight) {
      const bmi = resExam.weight / Math.pow(resExam.height / 100, 2)

      setResExam({ ...resExam, bmi })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resExam.height, resExam.weight])

  const [getIcdVariable, setGetIcdVariable] = useState<any>({
    input: ''
  })

  const [search, setSearch] = useState<any>('')

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: any) => option.name
  })
  const {
    data: examResultList,
    loading: examResultLoading,
    error: examResultError,
    refetch: examResultRefetch
  } = useQuery(GET_EXAM_RESULT)
  const examResult = useMemo(() => {
    return examResultList?.getExamResult?.items ?? []
  }, [examResultList])

  const {
    data: examTypeList,
    loading: examTypeLoading,
    error: examTypeError,
    refetch: examTypeRefetch
  } = useQuery(GET_EXAM_TYPE)
  const examType = useMemo(() => {
    return examTypeList?.getExaminationType?.items ?? []
  }, [examTypeList])

  const doctorName = useMemo(() => {
    return (resExam?.doctor?.fristName ?? '') + ' ' + (resExam?.doctor?.lastName ?? '')
  }, [resExam])

  const [addDiagnostic] = useMutation(ADD_DIAGNOSTICS)
  const [updateDiagnostic] = useMutation(UPDATE_DIAGNOSTICS)
  const [updateResExam] = useMutation(UPDATE_RES_EXAM)

  const handleSetDiagnose = (icdSelect: Icd | null, index: number) => {
    let diagnose = ``
    if (resExam?.diagnostic?.idCode1 || index === 1) {
      const icd1 = index === 1 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode1)
      if (icd1?.id && icd1?.name) {
        diagnose += `[${icd1?.id}] ${icd1?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode2 || index === 2) {
      const icd2 = index === 2 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode2)
      if (icd2?.id && icd2?.name) {
        diagnose += `\n[${icd2?.id}] ${icd2?.name}`
      } else {
        diagnose += ''
      }
    }

    if (resExam?.diagnostic?.idCode3 || index === 3) {
      const icd3 = index === 3 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode3)
      if (icd3?.id && icd3?.name) {
        diagnose += `\n[${icd3?.id}] ${icd3?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode4 || index === 4) {
      const icd4 = index === 4 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode4)
      if (icd4?.id && icd4?.name) {
        diagnose += `\n[${icd4?.id}] ${icd4?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode5 || index === 5) {
      const icd5 = index === 5 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode5)
      if (icd5?.id && icd5?.name) {
        diagnose += `\n[${icd5?.id}] ${icd5?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode6 || index === 6) {
      const icd6 = index === 6 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode6)
      if (icd6?.id && icd6?.name) {
        diagnose += `\n[${icd6?.id}] ${icd6?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode7 || index === 7) {
      const icd7 = index === 7 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode7)
      if (icd7?.id && icd7?.name) {
        diagnose += `\n[${icd7?.id}] ${icd7?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode8 || index === 8) {
      const icd8 = index === 8 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode8)
      if (icd8?.id && icd8?.name) {
        diagnose += `\n[${icd8?.id}] ${icd8?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode9 || index === 9) {
      const icd9 = index === 9 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode9)
      if (icd9?.id && icd9?.name) {
        diagnose += `\n[${icd9?.id}] ${icd9?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode10 || index === 10) {
      const icd10 = index === 10 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode10)
      if (icd10?.id && icd10?.name) {
        diagnose += `\n[${icd10?.id}] ${icd10?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode11 || index === 11) {
      const icd11 = index === 11 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode11)
      if (icd11?.id && icd11?.name) {
        diagnose += `\n[${icd11?.id}] ${icd11?.name}`
      } else {
        diagnose += ''
      }
    }
    if (resExam?.diagnostic?.idCode12 || index === 12) {
      const icd12 = index === 12 ? icdSelect : dataICD.find(i => i.id === resExam?.diagnostic?.idCode12)
      if (icd12?.id && icd12?.name) {
        diagnose += `\n[${icd12?.id}] ${icd12?.name}`
      } else {
        diagnose += ''
      }
    }
    const dataDiagnostic = {
      ...resExam,
      diagnostic: {
        ...resExam.diagnostic,
        diagnose: diagnose,
        idCode1: index === 1 ? icdSelect?.id : resExam?.diagnostic?.idCode1,
        idCode2: index === 2 ? icdSelect?.id : resExam?.diagnostic?.idCode2,
        idCode3: index === 3 ? icdSelect?.id : resExam?.diagnostic?.idCode3,
        idCode4: index === 4 ? icdSelect?.id : resExam?.diagnostic?.idCode4,
        idCode5: index === 5 ? icdSelect?.id : resExam?.diagnostic?.idCode5,
        idCode6: index === 6 ? icdSelect?.id : resExam?.diagnostic?.idCode6,
        idCode7: index === 7 ? icdSelect?.id : resExam?.diagnostic?.idCode7,
        idCode8: index === 8 ? icdSelect?.id : resExam?.diagnostic?.idCode8,
        idCode9: index === 9 ? icdSelect?.id : resExam?.diagnostic?.idCode9,
        idCode10: index === 10 ? icdSelect?.id : resExam?.diagnostic?.idCode10,
        idCode11: index === 11 ? icdSelect?.id : resExam?.diagnostic?.idCode11,
        idCode12: index === 12 ? icdSelect?.id : resExam?.diagnostic?.idCode12
      }
    }

    setResExam(dataDiagnostic)
  }

  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật Phiếm Khám bệnh')
  }, [])

  const onCompleted = useCallback(() => {
    toast.success('Cập nhập phiếu khám bệnh thành công')
  }, [])

  const dateReExamString = resExam?.diagnostic?.dateReExam
  const dateReExam = dateReExamString ? new Date(dateReExamString) : new Date()

  const submit = async () => {
    if (resExam) {
      const dataAdd = {
        ...resExam.diagnostic,
        resExamId: resExam.id
      }
      const dataUpdateDiagnostic = {
        id: resExam.diagnosticId,
        idCode1: resExam.diagnostic?.idCode1 || '',
        idCode2: resExam.diagnostic?.idCode2 || '',
        idCode3: resExam.diagnostic?.idCode3 || '',
        idCode4: resExam.diagnostic?.idCode4 || '',
        idCode11: resExam.diagnostic?.idCode5 || '',
        clsSummary: resExam.diagnostic?.clsSummary || '',
        diagnose: resExam.diagnostic?.diagnose || '',
        treatments: resExam.diagnostic?.treatments || '',
        examResultsId: resExam.diagnostic?.examResultsId || '',
        examTypeId: resExam.diagnostic?.examTypeId || '',
        advice: resExam.diagnostic?.advice || '',
        checkAgainLater: resExam.diagnostic?.checkAgainLater || '',
        dateReExam: resExam.diagnostic?.dateReExam || new Date(),
        diseaseProgression: resExam.diagnostic?.diseaseProgression || ''
      }

      const dataUpdateResExam = {
        id: resExam.id,
        paulse: resExam.paulse,
        breathingRate: resExam.breathingRate,
        temperature: resExam.temperature,
        bp1: resExam.bp1,
        bp2: resExam.bp2,
        weight: resExam.weight,
        height: resExam.height,
        bmi: resExam.bmi,
        reasonExam: resExam.reasonExam,
        personalMedHistory: resExam.personalMedHistory,
        familyMedHistory: resExam.familyMedHistory,
        personalAllergicHistory: resExam.personalAllergicHistory,
        otherDisease: resExam.otherDisease,
        medHistory: resExam.medHistory,
        body: resExam.body,
        part: resExam.part
      }
      if (!resExam.diagnosticId) {
        await addDiagnostic({
          variables: {
            input: dataAdd
          }
        }).then((res: any) => {
          updateResExam({
            variables: {
              input: JSON.stringify({
                id: resExam.id,
                diagnosticId: res.data.addDiagnostic.id
              })
            },
            onError
          })
        })
        console.log(dataUpdateDiagnostic)
      } else {
        await updateDiagnostic({
          variables: {
            input: JSON.stringify(dataUpdateDiagnostic)
          },
          onError
        })
      }
      if (input.status === '102') {
        await updateResExam({
          variables: {
            input: JSON.stringify({
              id: resExam.id,
              status: '104'
            })
          },
          onError
        })
      }
      await updateResExam({
        variables: {
          input: JSON.stringify(dataUpdateResExam)
        },
        onError,
        onCompleted
      })
    }
  }
  const handleSearch = () => {
    if (searchValue.trim() !== '') {
      setSearchValue(searchValue)
    }
  }
  const handleIcdChange = (searchValue: any, number: number) => {
    handleSetDiagnose(searchValue, number)
    setSearch(searchValue)
  }

  return (
    <>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <Typography sx={{ paddingLeft: 5, fontWeight: 'bold' }} variant='subtitle1'>
            {resExam?.patName}
          </Typography>
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Mạch
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='lần/phút'
            type='number'
            variant='filled'
            fullWidth
            defaultValue={resExam?.paulse}
            onChange={e => setResExam({ ...resExam, paulse: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={4.8} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Huyết áp
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='mmhg'
            type='number'
            variant='filled'
            fullWidth
            defaultValue={resExam?.bp1}
            onChange={e => setResExam({ ...resExam, bp1: Number(e.target.value) })}
          />
          /
          <CustomTextField
            placeholder='mmhg'
            type='number'
            variant='filled'
            fullWidth
            defaultValue={resExam?.bp2}
            onChange={e => setResExam({ ...resExam, bp2: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Lý do
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='Nhập lý do'
            variant='filled'
            fullWidth
            defaultValue={resExam?.reasonExam}
            onChange={e => setResExam({ ...resExam, reasonExam: e.target.value })}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Giới tính
            </Typography>
          </CustomBox>
          <Box sx={{ flex: 1, paddingTop: 3, paddingBottom: 3 }}>
            <Typography sx={{ paddingLeft: 5, fontWeight: 'bold', flex: 1 }} variant='subtitle1'>
              {resExam?.gender === 1 ? 'Nam' : resExam?.gender === 2 ? 'Nữ' : 'Không xác định'}
            </Typography>
          </Box>
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Nhịp thở
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='lần/phút'
            variant='filled'
            type='number'
            fullWidth
            sx={{ width: '100%' }}
            defaultValue={resExam?.breathingRate}
            onChange={e => setResExam({ ...resExam, breathingRate: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Chiều cao
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='cm'
            variant='filled'
            type='number'
            fullWidth
            defaultValue={resExam?.height}
            onChange={e => setResExam({ ...resExam, height: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Cân nặng
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='kg'
            variant='filled'
            type='number'
            fullWidth
            defaultValue={resExam?.weight}
            onChange={e => setResExam({ ...resExam, weight: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Phiếu khám
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='Nhập phiếu khám'
            variant='filled'
            fullWidth
            // disabled
            value={resExam.id}
            // onChange={e => setResExam({ ...resExam, resExamId: e.target.value })}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ngày sinh
            </Typography>
          </CustomBox>
          <Box sx={{ flex: 1, paddingTop: 3, paddingBottom: 3 }}>
            <Typography sx={{ paddingLeft: 5, fontWeight: 'bold', flex: 1 }} variant='subtitle1'>
              {moment(resExam?.dob).format('DD/MM/YYYY')}
            </Typography>
          </Box>
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Nhiệt độ
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='Nhập nhiệt độ'
            variant='filled'
            fullWidth
            defaultValue={resExam?.temperature}
            type='number'
            onChange={e => setResExam({ ...resExam, temperature: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={4.8} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              BMI
            </Typography>
          </CustomBox>
          <CustomTextField
            placeholder='Nhập BMI'
            variant='filled'
            fullWidth
            value={resExam.bmi}
            type='number'
            onChange={e => setResExam({ ...resExam, bmi: Number(e.target.value) })}
          />
        </CustomGrid>
        <CustomGrid item xs={2.4} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Bác sĩ
            </Typography>
          </CustomBox>
          <Box sx={{ flex: 1, paddingTop: 3, paddingBottom: 3 }}>
            <Typography sx={{ paddingLeft: 5, fontWeight: 'bold', flex: 1 }} variant='subtitle1'>
              {doctorName}
            </Typography>
          </Box>
        </CustomGrid>
      </CustomGrid>

      <Grid container display='flex' flexDirection='row' mt={5} spacing={3}>
        <Grid item xs={3}>
          <TextField
            label='Tiểu sử bản thân'
            placeholder='Nhập thông tin tiểu sử bản thân'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.personalMedHistory}
            onChange={e => setResExam({ ...resExam, personalMedHistory: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Tiểu sử gia đình'
            placeholder='Nhập thông tin tiểu sử gia đình'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.familyMedHistory}
            onChange={e => setResExam({ ...resExam, familyMedHistory: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Tiền sử dị ứng'
            placeholder='Nhập thông tin tiền sử dị ứng'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.personalAllergicHistory}
            onChange={e => setResExam({ ...resExam, personalAllergicHistory: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Vấn đề khác'
            placeholder='Nhập thông tin vấn đề khác'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.otherDisease}
            onChange={e => setResExam({ ...resExam, otherDisease: e.target.value })}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            label='Bệnh sử'
            placeholder='Nhập thông tin bệnh sử'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.medHistory}
            onChange={e => setResExam({ ...resExam, medHistory: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Toàn thân'
            placeholder='Nhập thông tin toàn thân'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.body}
            onChange={e => setResExam({ ...resExam, body: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Bộ phận'
            placeholder='Nhập thông tin Bộ phận'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.part}
            onChange={e => setResExam({ ...resExam, part: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Chẩn đoán ban đầu'
            placeholder='Nhập thông tin chẩn đoán ban đầu'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            defaultValue={resExam?.medHistory}
            onChange={e => setResExam({ ...resExam, medHistory: e.target.value })}
          />
        </Grid>
      </Grid>

      <Grid container display='flex' flexDirection='row' mt={3} spacing={3}>
        <Grid item xs={6}>
          <Grid container display='flex' flexDirection='row' spacing={3}>
            <Grid
              container
              display='flex'
              flexDirection='row'
              spacing={3}
              style={{ height: 350, overflowY: 'scroll', padding: 10 }}
            >
              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 1'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode1 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode1}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode1) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 1)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 2'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode2 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode2}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode2) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 2)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 3'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode3 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode3}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode3) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 3)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 4'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode4 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode4}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode4) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 4)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 5'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode5 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode5}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode5) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 5)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 6'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode6 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode6}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode6) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 6)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 7'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode7 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode7}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode7) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 7)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 8'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode8 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode8}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode8) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 8)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 9'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode9 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode9}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode9) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 9)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 10'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode10 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode10}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode10) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 10)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 11'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode11 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode11}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode11) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 11)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  label='Mã ICD - 12'
                  placeholder=''
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={resExam.diagnostic?.idCode12 || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  options={dataICD}
                  sx={{ width: '100%' }}
                  getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
                  isOptionEqualToValue={(option, value) => option.id === resExam?.diagnostic?.idCode12}
                  value={dataICD.find((i: any) => i.id === resExam?.diagnostic?.idCode12) ?? null}
                  onChange={(e: any, newValue: Icd | null) => {
                    handleIcdChange(newValue, 12)
                  }}
                  onBlur={handleBlur}
                  ListboxProps={{
                    onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
                  }}
                  loading={icdLoading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                      onChange={handleOnChange}
                      label='Mã bệnh ICD'
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Diễn biến bệnh'
                placeholder='Nhập diễn biến bệnh'
                variant='outlined'
                fullWidth
                multiline
                rows={5}
                InputLabelProps={{ shrink: true }}
                defaultValue={resExam.diagnostic?.diseaseProgression}
                onChange={e =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      diseaseProgression: e.target.value
                    }
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid container display='flex' flexDirection='row' spacing={5}>
            <Grid item xs={6}>
              <TextField
                label='Tóm tắt CLS'
                placeholder='Nhập thông tin tóm tắt CLS'
                variant='outlined'
                fullWidth
                multiline
                rows={5}
                InputLabelProps={{ shrink: true }}
                defaultValue={resExam?.diagnostic?.clsSummary}
                style={{ resize: 'vertical' }}
                onBlur={e =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      clsSummary: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Chuẩn đoán'
                placeholder='Nhập thông tin chuẩn đoán'
                variant='outlined'
                fullWidth
                multiline
                rows={5}
                InputLabelProps={{ shrink: true }}
                value={resExam?.diagnostic?.diagnose}
                onChange={e =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      diagnose: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Phương pháp điều trị'
                placeholder='Điều trị theo phương pháp'
                variant='outlined'
                fullWidth
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                defaultValue={resExam.diagnostic?.treatments}
                onChange={e =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      treatments: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <MuiSelect
                label='Kết quả khám'
                placeholder='Chọn kết quả khám'
                variant='outlined'
                fullWidth
                shrink
                value={resExam.diagnostic?.examResultsId || ''}
                onChange={(e: any) =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      examResultsId: e.target.value
                    }
                  })
                }
                data={examResult.map((i: any) => ({ id: i.id, label: i.name }))}
              />
            </Grid>
            <Grid item xs={6}>
              <MuiSelect
                label='Loại hình khám'
                placeholder='Chọn loại hình khám'
                variant='outlined'
                fullWidth
                shrink
                value={resExam.diagnostic?.examTypeId}
                onChange={(e: any) =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      examTypeId: e.target.value
                    }
                  })
                }
                data={examType.map((i: any) => ({ id: i.id, label: i.name }))}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label='Lời dặn'
                placeholder='Nhập lời dặn'
                variant='outlined'
                fullWidth
                multiline
                rows={4}
                InputLabelProps={{ shrink: true }}
                defaultValue={resExam?.diagnostic?.advice}
                onBlur={e =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      advice: e.target.value
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label='Khám lại sau'
                placeholder=''
                variant='outlined'
                fullWidth
                type='number'
                InputLabelProps={{ shrink: true }}
                defaultValue={resExam?.diagnostic?.checkAgainLater}
                onBlur={e =>
                  setResExam({
                    ...resExam,
                    diagnostic: {
                      ...resExam.diagnostic,
                      checkAgainLater: Number(e.target.value)
                    }
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                {/* <ReactDatePicker
                  selected={dateReExam}
                  dateFormat={'dd/MM/yyyy'}
                  customInput={
                    <TextField
                      label='Ngày khám lại'
                      placeholder='Nhập ngày khám lại'
                      InputLabelProps={{ shrink: true }}
                      autoComplete='off'
                    />
                  }
                  onChange={(date: Date) =>
                    setResExam({
                      ...resExam,
                      diagnostic: {
                        ...resExam.diagnostic,
                        dateReExam: date
                      }
                    })
                  }
                /> */}
                <ReactDatePicker
                  selected={dateReExam}
                  dateFormat={'dd/MM/yyyy'}
                  showMonthDropdown
                  showYearDropdown
                  customInput={
                    <TextField
                      fullWidth
                      label='Từ Ngày'
                      placeholder='dd/mm/yyyy'
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton>
                              <CalendarTodayIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  }
                  onChange={(date: Date) =>
                    setResExam({
                      ...resExam,
                      diagnostic: {
                        ...resExam.diagnostic,
                        dateReExam: date
                      }
                    })
                  }
                />
              </DatePickerWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {input?.status !== '106' ? (
        <Stack sx={{ padding: '20px' }} direction={'row'} spacing={12} justifyContent={'center'}>
          <Button
            variant='contained'
            sx={{ mr: 5, width: '200px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={submit}
          >
            Lưu
          </Button>
        </Stack>
      ) : (
        <Stack sx={{ padding: '20px' }} direction={'row'} spacing={12} justifyContent={'center'}>
          <Button
            variant='contained'
            color='secondary'
            sx={{ mr: 5, width: '200px' }}
            startIcon={<Icon icon='eva:save-fill' />}
          >
            Lưu
          </Button>
        </Stack>
      )}
    </>
  )
}

export default ExamInfo
