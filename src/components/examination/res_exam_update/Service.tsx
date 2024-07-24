import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { resExamInput } from './index'
import React, { useCallback, useMemo, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import { IResExamServiceDt, IService } from './graphql/variables'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import {
  GET_DEPARTMENT,
  GET_RES_EXAM_SERVICEDT,
  GET_SERVICE,
  GET_SERVICE_GROUP,
  GET_SERVICE_INDEX,
  GET_SERVICE_INDEX_PROC,
  GET_SUBCLINICALID
} from './graphql/query'
import { Box, Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import MUIDialog from 'src/@core/components/dialog'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Controller, useForm } from 'react-hook-form'
import DeleteIcon from '@mui/icons-material/Delete'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import PaidIcon from '@mui/icons-material/Paid'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import SaveIcon from '@mui/icons-material/Save'
import { Examination } from 'src/components/reception/graphql/types'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'
import { formatVND } from 'src/utils/formatMoney'
import PreviewIcon from '@mui/icons-material/Preview'
import {
  ADD_MANY_SERVICE_INDEX_Proc,
  ADD_SERVICE_DT,
  ADD_SERVICE_DT_ARR,
  ADD_SERVICE_INDEX_Proc,
  UPDATE_RES_EXAM,
  UPDATE_SERVICE_DT,
  UPDATE_SERVICE_DT_ARR,
  UPDATE_SERVICE_INDEX_Proc
} from './graphql/mutation'
import toast from 'react-hot-toast'
import { getLocalstorage } from 'src/utils/localStorageSide'
import InputServiceSearch from 'src/components/inputSearch/InputServiceSearch'
import PrintsComponent from 'src/components/prints'

const initRegister: Examination = {
  gender: 0,
  dob: new Date(),
  age: 0,
  monthsOld: 0,
  patId: null,
  year: 0,
  phone: '',
  reasonExam: '',
  presenterId: null,
  // doctorId: '',
  patName: '',
  parentName: '',
  relationshipId: null,
  parentPhone: '',
  patCccd: '',
  address: '',
  // patGroup: ''
  body: '',
  part: '',
  medHistory: '',
  personalMedHistory: '',
  familyMedHistory: '',
  otherDisease: '',
  personalAllergicHistory: '',
  paulse: 0,
  breathingRate: 0,
  temperature: 0,
  bp1: 0,
  bp2: 0,
  weight: 0,
  height: 0,
  bmi: 0,
  // patGroupId: null,
  // departmentId: null,
  startDate: new Date(),
  endDate: new Date(),
  fiveYearFullDate: null,
  exploreObjectsId: null,
  patBhyt: '',
  benefitLevelId: null,
  glandTypeId: null,
  areaId: null,
  fromInsuranceId: null,
  swElseComeId: null,
  oldPlaceTreatmentId: null
}
const exampleData: any[] = []

const service_name = [
  'Ghi điện tim cấp cứu tại giường',
  'Đặt catheter tĩnh mạch ngoại biên',
  'Đặt catheter động mạch',
  'Siêu âm dẫn đường đặt catheter tĩnh mạch cấp cứu',
  'Sốc điện ngoài lồng ngực cấp cứu',
  'Đặt canuyn mũi hầu, miệng hầu',
  'Hút đờm qua ống nội khí quản/canuyn mở khí quản bằng ống thông một lần ở người bệnh không thở máy (một lần hút)',
  'Hút đờm qua ống nội khí quản/canuyn mở khí  quản bằng ống thông kín (có thở máy) (một lần hút)',
  'Bóp bóng Ambu qua mặt nạ',
  'Đặt ống nội khí quản'
]
const service_group = ['Điện Tim', 'Thủ Thuật', 'Siêu Âm']
for (let i = 1; i <= 10; i++) {
  exampleData.push({
    id: i,
    service_id: 'DV000' + i,
    service_name: service_name[i - 1],
    service_group: service_group[i % 3],
    service_price: '50,000 VNĐ',
    service_price_bhxh: '35,000 VNĐ',
    service_unit: 'Lần'
  })
}

const Service = (props: any) => {
  const input = resExamInput.value
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [print, setPrint] = useState(false)
  const [selectedServices, setSelectedServices] = useState<IService[]>([])
  const [selectedServicesBackup, setSelectedServicesBackup] = useState<IService[]>([])
  const [openServicesListModal, setOpenServicesListModal] = useState(false)
  const dataUs = getLocalstorage('userData')
  const client = useApolloClient()

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {
      deleteYn: { eq: false },
      resExamId: { eq: input.id }
    }
  })

  const { data: serviceDT, refetch } = useQuery(GET_RES_EXAM_SERVICEDT, {
    variables: queryVariables
  })

  const {
    control,
    formState: { errors }
  } = useForm({
    defaultValues: initRegister
  })
  const { data: getDepartmentData } = useQuery(GET_DEPARTMENT, {})

  const [AddResExamServiceDt] = useMutation(ADD_SERVICE_DT)
  const [AddManyResExamServiceDt] = useMutation(ADD_SERVICE_DT_ARR)
  const [updateResExam] = useMutation(UPDATE_RES_EXAM)
  const [UpdateManyResExamServiceDt] = useMutation(UPDATE_SERVICE_DT_ARR)
  const [UpdateResExamServiceDt] = useMutation(UPDATE_SERVICE_DT)
  const [UpdateServiceIndexProc] = useMutation(UPDATE_SERVICE_INDEX_Proc)
  const [AddManyServiceIndexProc] = useMutation(ADD_MANY_SERVICE_INDEX_Proc)
  const departmentData: any[] = useMemo(() => {
    return getDepartmentData?.getDepartment?.items ?? []
  }, [getDepartmentData])

  const resExamserviceDT: any[] = useMemo(() => {
    const dataPart = serviceDT?.getResExamServiceDt?.items as []
    const data = dataPart?.map((e: any) => {
      return {
        id: e.service?.id,
        name: e.service?.name,
        bhytYn: e.bhytYn,
        price: e.service?.price,
        bhytId: e.service?.bhytId,
        bhytPrice: e.service?.bhytPrice,
        departmentId: e.departmentId,
        bhytName: e.service?.bhytName,
        resExamDtId: e.id,
        chooseSpecIndex: e.service?.chooseSpecIndex,
        clinicId: e.service?.clinicId,
        cost: e.service?.cost,
        createAt: e.service?.createAt,
        createBy: e.service?.createBy,
        describe: e.service?.describe,
        gender: e.service?.gender,
        insurancePaymentRate: e.service?.insurancePaymentRate,
        serviceGroupId: e.service?.serviceGroupId,
        serviceTypeId: e.service?.serviceTypeId,
        status: e.service?.status,
        groupSubclinical: e.service?.groupSubclinical,
        quantity: e.quantity,
        totalPrice: e.price * e.quantity,
        serviceIndex: []
      }
    })

    setSelectedServices(data)
    setSelectedServicesBackup(serviceDT?.getResExamServiceDt?.items)
    return serviceDT?.getResExamServiceDt?.items ?? []
  }, [serviceDT])

  const departmentDataTypePK = departmentData.filter(department => department.id.split('_')[0] === 'PK')

  const columns = [
    {
      field: 'id',
      headerName: 'STT',
      width: 150,
      renderCell: (params: any) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography style={{ marginLeft: '10px' }}>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'service_id',
      headerName: 'Mã dịch vụ',
      width: 200
    },
    {
      field: 'service_name',
      headerName: 'Tên dịch vụ',
      width: 400,
      renderCell: (params: any) => (
        <Box
          sx={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: 'normal',
            maxHeight: '100%',
            overflow: 'hidden'
          }}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'service_group',
      headerName: 'Nhóm DV',
      width: 200
    },
    {
      field: 'service_price',
      headerName: 'Giá dịch vụ',
      width: 200
    },
    {
      field: 'service_price_bhxh',
      headerName: 'Giá BHXH',
      width: 200
    },
    {
      field: 'service_unit',
      headerName: 'ĐVT',
      width: 200
    }
  ]

  const handleSelectService = async (option: IService) => {
    const serviceIndex = await client.query({
      query: GET_SERVICE_INDEX,
      variables: {
        input: {
          deleteYn: { neq: true },
          serviceId: { eq: option.id }
        },
        skip: 0,
        take: 100
      }
    })
    const dataServiceIndex = serviceIndex?.data?.getServiceIndex?.items ?? []
    const existingServiceIndex = selectedServices.findIndex(service => service.id === option.id)
    if (existingServiceIndex !== -1) {
      const updatedServices = [...selectedServices]
      updatedServices[existingServiceIndex].quantity = (updatedServices[existingServiceIndex].quantity || 0) + 1
      updatedServices[existingServiceIndex].serviceIndex = dataServiceIndex
      setSelectedServices(updatedServices)
      setSelectedServicesBackup(updatedServices)
    } else {
      const newService = {
        ...option,
        quantity: 1,
        totalPrice: option.price,
        serviceIndex: dataServiceIndex,
        groupSubclinical: option.groupSubclinical
      }
      setSelectedServices(prevSelectedServices => [...prevSelectedServices, newService])
      setSelectedServicesBackup(prevSelectedServices => [...prevSelectedServices, newService])
    }
  }

  const handleRemoveService = async (serviceId: string, index: number) => {
    const serviceIndexProc = await client.query({
      query: GET_SERVICE_INDEX_PROC,
      variables: {
        input: {
          deleteYn: { neq: true },
          serviceId: { eq: serviceId }
        },
        skip: 0,
        take: 100
      }
    })
    const dataServiceIndexProc = serviceIndexProc?.data?.getServiceIndexProc?.items ?? []
    const removeDT = resExamserviceDT?.filter(item => item?.service?.id === serviceId)

    if (removeDT.length <= 0) {
      setSelectedServices(prevSelectedServices => {
        const index = prevSelectedServices.findIndex(item => item.id === serviceId)
        if (index !== -1) {
          const serviceItem = prevSelectedServices[index]
          if (serviceItem.quantity && serviceItem.quantity > 1) {
            const updatedServices = [...prevSelectedServices]
            updatedServices[index] = { ...serviceItem, quantity: serviceItem.quantity - 1 }
            return updatedServices
          } else {
            return prevSelectedServices.filter(service => service.id !== serviceId)
          }
        }
        return prevSelectedServices
      })
    } else {
      const filter = dataServiceIndexProc.filter((e: any) => e.serviceId === serviceId)
      const duplicatedItems = selectedServices.filter(item1 => selectedServices.some(item2 => item1.id === item2?.id))
      const removeItem = duplicatedItems?.filter(item => item.id === serviceId)
      if (removeItem.length > 0) {
        if (filter.length > 0) {
          filter.map((e: any) => {
            UpdateServiceIndexProc({
              variables: {
                input: JSON.stringify({
                  id: e.id,
                  deleteYn: true
                })
              },
              onError: () => {
                toast.error('Đã có lỗi khi xoá dịch vụ ')
              }
            })
          })
        }
        UpdateResExamServiceDt({
          variables: {
            input: JSON.stringify({
              id: removeItem[0]?.resExamDtId,
              deleteYn: true
            })
          },
          onCompleted: async () => {
            await refetch()
            toast.success('Đã xoá các chỉ số của dịch vụ thành công')
          },
          onError: () => {
            toast.error('Đã có lỗi khi xoá các chỉ số của dịch vụ ')
          }
        })
      }
    }
  }

  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi thêm các dịch vụ mới')
  }, [])

  const Submit = async () => {
    const uniqueInArray = selectedServices.filter(
      item2 => !resExamserviceDT.some(item1 => item2.id === item1.service.id)
    )
    if (uniqueInArray.length > 0) {
      const data = uniqueInArray.map(e => {
        if (e.departmentId == null) {
          toast.error('Bạn chưa chọn mã phòng khám')
          return false
        }
        return {
          resExamId: input.id,
          serviceId: e.id,
          note: e.note,
          price: e.price,
          bhytYn: e.bhytYn || false,
          freeYn: e.freeYn || false,
          totalPrice: e.totalPrice,
          quantity: e.quantity,
          status: '1000_100',
          groupSubclinical: e.groupSubclinical,
          departmentId: e.departmentId,
          clinicId: dataUs.clinicId,
          parentClinicId: dataUs.parentClinicId
        }
      })
      if (data[0]) {
        const dtGroupSubclinical = data.filter((e: any) => e.groupSubclinical === true)
        const dtNotGroupSubclinical = data.filter((e: any) => e.groupSubclinical === false)
        console.log('dtGroupSubclinical', dtGroupSubclinical)
        console.log('dtNotGroupSubclinical', dtNotGroupSubclinical)
        if (dtGroupSubclinical) {
          const dtSubclinical = await client.query({ query: GET_SUBCLINICALID })
          dtGroupSubclinical.map((item: any) => {
            AddResExamServiceDt({
              variables: {
                input: {
                  resExamId: item.resExamId,
                  serviceId: item.serviceId,
                  note: item.note,
                  price: item.price,
                  bhytYn: item.bhytYn || false,
                  freeYn: item.freeYn || false,
                  totalPrice: item.totalPrice,
                  quantity: item.quantity,
                  status: '1000_100',
                  departmentId: item.departmentId,
                  clinicId: dataUs.clinicId,
                  parentClinicId: dataUs.parentClinicId
                }
              },
              onCompleted: async (data: any) => {
                const dtService = selectedServices.find((e: any) => e.id === data.addResExamServiceDt.serviceId)
                const newData: any[] = []
                dtService?.serviceIndex?.forEach(serviceIndex => {
                  newData.push({
                    serviceId: data.addResExamServiceDt.serviceId,
                    serviceIndexId: serviceIndex.id,
                    mainDoctorId: input.doctor?.id,
                    diagnostic: input.diagnostic?.diagnose,
                    resExamId: input.id,
                    patientId: input.patId,
                    rowIndex: serviceIndex.rowIndex,
                    resExamServiceDtId: data.addResExamServiceDt.id,
                    subclinicalId: dtSubclinical?.data?.getGetSubclinicalId?.items[0].id,
                    clinicId: dataUs.clinicId,
                    parentClinicId: dataUs.parentClinicId,
                    deleteYn: false
                  })
                })

                await AddManyServiceIndexProc({
                  variables: {
                    input: JSON.stringify(newData)
                  },
                  onCompleted: () => {
                    toast.success('Chỉ định dịch vụ thành công')
                  },
                  onError: () => {
                    toast.error('Thêm các chỉ số thất bại')
                  }
                })
              },
              onError: () => {
                toast.error('Chỉ định dịch vụ thất bại')
              }
            })
          })
        }
        if (dtNotGroupSubclinical) {
          dtNotGroupSubclinical.map((item: any) => {
            AddResExamServiceDt({
              variables: {
                input: {
                  resExamId: item.resExamId,
                  serviceId: item.serviceId,
                  note: item.note,
                  price: item.price,
                  bhytYn: item.bhytYn || false,
                  freeYn: item.freeYn || false,
                  totalPrice: item.totalPrice,
                  quantity: item.quantity,
                  status: '1000_100',
                  departmentId: item.departmentId,
                  clinicId: dataUs.clinicId,
                  parentClinicId: dataUs.parentClinicId
                }
              },
              onCompleted: async (data: any) => {
                const dtService = selectedServices.find((e: any) => e.id === data.addResExamServiceDt.serviceId)
                const newData: any[] = []
                dtService?.serviceIndex?.forEach(async serviceIndex => {
                  const dtSubclinical = await client.query({ query: GET_SUBCLINICALID })
                  newData.push({
                    serviceId: data.addResExamServiceDt.serviceId,
                    serviceIndexId: serviceIndex.id,
                    mainDoctorId: input.doctor?.id,
                    diagnostic: input.diagnostic?.diagnose,
                    resExamId: input.id,
                    patientId: input.patId,
                    rowIndex: serviceIndex.rowIndex,
                    resExamServiceDtId: data.addResExamServiceDt.id,
                    subclinicalId: dtSubclinical?.data?.getGetSubclinicalId?.items[0].id,
                    clinicId: dataUs.clinicId,
                    parentClinicId: dataUs.parentClinicId,
                    deleteYn: false
                  })
                })

                await AddManyServiceIndexProc({
                  variables: {
                    input: JSON.stringify(newData)
                  },
                  onCompleted: () => {
                    toast.success('Chỉ định dịch vụ thành công')
                  },
                  onError: () => {
                    toast.error('Thêm các chỉ số thất bại')
                  }
                })
              },
              onError: () => {
                toast.error('Chỉ định dịch vụ thất bại')
              }
            })
          })
        }
      }
    } else {
      const data = selectedServices.map(e => {
        return {
          id: e.resExamDtId,
          note: e.note,
          price: e.price,
          bhytYn: e.bhytYn || false,
          freeYn: e.freeYn || false,
          totalPrice: e.totalPrice,
          quantity: e.quantity,
          departmentId: e.departmentId
        }
      })

      await UpdateResExamServiceDt({
        variables: {
          input: JSON.stringify(data)
        },
        onError: async () => {
          toast.error('Cập nhập các dịch vụ thất bại')
        },
        onCompleted: async () => {
          await refetch()
          toast.success('Cập nhập các dịch vụ thành công')
        }
      })
    }
  }

  const calculatePayment = (data: IResExamServiceDt[]) => {
    let bhytPayment = 0
    let patientPayment = 0

    data?.forEach(item => {
      if (item.bhytYn) {
        bhytPayment += item?.totalPrice || 0
      } else {
        patientPayment += item?.totalPrice || 0
      }
    })

    return { bhytPayment, patientPayment }
  }
  const dataWithBHYT = selectedServices?.filter(item => item.bhytYn === true)
  const dataWithoutBHYT = selectedServices?.filter(item => item.bhytYn !== true)

  const { bhytPayment, patientPayment } = calculatePayment(selectedServices)

  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          {input?.status !== '106' && (
            <Grid container gap={2}>
              <Grid item xs={6}>
                <InputServiceSearch
                  placeholder='Nhập mã, tên dịch vụ'
                  onClick={(e: IService) => handleSelectService(e)}
                />
              </Grid>

              <Button
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                variant='contained'
                style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                onClick={() => setOpenServicesListModal(true)}
              >
                <SearchIcon />
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={5}></Grid>
            <Grid item xs={7}>
              <Typography
                sx={{ fontWeight: '500', fontSize: '20px', height: '50px', lineHeight: '50px', textAlign: 'right' }}
              >
                {/* <PreviewIcon sx={{ fontSize: '24px' }} /> */}
                BHYT chi trả: {formatVND(bhytPayment)} / Bệnh nhân chi trả: {formatVND(patientPayment)}
              </Typography>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table
              sx={{
                minWidth: 650,
                mt: 5,
                overflow: 'hidden',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                border: '2px solid #e0e0e0'
              }}
              aria-label='simple table'
            >
              <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>TÊN DV</TableCell>
                  <TableCell>GHI CHÚ</TableCell>
                  <TableCell>PHÒNG KHÁM</TableCell>
                  <TableCell style={{ letterSpacing: 0 }}>SỐ LƯỢNG</TableCell>
                  <TableCell>ĐƠN GIÁ</TableCell>
                  <TableCell>THÀNH TIỀN</TableCell>
                  <TableCell>BH</TableCell>
                  <TableCell>M.PHÍ</TableCell>
                  <TableCell style={{ letterSpacing: 0 }}>THANH TOÁN</TableCell>
                  <TableCell>Công cụ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow style={{ height: '50px' }}>
                  <Typography style={{ width: '300px', position: 'absolute', padding: '15px' }}>
                    Tổng thuốc dịch vụ: {dataWithoutBHYT?.length}
                  </Typography>
                </TableRow>
                {dataWithoutBHYT?.map((service: IService, index: number) => (
                  <TableRow key={service.id}>
                    <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                    <TableCell style={{ width: '25%' }}>
                      <Typography style={{ width: '100%' }}>{service?.name || ''} </Typography>
                    </TableCell>
                    <TableCell style={{ width: '40%' }}>
                      <TextField sx={{ width: '100%' }} value={service?.note} />
                    </TableCell>
                    <TableCell style={{ width: '40%' }}>
                      <Autocomplete
                        autoHighlight
                        openOnFocus
                        sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        options={departmentDataTypePK}
                        getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                        value={departmentDataTypePK.find(i => i.id === service.departmentId) ?? null}
                        renderOption={(props, option) => (
                          <Typography key={option.id} {...props} variant='body1'>
                            {option.name}
                          </Typography>
                        )}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              departmentId: value.id
                            }
                            setSelectedServices(newServices)
                          }
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Chọn phòng Khám'
                            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell style={{ width: '20%' }}>
                      <TextField
                        value={service.quantity}
                        type='number'
                        fullWidth
                        sx={{ width: '70px' }}
                        inputProps={{ min: 0 }}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            totalPrice: Number(e.target.value) * (service.price || 0)
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ width: '15%', fontSize: '1rem' }}>{formatVND(service.price || 0)}</TableCell>
                    <TableCell style={{ width: '200px' }}>
                      <TextField
                        value={formatVND(service.totalPrice || 0)}
                        fullWidth
                        sx={{ width: '200px' }}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            totalPrice: Number(e.target.value)
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '5%' }}>
                      <Checkbox
                        {...label}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            totalPrice: e.target.checked
                              ? service.bhytPrice
                              : selectedServicesBackup[serviceIndex].price,
                            bhytYn: e.target.checked
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>

                    <TableCell style={{ width: '10%' }}>
                      <Checkbox
                        {...label}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            totalPrice: e.target.checked ? 0 : selectedServicesBackup[serviceIndex].price,
                            freeYn: e.target.checked
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Stack direction='row' spacing={1}>
                        <IconButton aria-label='delete'>
                          <PaidIcon />
                        </IconButton>
                        <IconButton aria-label='delete' disabled color='success'>
                          <NoteAddOutlinedIcon color='warning' />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Tooltip title='Xoá'>
                        <MenuItem onClick={() => handleRemoveService(service.id || '', index)}>
                          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                        </MenuItem>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow style={{ height: '50px' }}>
                  <Typography style={{ width: '300px', position: 'absolute', padding: '15px' }}>
                    Tổng thuốc BHYT: {dataWithBHYT?.length}
                  </Typography>
                </TableRow>
                {dataWithBHYT?.map((service: IService, index: number) => (
                  <TableRow key={service.id}>
                    <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                    <TableCell style={{ width: '25%' }}>
                      <Typography style={{ width: '100%' }}>{service?.name || ''} </Typography>
                    </TableCell>
                    <TableCell style={{ width: '40%' }}>
                      <TextField sx={{ width: '100%' }} value={service?.note} />
                    </TableCell>
                    <TableCell style={{ width: '40%' }}>
                      <Autocomplete
                        autoHighlight
                        openOnFocus
                        sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        options={departmentDataTypePK}
                        getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                        value={departmentDataTypePK.find(i => i.id === service.departmentId) ?? null}
                        renderOption={(props, option) => (
                          <Typography key={option.id} {...props} variant='body1'>
                            {option.name}
                          </Typography>
                        )}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              departmentId: value.id
                            }
                            setSelectedServices(newServices)
                          }
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Chọn phòng Khám'
                            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell style={{ width: '20%' }}>
                      <TextField
                        value={service.quantity}
                        type='number'
                        fullWidth
                        sx={{ width: '70px' }}
                        inputProps={{ min: 0 }}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            totalPrice: Number(e.target.value) * (service.price || 0)
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ width: '15%', fontSize: '1rem' }}>{formatVND(service.price || 0)}</TableCell>
                    <TableCell style={{ width: '200px' }}>
                      <TextField
                        value={formatVND(service.totalPrice || 0)}
                        fullWidth
                        sx={{ width: '200px' }}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            totalPrice: Number(e.target.value)
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '5%' }}>
                      <Checkbox
                        {...label}
                        checked={true}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            totalPrice: e.target.checked
                              ? service.bhytPrice
                              : selectedServicesBackup[serviceIndex].price,
                            bhytYn: e.target.checked
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>

                    <TableCell style={{ width: '10%' }}>
                      <Checkbox
                        {...label}
                        onChange={e => {
                          const newServices = [...selectedServices]
                          const serviceIndex = newServices.findIndex(s => s.id === service.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            totalPrice: e.target.checked ? 0 : selectedServicesBackup[serviceIndex].price,
                            freeYn: e.target.checked
                          }
                          setSelectedServices(newServices)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Stack direction='row' spacing={1}>
                        <IconButton aria-label='delete'>
                          <PaidIcon />
                        </IconButton>
                        <IconButton aria-label='delete' disabled color='success'>
                          <NoteAddOutlinedIcon color='warning' />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Tooltip title='Xoá'>
                        <MenuItem onClick={() => handleRemoveService(service.id || '', index)}>
                          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                        </MenuItem>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 5, gap: 10 }}>
              {(input.status !== '106' && resExamserviceDT?.length > 0) || selectedServices?.length > 0 ? (
                <Button type='button' onClick={() => Submit()} variant='contained' startIcon={<SaveIcon />}>
                  Chỉ định
                </Button>
              ) : null}
              <Button
                sx={{ background: '#8592A3', color: '#ffffff' }}
                type='button'
                onClick={() => setPrint(true)}
                variant='contained'
                startIcon={<LocalPrintshopIcon />}
              >
                In Phiếu
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
      <MUIDialog
        useFooter={false}
        maxWidth='xl'
        open={[openServicesListModal, setOpenServicesListModal]}
        title='Danh sách dịch vụ'
      >
        <>
          <Grid
            sx={{ padding: '30px' }}
            container
            rowSpacing={4}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            alignItems='stretch'
          >
            <Grid item xs={8}>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={6}>
                  <div style={{ display: 'flex' }}>
                    <TextField
                      fullWidth
                      label='Nhập từ khoá tìm kiếm'
                      placeholder='Nhập từ khoá tìm kiếm'
                      InputLabelProps={{ shrink: true }}
                      variant='outlined'
                      sx={{
                        '& fieldset': {
                          borderTopRightRadius: '0px',
                          borderBottomRightRadius: '0px'
                        }
                      }}
                    />
                    <Button
                      sx={{ borderRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                    >
                      <SearchIcon />
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label='Loại Dịch Vụ'
                    InputLabelProps={{ shrink: true }}
                    placeholder='Chọn loại dịch vụ'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ArrowDropDownIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label='Nhóm Dịch Vụ'
                    InputLabelProps={{ shrink: true }}
                    placeholder='Chọn nhóm dịch vụ'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ArrowDropDownIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Controller
                  name='gender'
                  control={control}
                  defaultValue={0}
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <RadioGroup
                      {...fieldProps}
                      onChange={e => onChange(parseInt(e.target.value, 10))}
                      row
                      aria-labelledby='demo-form-control-label-placement'
                    >
                      <FormControlLabel value='BHYT' control={<Radio />} label='BHYT' />
                      <FormControlLabel value='DichVu' control={<Radio />} label='Dịch Vụ' />
                      <FormControlLabel value='BH-ChenhLech' control={<Radio />} label='BH-Chênh lệch' />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <DataGrid
                rows={exampleData}
                columns={columns}
                rowCount={5}
                rowHeight={80}
                pagination
                checkboxSelection
                style={{ minHeight: 700 }}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#D9D9D9'
                  }
                }}
              />
            </Grid>
          </Grid>
          <Stack
            sx={{ padding: '20px', backgroundColor: '#D9D9D9' }}
            direction={'row'}
            spacing={12}
            justifyContent={'end'}
          >
            <Button
              variant='contained'
              sx={{ mr: 5, width: '200px' }}
              startIcon={<Icon icon='eva:save-fill' />}
              onClick={() => setOpenServicesListModal(false)}
            >
              Lưu
            </Button>
            <Button
              variant='outlined'
              sx={{ width: '200px', backgroundColor: '#8592A3', color: '#fff' }}
              startIcon={<Icon icon='eva:close-fill' />}
              onClick={() => setOpenServicesListModal(false)}
            >
              Đóng
            </Button>
          </Stack>
        </>
      </MUIDialog>
      <PrintsComponent
        openPrint={print}
        setOpenButtonDialog={setPrint}
        titlePrint='Phiếu chỉ định dịch vụ'
        clinicId='CLI0001'
        parentClinicId='CLI0001'
        printFunctionId='pr10000012'
        printType='p_res_service_id'
        printTypeId={input.id || ''}
      />
    </>
  )
}

export default Service
