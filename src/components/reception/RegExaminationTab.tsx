/* eslint-disable react-hooks/exhaustive-deps */
import React, { use, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Grid,
  Button,
  Typography,
  TextField,
  CardContent,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Box,
  FormControl,
  Collapse,
  IconButton,
  Autocomplete,
  Stack
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import QrCodeIcon from '@mui/icons-material/QrCode'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import RefreshIcon from '@mui/icons-material/Refresh'
import MUIDialog from 'src/@core/components/dialog'
import Icon from 'src/@core/components/icon'
import { GET_APPOINT_SCHEDULE, GET_PATIENT } from './graphql/query'
import { Examination, Service, ServiceGroup, ResExamServiceDt } from './graphql/types'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { QueryContext } from './QueryProvider'
import { MutationContext } from './MutationProvider'
import { useQuery } from '@apollo/client'
import { PatientData } from './utils/type'
import SurvivalCard from './cards/SurvivalCard'
import ServiceCard from './cards/ServiceCard'
import CardTemplate from './cards/CardTemplate'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { debounce } from './utils/helpers'
import { useApolloClient } from '@apollo/client'
import PrintsComponent from '../prints'

// ***************************************************************************************** //
// ************************************ Component ************************************ //
// ***************************************************************************************** //
const exampleData: any[] = []

/*
	EO0000001:  BHXH
	EO0000002: Dịch vụ
	EO0000003: Miễn Phí
*/

const initRegister: Examination = {
  gender: 0,
  departmentId: null,
  dob: null,
  age: null,
  monthsOld: null,
  patId: null,
  year: null,
  phone: null,
  reasonExam: '',
  presenterId: null,
  patName: '',
  parentName: '',
  relationshipId: null,
  parentPhone: '',
  patCccd: '',
  address: '',
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
  startDate: null,
  endDate: null,
  fiveYearFullDate: null,
  exploreObjectsId: null,
  patBhyt: '',
  benefitLevelId: null,
  glandTypeId: null,
  areaId: null,
  fromInsuranceId: null,
  swElseComeId: null,
  oldPlaceTreatmentId: null,
  appointmentDate: null,
  patGroupId: null,
  appointScheduleId: null,
  clinicId: getLocalstorage('userData')?.clinicId,
  parentClinicId: getLocalstorage('userData')?.parentClinicId,
  createAt: new Date(),
  doctorId: null,
  bhyt1: null,
  bhyt2: null,
  bhyt3: null,
  bhyt4: null,
  bhyt5: null,
  bhyt6: null
}

const initResExamServiceDt: ResExamServiceDt = {
  bhytYn: false,
  clinicId: getLocalstorage('userData')?.clinicId,
  createAt: new Date(),
  deleteYn: false,
  departmentId: null,
  freeYn: false,
  note: '',
  parentClinicId: getLocalstorage('userData')?.parentClinicId,
  paymentStatus: false,
  quantity: 0,
  resExamId: null,
  serviceId: null,
  status: '100',
  price: 0,
  totalPrice: 0
}

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

type RegExaminationTabProps = {
  appointmentScheduleIdWillRegister: string
  clearAppointmentIdAfterCreate: () => void
  triggerRefetch: () => void
}

const RegExaminationTab: React.FC<RegExaminationTabProps> = ({
  appointmentScheduleIdWillRegister,
  clearAppointmentIdAfterCreate,
  triggerRefetch
}) => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: initRegister
  })
  const apolloClient = useApolloClient()
  const [expanded, setExpanded] = useState(true)
  const [print, setPrint] = useState<boolean>(false)
  const [resExamID, setResExamId] = useState<string>('')
  const [isSearchByPatCccdTriggered, setIsSearchByPatCccdTriggered] = useState(false)
  const [isSearchByAppointmentScheduleTriggered, setIsSearchByAppointmentScheduleTriggered] = useState(false)
  const [viewBhxh, setViewBhxh] = useState(false)
  const [openServicesListModal, setOpenServicesListModal] = useState(false)
  const [keySearch, setKeySearch] = useState('')
  const [keySearchByPatCccd, setKeySearchByPatCccd] = useState('')
  const [selectedServices, setSelectedServices] = useState<ServiceGroup[]>([])
  const [allPatients, setAllPatients] = useState([])
  const [currentExploreObjectsId, setCurrentExploreObjectsId] = useState('EO0000002')
  const [searchDataByAppointSchedule, setSearchDataByAppointSchedule] = useState({
    keySearch: ''
  })
  const [searchDataByPatCccd, setSearchDataByPatCccd] = useState({
    keySearchByPatCccd: ''
  })
  const [searchPatientData, setSearchPatientData] = useState({
    keySearch: '',
    skip: 0,
    take: 100
  })
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {}
  })
  const [queriesPatientCondition, setQueriesPatientCondition] = useState({
    input: {},
    skip: searchPatientData.skip,
    take: searchPatientData.take,
    order: [{ createAt: 'DESC' }]
  })

  useEffect(()=>{
    if(currentExploreObjectsId!=='EO0000001'){
      setViewBhxh(false)
    }
  })
  console.log(currentExploreObjectsId)
  useEffect(() => {
    if (resExamID) {
      setPrint(true)
    }
  }, [resExamID])
  const { addResExam, addPatient, addResExamServiceDt, updateAppointSchedule } = useContext(MutationContext)

  const {
    getExploreObject,
    getPatGroupData,
    getDepartmentData,
    getUserData,
    getRelationshipData,
    getBenefitLevelData,
    getAreaData,
    getFromInsuranceData,
    getGlandTypeData,
    getOldPlaceTreatmentData
  } = useContext(QueryContext)

  const { data: getPatientData } = useQuery(GET_PATIENT, {
    variables: queriesPatientCondition
  })

  const { data: getAppointmentScheduleData } = useQuery(GET_APPOINT_SCHEDULE, {
    variables: queryVariables,
    skip: !isSearchByAppointmentScheduleTriggered
  })

  const benefitLevelData = useMemo(() => {
    return getBenefitLevelData?.getBenefitLevel?.items ?? []
  }, [getBenefitLevelData])

  const areaData = useMemo(() => {
    return getAreaData?.getArea?.items ?? []
  }, [getAreaData])

  const fromInsuranceData = useMemo(() => {
    return getFromInsuranceData?.getFromInsurance?.items ?? []
  }, [getFromInsuranceData])

  const glandTypeData = useMemo(() => {
    return getGlandTypeData?.getGlandType?.items ?? []
  }, [getGlandTypeData])

  const oldPlaceTreatmentData = useMemo(() => {
    return getOldPlaceTreatmentData?.getOldPlaceTreatment?.items ?? []
  }, [getOldPlaceTreatmentData])

  const relationshipData: any[] = useMemo(() => {
    return getRelationshipData?.getRelationship?.items ?? []
  }, [getRelationshipData])

  const patientData: any[] = useMemo(() => {
    return getPatientData?.getPatient?.items ?? []
  }, [getPatientData])

  const appointmentScheduleData: any[] = useMemo(() => {
    return getAppointmentScheduleData?.getAppointSchedule?.items ?? []
  }, [getAppointmentScheduleData])

  const userData: any[] = useMemo(() => {
    return getUserData?.getUser?.items ?? []
  }, [getUserData])

  const userDataRoleDoctor = userData

  const departmentData: any[] = useMemo(() => {
    return getDepartmentData?.getDepartment?.items ?? []
  }, [getDepartmentData])

  const departmentDataTypePK = useMemo(
    () => departmentData.filter(department => department.id.split('_')[0] === 'PK'),
    [departmentData]
  )

  const exploreObjectData: any[] = useMemo(() => {
    return getExploreObject?.getExploreObject?.items ?? []
  }, [getExploreObject])

  const patGroupData: any[] = useMemo(() => {
    return getPatGroupData?.getPatGroup?.items ?? []
  }, [getPatGroupData])

  const fetchAllPatients = useCallback(
    async (skip = 0, allData = []) => {
      const { data } = await apolloClient.query({
        query: GET_PATIENT,
        variables: {
          input: {},
          skip: skip,
          take: 25
        },
        fetchPolicy: 'network-only'
      })

      const newData = data.getPatient.items
      const combinedData: any = [...allData, ...newData]

      if (newData.length < 25) {
        // If the last page has been reached
        setAllPatients(combinedData)
      } else {
        fetchAllPatients(skip + 25, combinedData)
      }
    },
    [apolloClient]
  )

  useEffect(() => {
    if (exploreObjectData.length > 0) {
      setValue('exploreObjectsId', 'EO0000002')
    }
  }, [exploreObjectData, setValue])

  useEffect(() => {
    fetchAllPatients()
  }, [])

  useEffect(() => {
    if (isSearchByAppointmentScheduleTriggered && appointmentScheduleData?.length > 0) {
      const dataToSet = appointmentScheduleData[0]
      reset(dataToSet)
      setValue('exploreObjectsId', dataToSet.exploreObjectsId || 'EO0000002')
      setValue('appointScheduleId', dataToSet.id)
      setIsSearchByAppointmentScheduleTriggered(false)
    }
  }, [appointmentScheduleData, isSearchByAppointmentScheduleTriggered])

  useEffect(() => {
    if (isSearchByAppointmentScheduleTriggered) {
      const { keySearch } = searchDataByAppointSchedule
      setQueryVariables((prev: any) => ({
        ...prev,
        input: keySearch.trim() !== '' ? { id: { eq: keySearch } } : undefined
      }))
    }
  }, [searchDataByAppointSchedule, isSearchByAppointmentScheduleTriggered])

  useEffect(() => {
    if (isSearchByPatCccdTriggered) {
      const { keySearchByPatCccd: keySearch } = searchDataByPatCccd
      setQueriesPatientCondition((prev: any) => ({
        ...prev,
        input: keySearch.trim() !== '' ? { patCccd: { eq: keySearch } } : undefined
      }))
    }
  }, [searchDataByPatCccd, isSearchByPatCccdTriggered])

  useEffect(() => {
    if (isSearchByPatCccdTriggered && patientData?.length > 1) {
      const dataToSet = patientData[0]
      const formData = {
        ...dataToSet,
        patName: dataToSet.name || '',
        dob: dataToSet.birthday || '',
        parentName: dataToSet.famlilyName || '',
        parentPhone: dataToSet.famlilyPhone || '',
        patId: dataToSet.id || '',
        year: dataToSet.birthday.split('-')[0] || null
      }
      reset(formData)
      setIsSearchByPatCccdTriggered(false)
    }
  }, [patientData, isSearchByPatCccdTriggered])

  useEffect(() => {
    Object.values(errors).forEach(error => {
      const message = error?.message || 'This field is required'
      console.log('message', message)
      toast.error(message)
    })
  }, [errors])

  useEffect(() => {
    if (appointmentScheduleIdWillRegister) {
      console.log('appointmentScheduleIdWillRegister', appointmentScheduleIdWillRegister)
      setKeySearch(appointmentScheduleIdWillRegister)
      handleChangeSearch('keySearch', appointmentScheduleIdWillRegister)
    }
  }, [appointmentScheduleIdWillRegister])

  const handleChangeSearch = (key: string, value: any) => {
    if (value.trim() === '') {
      reset()
      setQueriesPatientCondition(x => ({
        ...x,
        skip: 0,
        take: 25,
        input: {}
      }))
      setIsSearchByAppointmentScheduleTriggered(false)
    } else {
      setSearchDataByAppointSchedule({
        ...searchDataByAppointSchedule,
        [key]: value
      })
      setIsSearchByAppointmentScheduleTriggered(true)
    }
    clearAppointmentIdAfterCreate()
  }

  const handleChangeSearchByCccd = (key: string, value: any) => {
    if (value.trim() === '') {
      reset()
      setQueriesPatientCondition(x => ({
        ...x,
        skip: 0,
        take: 25,
        input: {}
      }))
    } else {
      setSearchDataByPatCccd({
        ...searchDataByPatCccd,
        [key]: value
      })
      setIsSearchByPatCccdTriggered(true)
    }
  }

  const handleExpandTiepDonClick = () => {
    setExpanded(!expanded)
  }

  const handleChangeDoiTuongKham = (event: { target: { value: any } }) => {
    const {
      target: { value }
    } = event

    if (value?.name == 'BHYT') {
      setViewBhxh(true)
    } else {
      setViewBhxh(false)
    }
  }

  const handleSelectService = (selectedService: Service) => {
    setSelectedServices((prevSelectedServices: any) => {
      const groupIndex = prevSelectedServices.findIndex(
        (group: any) => group.serviceGroupId === selectedService.serviceGroupId
      )

      if (groupIndex !== -1) {
        const serviceIndex = prevSelectedServices[groupIndex].services.findIndex(
          (service: { id: any }) => service.id === selectedService.id
        )

        if (serviceIndex !== -1) {
          const updatedGroups = [...prevSelectedServices]
          const updatedService = {
            ...updatedGroups[groupIndex].services[serviceIndex],
            quantity: (updatedGroups[groupIndex].services[serviceIndex].quantity || 0) + 1
          }
          updatedGroups[groupIndex].services[serviceIndex] = updatedService
          return updatedGroups
        } else {
          const updatedGroups = [...prevSelectedServices]
          const newService = { ...selectedService, quantity: 1 }
          updatedGroups[groupIndex].services = [...updatedGroups[groupIndex].services, newService]
          return updatedGroups
        }
      } else {
        const newGroup = {
          serviceGroupId: selectedService.serviceGroupId,
          services: [{ ...selectedService, quantity: 1 }]
        }
        return [...prevSelectedServices, newGroup]
      }
    })
    console.log('selectedServices', selectedServices)
  }

  const handleRemoveService = (groupId: string, serviceId: string) => {
    setSelectedServices(prevSelectedServices => {
      const updatedGroups = prevSelectedServices.reduce((acc: any, group: any) => {
        if (typeof group === 'object' && group && group.serviceGroupId === groupId) {
          const updatedServices = group.services.reduce((servicesAcc: any, service: any) => {
            if (service.id === serviceId) {
              if (service.quantity && service.quantity > 1) {
                servicesAcc.push({ ...service, quantity: service.quantity - 1 })
              }
            } else {
              servicesAcc.push(service)
            }
            return servicesAcc
          }, [])

          if (updatedServices.length > 0) {
            acc.push({ ...group, services: updatedServices })
          }
        } else {
          acc.push(group)
        }
        return acc
      }, [])

      return updatedGroups
    })
  }

  const handleCreateResExamServiceDt = (resExamId: string) => {
    selectedServices.forEach((group: ServiceGroup) => {
      group.services?.forEach((service: Service) => {
        const newResExamServiceDt = {
          ...initResExamServiceDt,
          resExamId,
          serviceId: service.id,
          departmentId: service.departmentId,
          quantity: service.quantity,
          price:
            currentExploreObjectsId === 'EO0000001'
              ? service.bhytPrice
              : currentExploreObjectsId === 'EO0000002'
              ? service.price
              : 0,
          totalPrice: (service.quantity ?? 1) * (service.price ?? 0),
          freeYn: getValues('exploreObjectsId') === 'EO0000003',
          bhytYn: getValues('exploreObjectsId') === 'EO0000001'
        }
        addResExamServiceDt({
          variables: {
            input: newResExamServiceDt
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi tạo dịch vụ khám')
          },
          onCompleted: () => {
            setCurrentExploreObjectsId('EO0000002')
            toast.success('Tạo dịch vụ khám thành công')
          }
        })
      })
    })
  }

  const handleUpdateAppointmentSchedule = (appointmentScheduleId: string) => {
    updateAppointSchedule({
      variables: {
        input: JSON.stringify({ id: appointmentScheduleId, status: '114' })
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi cập nhật lịch hẹn')
      },
      onCompleted: () => {
        toast.success('Cập nhật lịch hẹn thành công')
        triggerRefetch()
      }
    })
  }

  const handleUpdateService = (service: Service) => {
    setSelectedServices(prevSelectedServices => {
      const groupIndex = prevSelectedServices.findIndex((group: any) => group.serviceGroupId === service.serviceGroupId)

      if (groupIndex !== -1) {
        const serviceIndex =
          prevSelectedServices[groupIndex] &&
          prevSelectedServices[groupIndex].services?.findIndex((item: { id: any }) => item.id === service.id)

        if (serviceIndex !== -1) {
          const updatedGroups = [...prevSelectedServices]
          updatedGroups[groupIndex].services[serviceIndex] = service
          return updatedGroups
        }
      }
      return prevSelectedServices
    })
  }

  const onSubmit = (data: any) => {
    const newData = {
      ...data,
      status: '100',
      age: +data.age || 0
    }

    const processedData = Object.entries(newData).reduce((acc, [key, value]) => {
      if (
        [
          'appointmentTypeId',
          'appointmentDate',
          '__typename',
          'email',
          'receptionistId',
          'scheduleContent',
          'id',
          'note'
        ].includes(key)
      )
        return acc
      acc[key] = value === '' ? null : value
      return acc
    }, {} as typeof data)
    const finalData = {
      ...processedData
    }
    delete finalData.bhyt1

    if (processedData.patId) {
      console.log('else stament')
      addResExam({
        variables: {
          input: processedData?.bhyt ? finalData : processedData
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi cập nhật khách hàng')
        },
        onCompleted: (data: { addResExam: { id: any } }) => {
          handleCreateResExamServiceDt(data.addResExam.id)
          newData.appointScheduleId && handleUpdateAppointmentSchedule(newData.appointScheduleId)
          clearAppointmentIdAfterCreate()
          toast.success('Cập nhật khách hàng thành công')
          reset({
            ...initRegister,
            exploreObjectsId: 'EO0000002'
          })
          setResExamId(data.addResExam.id)
          setCurrentExploreObjectsId('EO0000002')
          setSelectedServices([])
        }
      })
    } else {
      const newPatientData: PatientData = {
        name: processedData.patName || '',
        gender: processedData.gender || 0,
        address: processedData.address || '',
        patCccd: processedData.patCccd || '',
        birthday: processedData.dob || new Date(),
        phone: processedData.phone || '',
        famlilyName: processedData.parentName || '',
        famlilyPhone: processedData.parentPhone || '',
        monthsOld: processedData.monthsOld || 0,
        age: processedData.age || 0,
        oldPlaceTreatmentId: processedData.oldPlaceTreatmentId || null,
        presenterId: processedData.presenterId || null,
        year: processedData.year || 0,
        note: processedData.note || '',
        reasonExam: processedData.reasonExam || '',
        email: processedData.email || '',
        status: true,
        bhyt1: processedData.bhyt1 || '',
        bhyt2: processedData.bhyt2 || '',
        bhyt3: processedData.bhyt3 || '',
        bhyt4: processedData.bhyt4 || '',
        bhyt5: processedData.bhyt5 || '',
        bhyt6: processedData.bhyt6 || ''
      }

      addPatient({
        variables: {
          input: newPatientData
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo khách hàng mới')
        },
        onCompleted: () => {
          toast.success('Tạo mới khách hàng thành công')
          reset({
            ...initRegister,
            exploreObjectsId: 'EO0000002'
          })
          setCurrentExploreObjectsId('EO0000002')
        }
      })

      addResExam({
        variables: {
          input: processedData
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo đăng ký khám')
        },
        onCompleted: (data: { addResExam: { id: any } }) => {
          handleCreateResExamServiceDt(data.addResExam.id)
          newData.appointScheduleId && handleUpdateAppointmentSchedule(newData.appointScheduleId)
          clearAppointmentIdAfterCreate()
          setResExamId(data.addResExam.id)
          toast.success('Tạo mới đăng ký khám thành công')
          setCurrentExploreObjectsId('EO0000002')
          reset({
            ...initRegister,
            exploreObjectsId: 'EO0000002'
          })
        }
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <CardTemplate title='Thông tin bệnh nhân'>
              <CardContent>
                <Grid container columnSpacing={7}>
                  <Grid className='frame1' item xs={6}>
                    <Grid container spacing={6}>
                      <Grid item xs={6}>
                        <Controller
                          name='appointScheduleId'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='search'
                              label='Lịch hẹn'
                              InputLabelProps={{ shrink: true }}
                              variant='outlined'
                              value={keySearch}
                              onChange={e => {
                                if (e.target.value) {
                                  setKeySearch(e.target.value)
                                } else {
                                  setKeySearch('')
                                  reset({
                                    ...initRegister,
                                    exploreObjectsId: 'EO0000002'
                                  })
                                }
                              }}
                              onBlur={e => handleChangeSearch('keySearch', e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <QrCodeIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name='patCccd'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='QR CCCD'
                              variant='outlined'
                              value={keySearchByPatCccd}
                              onChange={e => {
                                setKeySearchByPatCccd(e.target.value)
                              }}
                              onBlur={e => handleChangeSearchByCccd('keySearchByPatCccd', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <QrCodeIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <Box style={{ display: 'flex' }}>
                          <Controller
                            name='patName'
                            control={control}
                            render={({ field: { onChange } }) => (
                              <Autocomplete
                                autoHighlight
                                openOnFocus
                                freeSolo
                                sx={{ width: '100%' }}
                                options={allPatients}
                                onInputChange={(_, newValue, reason) => {
                                  if (reason === 'input') onChange(newValue)
                                  else if (reason === 'clear') {
                                    reset({
                                      ...initRegister,
                                      exploreObjectsId: 'EO0000002'
                                    })
                                  } else {
                                    console.log('reason', reason)
                                  }
                                }}
                                getOptionLabel={(option: any) => option.name || ''}
                                value={allPatients.find((item: any) => item.id === watch('patId')) || null}
                                onChange={(_, data: any | null) => {
                                  if (data) {
                                    reset({
                                      ...getValues(),
                                      patName: data.name || '',
                                      patId: data.id || '',
                                      dob: data.birthday ? new Date(data.birthday) : new Date(),
                                      address: data.address || '',
                                      patCccd: data.patCccd || '',
                                      parentName: data.famlilyName || '',
                                      parentPhone: data.famlilyPhone || '',
                                      monthsOld: data.monthsOld || 0,
                                      age: data.age || 0,
                                      gender: data.gender || 0,
                                      year: data.birthday
                                        ? new Date(data.birthday).getFullYear()
                                        : new Date().getFullYear(),
                                      presenterId: data.presenterId || '',
                                      personalMedHistory: data.personalMedHistory || '',
                                      personalAllergicHistory: data.personalAllergicHistory || '',
                                      patGroupId: data.patGroupId || '',
                                      otherDisease: data.otherDisease || '',
                                      patBhyt: data.patBhyt || '',
                                      familyMedHistory: data.familyMedHistory || '',
                                      phone: data.phone || '',
                                      relationshipId: data.relationshipId || '',
                                      exploreObjectsId: data.exploreObjectsId ?? 'EO0000002'
                                    })
                                  } else {
                                    reset({
                                      ...initRegister,
                                      exploreObjectsId: 'EO0000002'
                                    })
                                    setSearchPatientData({ ...searchPatientData, keySearch: '' })
                                  }
                                }}
                                renderOption={(props, option) => (
                                  <Box
                                    component='li'
                                    {...props}
                                    key={option.id}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start'
                                    }}
                                  >
                                    <>
                                      <Typography variant='body2' sx={{ width: '100%' }}>
                                        <strong>{option.name}</strong> - {option.gender === 1 ? 'Nữ' : 'Nam'}
                                      </Typography>
                                      <Typography variant='body2' sx={{ width: '100%' }}>
                                        <strong>SĐT:</strong> {option.phone}
                                      </Typography>
                                      <Typography variant='body2' sx={{ width: '100%' }}>
                                        <strong> Ngày sinh:</strong> {option.dob} - <strong>Tuổi: </strong>
                                        {option.age}
                                      </Typography>
                                      <Typography variant='body2' sx={{ width: '100%' }}>
                                        <strong>Địa chỉ:</strong> {option.address}
                                      </Typography>
                                    </>
                                  </Box>
                                )}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Họ và tên'
                                    onChange={e => {
                                      const value = e.target.value
                                      setSearchPatientData({ ...searchPatientData, keySearch: value })
                                    }}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderTopRightRadius: '0px',
                                        borderBottomRightRadius: '0px'
                                      }
                                    }}
                                  />
                                )}
                              />
                            )}
                          />

                          <Button
                            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            variant='contained'
                            style={{ backgroundColor: '#AEB4AB', width: 56 }}
                          >
                            <RefreshIcon />
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item sm={5}>
                        <FormControl fullWidth>
                          <Typography>
                            Giới tính <strong style={{ color: 'red' }}>*</strong>
                          </Typography>
                          <Controller
                            name='gender'
                            control={control}
                            defaultValue={0}
                            render={({ field: { onChange, value, ...fieldProps } }) => (
                              <RadioGroup
                                {...fieldProps}
                                row
                                aria-label='gender'
                                name='controlled-radio-buttons-group'
                                value={value}
                                onChange={e => onChange(parseInt(e.target.value, 10))}
                                sx={{ justifyContent: 'flex-start' }}
                              >
                                <FormControlLabel value={0} control={<Radio />} label='Nam' />
                                <FormControlLabel value={1} control={<Radio />} label='Nữ' />
                              </RadioGroup>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={7}>
                        <Grid container spacing={5}>
                          <Grid item xs={6}>
                            <Controller
                              name='dob'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                                  <ReactDatePicker
                                    selected={value ? new Date(value) : null}
                                    onChange={date => onChange(date || null)}
                                    dateFormat='dd/MM/yyyy'
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={
                                      <TextField
                                        fullWidth
                                        label='Ngày sinh'
                                        placeholder='Chọn ngày sinh'
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    }
                                  />
                                </DatePickerWrapper>
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name='year'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  onChange={e => {
                                    const value = e.target.value
                                    field.onChange(value === '' ? null : Number(value))
                                  }}
                                  value={field.value === null ? '' : field.value}
                                  fullWidth
                                  label={
                                    <div>
                                      Năm sinh <strong style={{ color: 'red' }}>*</strong>
                                    </div>
                                  }
                                  placeholder='Nhập năm sinh'
                                  variant='outlined'
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={5}>
                        <Grid container columnSpacing={5}>
                          <Grid item xs={6}>
                            <Controller
                              name='age'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  onChange={e => {
                                    console.log(control)
                                    const value = e.target.value
                                    field.onChange(value === '' ? null : Number(value))
                                  }}
                                  value={field.value === null ? '' : field.value}
                                  fullWidth
                                  label='Tuổi'
                                  placeholder='Nhập tuổi'
                                  variant='outlined'
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name='monthsOld'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  onChange={e => {
                                    const value = e.target.value
                                    field.onChange(value === '' ? null : Number(value))
                                  }}
                                  value={field.value === null ? '' : field.value}
                                  fullWidth
                                  label='Tháng tuổi'
                                  placeholder='Nhập tuổi'
                                  variant='outlined'
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={7}>
                        <Grid container spacing={5}>
                          <Grid item xs={6}>
                            <Controller
                              name='parentName'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label='Người thân'
                                  placeholder='Nhập người thân'
                                  variant='outlined'
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name='relationshipId'
                              control={control}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Autocomplete
                                  autoHighlight
                                  openOnFocus
                                  disablePortal
                                  options={relationshipData}
                                  getOptionLabel={option => option.name}
                                  value={relationshipData.find(option => option.id === value) || null}
                                  onChange={(_, newValue) => {
                                    onChange(newValue ? newValue.id : '')
                                  }}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Quan hệ'
                                      placeholder='Chọn quan hệ'
                                      InputLabelProps={{ shrink: true }}
                                      variant='outlined'
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={5}>
                        <Controller
                          name='parentPhone'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Số điện thoại'
                              placeholder='Nhập số điện thoại'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='reasonExam'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Lý do khám'
                              placeholder='Nhập lý do khám'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      {viewBhxh && (
                        <>
                          <Grid item xs={4}>
                            <Controller
                              name='bhyt1'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label='Mã BHYT'
                                  placeholder='Nhập Mã BHYT'
                                  variant='outlined'
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    maxLength: 15
                                  }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name='oldPlaceTreatmentId'
                              control={control}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Autocomplete
                                  autoHighlight
                                  openOnFocus
                                  disablePortal
                                  options={oldPlaceTreatmentData}
                                  getOptionLabel={option => option.name}
                                  value={
                                    oldPlaceTreatmentData.find((option: { id: string }) => option.id === value) || null
                                  }
                                  onChange={(event, newValue) => {
                                    onChange(newValue ? newValue.id : '')
                                  }}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Nơi khám chữa bệnh ban đầu'
                                      placeholder='Chọn loại đối tượng khám bệnh'
                                      variant='outlined'
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <FormControl>
                              <FormLabel id='demo-form-control-label-placement'>TE không thẻ</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby='demo-form-control-label-placement'
                                name='position'
                                defaultValue='top'
                                sx={{ height: '0px' }}
                              >
                                <FormControlLabel value='end' control={<Radio />} label='Không thẻ' />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name='startDate'
                              control={control}
                              render={({ field }) => (
                                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                                  <ReactDatePicker
                                    selected={field.value ? new Date(field.value) : null}
                                    dateFormat={'dd/MM/yyyy'}
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={
                                      <TextField
                                        fullWidth
                                        required
                                        label='Ngày bắt đầu'
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
                                    onChange={(date: Date) => field.onChange(date)}
                                  />
                                </DatePickerWrapper>
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name='endDate'
                              control={control}
                              render={({ field }) => (
                                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                                  <ReactDatePicker
                                    selected={field.value ? new Date(field.value) : null}
                                    dateFormat={'dd/MM/yyyy'}
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={
                                      <TextField
                                        fullWidth
                                        label='Ngày hết hạn'
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
                                    onChange={(date: Date) => field.onChange(date)}
                                  />
                                </DatePickerWrapper>
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name='fiveYearFullDate'
                              control={control}
                              render={({ field }) => (
                                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                                  <ReactDatePicker
                                    selected={field.value ? new Date(field.value) : null}
                                    dateFormat={'dd/MM/yyyy'}
                                    showMonthDropdown
                                    showYearDropdown
                                    customInput={
                                      <TextField
                                        fullWidth
                                        label='Ngày đủ 5 năm'
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
                                    onChange={(date: Date) => field.onChange(date)}
                                  />
                                </DatePickerWrapper>
                              )}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid className='frame2' item xs={6}>
                    <Grid container spacing={6}>
                      <Grid item xs={6}>
                        <Controller
                          name='patBhyt'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='QR Thẻ BHYT'
                              InputLabelProps={{ shrink: true }}
                              variant='outlined'
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <QrCodeIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        {
                          <Controller
                            name='exploreObjectsId'
                            rules={{ required: 'Đối tượng khám is required' }}
                            control={control}
                            render={({ field: { onChange, value }, fieldState }) => (
                              <Autocomplete
                                autoHighlight
                                openOnFocus
                                defaultValue={exploreObjectData[0]}
                                value={exploreObjectData.find(option => option.id === value) || null}
                                getOptionLabel={option => `${option.name}`}
                                onChange={(_, newValue) => {
                                  onChange(newValue ? newValue.id : 'EO0000002' || '')
                                  handleChangeDoiTuongKham({ target: { value: newValue } })
                                  setCurrentExploreObjectsId(newValue.id)
                                }}
                                disablePortal
                                options={exploreObjectData}
                                renderInput={params => (
                                  <TextField {...params} label='Đối tượng khám' error={!!fieldState.error} />
                                )}
                              />
                            )}
                          />
                        }
                      </Grid>
                      <Grid item xs={4}>
                        <Controller
                          name='phone'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label={
                                <div>
                                  Số điện thoại <strong style={{ color: 'red' }}>*</strong>
                                </div>
                              }
                              placeholder='Nhập số điện thoại'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                              onChange={e => {
                                const value = e.target.value
                                field.onChange(value === '' ? null : value)
                              }}
                              value={field.value === null ? '' : field.value}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Controller
                          name='patCccd'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='CCCD'
                              placeholder='Nhập CCCD'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Controller
                          name='patId'
                          control={control}
                          render={({ field: { onChange, value, ...field } }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Mã Bệnh Nhân'
                              placeholder='Nhập mã bệnh nhân'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                              value={value === null ? '' : value}
                              onChange={e => {
                                onChange(e.target.value === '' ? null : e.target.value)
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name='address'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              fullWidth
                              label='Địa chỉ'
                              placeholder='Nhập thông tin địa chỉ khách hàng'
                              variant='outlined'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name='presenterId'
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              autoHighlight
                              openOnFocus
                              getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                              onChange={(_, newValue) => {
                                onChange(newValue ? newValue.id : '')
                              }}
                              value={userDataRoleDoctor.find(option => option.id === value) || null}
                              options={userDataRoleDoctor}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Người giới thiệu'
                                  placeholder='Chọn người giới thiệu'
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name='patGroupId'
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              autoHighlight
                              openOnFocus
                              disablePortal
                              options={patGroupData}
                              getOptionLabel={option => option.name}
                              onChange={(_, newValue) => {
                                onChange(newValue ? newValue.id : '')
                              }}
                              value={patGroupData.find(option => option.id === value) || null}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  InputLabelProps={{ shrink: true }}
                                  placeholder='Chọn nhóm khách hàng'
                                  label='Nhóm khách hàng'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name='departmentId'
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              autoHighlight
                              openOnFocus
                              disablePortal
                              options={departmentDataTypePK}
                              getOptionLabel={option => option.name}
                              onChange={(_, newValue) => {
                                onChange(newValue ? newValue.id : '')
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  InputLabelProps={{ shrink: true }}
                                  placeholder='Chọn phòng khám'
                                  label='Phòng khám'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name='doctorId'
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                              autoHighlight
                              openOnFocus
                              disablePortal
                              options={userDataRoleDoctor}
                              getOptionLabel={option => `${option.fristName} ${option.lastName}`}
                              onChange={(_, newValue) => {
                                onChange(newValue ? newValue.id : '')
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  InputLabelProps={{ shrink: true }}
                                  placeholder='Chọn bác sỉ khám'
                                  label='Bác sỉ khám'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      {viewBhxh && (
                        <>
                          <Grid item xs={4}>
                            <Controller
                              name='benefitLevelId'
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  openOnFocus
                                  {...field}
                                  value={field.value || ''}
                                  onChange={(_, data) => field.onChange(data)}
                                  disablePortal
                                  options={benefitLevelData.map((option: { name: any }) => option.name)}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label={
                                        <div>
                                          Mức hưởng <strong style={{ color: 'red' }}>*</strong>
                                        </div>
                                      }
                                      placeholder='Chọn mức hưởng'
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name='glandTypeId'
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  openOnFocus
                                  {...field}
                                  value={field.value || ''}
                                  onChange={(_, data) => field.onChange(data)}
                                  disablePortal
                                  options={glandTypeData.map((option: { name: any }) => option.name)}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Loại tuyến'
                                      placeholder='Chọn loại tuyến'
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name='areaId'
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  openOnFocus
                                  {...field}
                                  value={field.value || ''}
                                  onChange={(_, data) => field.onChange(data)}
                                  disablePortal
                                  options={areaData.map((option: { name: any }) => option.name)}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label={
                                        <div>
                                          Khu vực <strong style={{ color: 'red' }}>*</strong>
                                        </div>
                                      }
                                      placeholder='Chọn khu vực'
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Controller
                              name='fromInsuranceId'
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  openOnFocus
                                  {...field}
                                  value={field.value || ''}
                                  onChange={(_, data) => field.onChange(data)}
                                  disablePortal
                                  options={fromInsuranceData.map((option: { name: any }) => option.name)}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Nơi đến từ'
                                      placeholder='Chọn nơi đến từ'
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Controller
                              name='swElseComeId'
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label='Nơi khám đến'
                                  placeholder='Chọn nơi khám đến'
                                  variant='outlined'
                                  InputLabelProps={{ shrink: true }}
                                  value={field.value || ''}
                                  onChange={e => {
                                    const value = e.target.value
                                    field.onChange(value === '' ? null : value)
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <ArrowDropDownIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              )}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      onClick={handleExpandTiepDonClick}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: '12px'
                      }}
                    >
                      <IconButton
                        aria-expanded={expanded}
                        aria-label='show more'
                        style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        sx={{
                          transition: 'transform 0.2s ease-in-out',
                          color: 'green'
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                      <Typography sx={{ color: 'green' }}>TIẾP ĐÓN</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Collapse in={expanded} timeout='auto' unmountOnExit>
                      <Grid container spacing={8}>
                        <Grid item xs={4}>
                          <Controller
                            name='body'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Toàn thân'
                                placeholder='Nhập thông tin toàn thân'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Controller
                            name='part'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Bộ phận'
                                placeholder='Nhập thông tin bộ phận'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Controller
                            name='medHistory'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Bệnh sử'
                                placeholder='Nhập thông tin bệnh sử'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name='personalMedHistory'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Tiểu sử bệnh bản thân'
                                placeholder='Nhập thông tin tiểu sử bệnh bản thân'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name='familyMedHistory'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Tiểu sử bệnh gia đình'
                                placeholder='Nhập thông tin bệnh gia đình'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name='personalAllergicHistory'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Tiểu sử bệnh dị ứng'
                                placeholder='Nhập thông tin tiểu sử bệnh dị ứng'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name='otherDisease'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label='Vấn đề khác'
                                placeholder='Nhập thông tin vấn đề khác'
                                variant='outlined'
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Grid>
                </Grid>
              </CardContent>
            </CardTemplate>
            <SurvivalCard control={control} setValue={setValue} />
            <ServiceCard
              exploreObjectsId={currentExploreObjectsId}
              selectedServices={selectedServices}
              handleSelectService={handleSelectService}
              handleUpdateService={handleUpdateService}
              handleRemoveService={handleRemoveService}
              departmentDataTypePK={departmentDataTypePK}
              handleServiceListModalOpen={() => setOpenServicesListModal(true)}
            />
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button type='submit' variant='contained' startIcon={<CloudUploadIcon />}>
                Đăng ký
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
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
        printFunctionId='pr10000004'
        printType='p_res_ex_id'
        printTypeId={resExamID}
        clinicId={getLocalstorage('userData').clinicId}
        parentClinicId={getLocalstorage('userData').parentClinicId}
        openPrint={print}
        setOpenButtonDialog={setPrint}
        titlePrint='In Phiếu đăng kí khám'
      />
    </>
  )
}

export default RegExaminationTab
