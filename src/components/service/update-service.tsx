import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import TabContext from '@mui/lab/TabContext'
import styles from './add-new-service.module.scss'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Tab,
  TextField,
  IconButton,
  inputAdornmentClasses,
  Typography,
  styled,
  List
} from '@mui/material'
import Switch from '@mui/material/Switch'
import MuiDialogContent from './components/diaglogContent'
import TabPanel from '@mui/lab/TabPanel'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_SERVICE_TYPE,
  GET_SERVICE_GROUP,
  GET_SERVICE_INDEX,
  GET_INDEX_TYPE,
  GET_SERVICE_INDEX_PROCS,
  GET_CONSUM_PRODUCT,
  GET_PRODUCT,
  GET_UNIT,
  GET_COM_REFER_VALUE,
  GET_SERVICE_EXAMPLE_VALUE,
  GET_DEPARTMENT
} from './graphql/query'
import MUIDialog from 'src/@core/components/dialog'
import UpdateServiceIndex from './update-service-index'
import {
  TabListWrapper,
  TinyButton,
  StyledRequiredTextField,
  VisuallyHiddenInput,
  GreyDataGrid
} from './components/custom-mui-component'
import MuiSelect from 'src/@core/components/mui/select'
import { DataGrid, GridColDef, bgBG } from '@mui/x-data-grid'
import ActivityTag from './components/activity-tag'
import UpdateServiceGroup from './update-service-group'
import UpdateComparisonReferenceValue from './update-comparison-reference-value'
import { ServiceInput, ServiceUpdate, ServiceIndexInput, IndexProp, ConSumUpdate, CanSale } from './graphql/variables'
import toast from 'react-hot-toast'
import {
  UPDATE_SERVICE,
  ADD_SERVICE,
  ADD_SERVICE_INDEX,
  UPDATE_SERVICE_INDEX,
  UPDATE_SERVICE_INDEX_PROC,
  ADD_SERVICE_INDEX_PROC,
  UPDATE_MANY_CONSUM_PRODUCT,
  ADD_CONSUM_VALUE,
  UPDATE_CONSUM_PRODUCT,
  UPDATE_COMREFER_VALUE,
  UPDATE_SERVICE_EXAMPLE_VALUE
} from './graphql/mutation'
import { getGenderCode, getGenderFromNumToFrom } from './hook/valiGender'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { signal } from '@preact/signals'
import { dialogType } from './index'
import { formatVND } from 'src/utils/formatMoney'

// ** Next Import
import { wrapperStyle,toolbarStyle } from './styles'
import UpdateServiceExampleValue from './update-service-example'
import { id } from 'date-fns/locale'


export type ModalProps = {
  onCloseDialog: () => void
}

interface IServiceOption {
  id: string
  label: string
}
type Props = {
  data?: any
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

const unitType = ['gói', 'hộp']
const dataUs = getLocalstorage('userData')

export const dialogTypeProc = signal<'addProc' | 'updateProc'>('addProc')


const initServiceIndex: ServiceIndexInput = {
  //id: '',
  name: '',
  normalIndex: true,
  fatherIndex: null,
  subIndex: null,
  indexTypeId: '',
  referenceValue: '',
  defaultValue: '',
  price: 0,
  cost: 0,
  unit: '',
  testers: '',
  clinicId: dataUs?.clinicId,
  parentClinicId: dataUs?.parentClinicId,
  deleteYn: false,
  serviceId: '',
}

const UpdateService = (props: Props) => {
  const { data, open, onSubmit } = props
  const { control } = useForm({ defaultValues: initServiceIndex })

  const { serviceType, serviceGroup, label, ...dataWithoutName } = data

  const [input, setInput] = useState<ServiceUpdate>({
    ...dataWithoutName,
    clinicId: dataUs?.clinicId,
    parentClinicId: dataUs?.parentClinicId,
    index: undefined,
    __typename: undefined
  })

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const theme = useTheme()
  const [show, setShow] = useMemo(() => open, [open])
  const [error, setError] = useState(false)
  const [serviceIndexList, setServiceIndexList] = useState<any[]>([])
  const [SGdata, setSGdata] = useState<any>()
  const [dataComrefer,setDataUpdateComrefer]=useState<any>()
  const [dataServiceExample,setDataServiceExample]=useState<any>()
  const [dialogTypeOfComreferValue,setDialogTypeofComreferValue]=useState('')
  const [dialogRSType,setDialogRSType]=useState('')


  //lấy data
  const { data: serviceTypeData } = useQuery(GET_SERVICE_TYPE)
  const { data: serviceGroupData, refetch: refentchServiceGroup } = useQuery(GET_SERVICE_GROUP)
  const { data: dataIndex, loading } = useQuery(GET_SERVICE_INDEX, {
    variables: {
      input: {
        serviceId: { eq: input?.id },
        deleteYn: { eq: false }
      }
    }
  })
  const { data: dataIndexType } = useQuery(GET_INDEX_TYPE)
  const { data: dataIndexProc, refetch: refetchIndexProcs } = useQuery(GET_SERVICE_INDEX_PROCS, {
    variables: {
      input: {
        serviceId: { eq: input?.id },
        deleteYn: { eq: false },
      }
    }
  })
  const { data: dataConSumProduct, refetch: refetchconsum } = useQuery(GET_CONSUM_PRODUCT, {
    variables: {
      input: {
        serviceId: { eq: input?.id },
        deleteYn: { eq: false }
      }
    }
  })

  const { data: dataProduct, refetch: refetchProductdata } = useQuery(GET_PRODUCT, {
    variables: {
      input: {
        deleteYn: { eq: false }
      }
    }
  })

  const {data:dataExample,refetch:refetchdataExample}=useQuery(GET_SERVICE_EXAMPLE_VALUE,{
    variables:{
      input:{
        deleteYn:{eq:false},
        serviceId:{eq:input?.id}
      }
    }
  })

  const {data:getDataDepartment,refetch:refetchDepartment}=useQuery(GET_DEPARTMENT)

  const dataDepartment=useMemo(()=>getDataDepartment?.getDepartment?.items ?? [],[getDataDepartment])

  const {data:dataUnit,refetch:refetchUnit}=useQuery(GET_UNIT)

  const unitData=useMemo(()=>dataUnit?.getUnit?.items ?? [],[dataUnit])

  const dataProcbyId = useMemo(() => dataIndexProc?.getServiceIndexProc?.items ?? [], [dataIndexProc])

  const ConSumProductData = useMemo(() => dataConSumProduct?.getConsumProduct?.items ?? [], [dataConSumProduct])

  const dataProcIndex = dataProcbyId.find((x: any) => x.serviceId === input?.id)?.serviceIndex

  const serviceGroups = useMemo(() => serviceGroupData?.getServiceGroup.items ?? [], [serviceGroupData])

  const serviceTypes = useMemo(() => serviceTypeData?.getServiceType?.items ?? [], [serviceTypeData])

  const indexDataType = useMemo(() => dataIndexType?.getIndexType?.items ?? [], [dataIndexType])

  const productList = useMemo(() => dataProduct?.getProduct?.items ?? [], [dataProduct])

  const dataServiceExampleValue=useMemo(()=>dataExample?.getServiceExampleValue?.items?? [],[dataExample])

  const [serviceTypeValue, setServiceTypeValue] = useState<null | IServiceOption>(null)

  const [serviceGroupValue, setServiceGroupValue] = useState<null | IServiceOption>(null)

  const [conSumUpdate, setConSumUpdate] = useState<ConSumUpdate[]>(ConSumProductData)

  const [inputDataIndex, setInputDataIndex] = useState<ServiceIndexInput>({
    ...initServiceIndex,
    id: dataProcIndex?.id ? dataProcIndex?.id : undefined,
    serviceId: input?.id,
    indexTypeId: dataProcIndex?.indexTypeId ? dataProcIndex?.indexTypeId : '',
    defaultValue: dataProcIndex?.defaultValue ? dataProcIndex?.defaultValue : '',
    testers: dataProcIndex?.testers ? dataProcIndex?.testers : '',
    referenceValue: dataProcIndex?.referenceValue ? dataProcIndex?.referenceValue : '',
    unit: dataProcIndex?.unit ? dataProcIndex?.unit : ''
  })

  // open/close toggle
  const openComparisonReference= useState(false)
  const openAddServiceIndex = useState(false)
  const openAddResultSample=useState(false)

  const genders = ['Nam', 'Nữ']
  const [inputProp, setInputProp] = useState<any>()
  const [gender, setGender] = useState(genders[0])
  const [tab, setTab] = useState('1')
  const [decimalNumber, setDecimalNumber] = useState(0)
  const [chooseConsumeGoods, setChooseConsumeGoods] = useState(ConSumProductData.length > 0 ? true : false)
  const [chooseSpec,setChooseSpec]=useState(input?.chooseSpecIndex)
  const [isChecked, setIsChecked] = useState<boolean>(input?.status ?? false)
  const openAddSG = useState(false)


  // sử dụng mutation để cập nhật dữ liệu
  // ====Update mutation====
  const [updateService] = useMutation(UPDATE_SERVICE)
  const [updateServiceIndexProc] = useMutation(UPDATE_SERVICE_INDEX_PROC)
  const [updateServiceIndex] = useMutation(UPDATE_SERVICE_INDEX)
  const [updateManyConsumProduct] = useMutation(UPDATE_MANY_CONSUM_PRODUCT)
  const [updateConSumProduct] = useMutation(UPDATE_CONSUM_PRODUCT)
  const [updateComReferValue] = useMutation(UPDATE_COMREFER_VALUE)
  const [updateServiceExampleVlue]=useMutation(UPDATE_SERVICE_EXAMPLE_VALUE)


  // ====Add mutation====
  const [addService, { data: addData, loading: addLoading, error: addError }] = useMutation(ADD_SERVICE)
  const [addServiceIndexProc, { data: addServiceIndexPropData, loading: addServiceIndexPropLoading, error: addServiceIndexPropError }] = useMutation(ADD_SERVICE_INDEX_PROC)
  const [addServiceIndex, { data: addDataIndex, loading: addIndexLoading, error: addIndexError }] = useMutation(ADD_SERVICE_INDEX)
  const [addConSumProduct, { loading: addConSumLoading }] = useMutation(ADD_CONSUM_VALUE)



  const { data: comReferData, refetch: refetchComrefervalue } = useQuery(GET_COM_REFER_VALUE,{
    variables:{
      input:{
        deleteYn: { eq: false },
        serviceIndexId : {eq:inputDataIndex?.id}
      }
    }
  })

  const comReferValues = useMemo(() => comReferData?.getComReferValue?.items ?? [], [comReferData])

  const handleAddServiceIndex = () => {
    setInputProp({
      name: input?.name,
      serviceId: input?.id,
      clinicId: dataUs.clinicId,
      parentClinicId: dataUs.parentClinicId,
      deleteYn: false,
      normalIndex: true,
      subIndex: null,
      fatherIndex: null
    })
    openAddServiceIndex[1](true)
    dialogTypeProc.value = 'addProc'
  }

  const handleUpdate = (data: any) => {
    setInputProp({
      ...inputProp,
      name: data?.service?.name,
      id: data?.serviceIndexId,
      indexTypeId: data?.serviceIndex?.indexTypeId,
      referenceValue:data?.serviceIndex?.referenceValue,
      defaultValue: data?.serviceIndex?.defaultValue,
      cost: data?.serviceIndex?.cost,
      price: data?.serviceIndex?.price,
      unit: data?.serviceIndex?.unit,
      testers: data?.serviceIndex?.testers,
      normalIndex: data?.serviceIndex?.normalIndex,
      subIndex: data?.serviceIndex?.subIndex,
      fatherIndex: data?.serviceIndex?.fatherIndex,
      serviceId: data?.serviceId,
      rowIndex: data?.index
    })
    dialogTypeProc.value = 'updateProc'
    openAddServiceIndex[1](true)
  }

  const QuantityRemaining = ((arr: CanSale[]) => {
    if (arr && arr.length > 0) {
      for (let i = 0; i <= arr.length; i++) {
        let totalcountRemaining = 0
        return totalcountRemaining += arr[i]?.totalRemaining
      }
    } else {
      return 0
    }
  })

  const handleDeleteServiceExampleValue=useCallback((data:any)=>{
    updateServiceExampleVlue({
      variables:{
        input:JSON.stringify({
          id:data?.id,
          deleteYn:true
        })
      }
    }).then(refetchdataExample)
  },[updateServiceExampleVlue,refetchdataExample])

  const handleDelete = useCallback(
    (data: any) => {
      updateServiceIndexProc({
        variables: {
          input: JSON.stringify({
            id: data?.id,
            serviceId: data?.serviceId,
            serviceIndexId: data?.serviceIndexId,
            deleteYn: true
          })
        }
      }).then(refetchIndexProcs)

    },
    [updateServiceIndexProc, refetchIndexProcs]
  )

  const handleConsumChange = (key: any, newValue: any, consumId: any) => {
    const index = conSumUpdate.findIndex((x: any) => x.id === consumId)
    const cloneData = [...conSumUpdate]
    cloneData[index] = {
      ...cloneData[index],
      [key]: newValue,
      deleteYn: false,
      clinicId: dataUs.clinicId,
      parentClinicId: dataUs.parentClinicId
    }
    setConSumUpdate(cloneData)
  }
  const handleChange = (key: string, newValue: any) => {
    setInput({
      ...input,
      [key]: newValue
    })
  }

  const handleChangeValidate = (key: string, newValue: any) => {
    if (key && newValue === "") {
      setError(true)
    } else {
      setError(false)
    }
    setInput({
      ...input,
      [key]: newValue
    })
  }


  const handleChangeIndex = (key: string, newValue: any) => {
    setInputDataIndex({
      ...inputDataIndex,
      [key]: newValue
    })
  }
  
  const handleItemSelected = useCallback((value: any) => {
    const dataUpdateConSum = {
      name: value?.productName,
      productId: value?.id,
      unit: value?.unit?.name,
      serviceId: input?.id,
      quantity: QuantityRemaining(value?.cansales)?.toString(),
      clinicId: dataUs.clinicId,
      parentClinicId: dataUs.parentClinicId,
      deleteYn: false
    }
    if (dataUpdateConSum.name !== undefined) {
      addConSumProduct({
        variables: {
          input: dataUpdateConSum
        }, onError: () => { toast.error('Lỗi Khi Thêm Sản Phẩm') }
        , onCompleted: async () => {
          await refetchconsum()
          toast.success('Thêm Thành Công')

        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addConSumProduct, refetchconsum, input.id, dataConSumProduct?.name])

  const handleDeleteConSumProDuct = useCallback((id: string) => {
    updateConSumProduct({
      variables: {
        input: JSON.stringify({
          id: id,
          deleteYn: true
        })
      }
    }).then(refetchconsum)
  }, [updateConSumProduct, refetchconsum])

  const handleChangePositionIndex = (direction: 'up' | 'down', index: any, data: any) => {
    setServiceIndexList((prev: any) => {
      if (index === 1 && direction === 'up') return prev
      if (index === dataProcbyId.length && direction === 'down') return prev
      //  index is 0 based
      if (direction === 'up') {
        const prevEl = prev[index - 2]
        const prevElIndex = prev.findIndex((item: any) => item.id === prevEl.id)
        const currentEl = prev[index - 1]
        const currentElIndex = prev.findIndex((item: any) => item.id === currentEl.id)
        const copyServiceIndex = [...prev]
        copyServiceIndex[prevElIndex] = currentEl
        copyServiceIndex[currentElIndex] = prevEl
        return copyServiceIndex
      }
      const currentEl = prev[index - 1]
      const currentElIndex = prev.findIndex((item: any) => item.id === currentEl.id)
      const afterEl = prev[index]
      const afterElIndex = prev.findIndex((item: any) => item.id === afterEl.id)
      const copyServiceIndex = [...prev]
      copyServiceIndex[currentElIndex] = afterEl
      copyServiceIndex[afterElIndex] = currentEl
      return copyServiceIndex
    })
  }

  const handleOpenAddRef=(()=>{
    setDataUpdateComrefer({
      serviceIndexId:inputDataIndex.id,
      greatestValue: 0,
      smallestValue: 0,
      allAge: true,
      allgender: true
    })
    openComparisonReference[1](true)
    setDialogTypeofComreferValue('add')
  })

  
  const handleOpenUpdateComFerValue = ((data: any) => {
    setDataUpdateComrefer({
      male: data.male,
      female: data.female,
      allgender: data.gender,
      id: data.id,
      allAge: data.allAge,
      fromAge: data.fromAge,
      toAge: data.toAge,
      greatestValue: data.greatestValue,
      smallestValue: data.smallestValue
    })
    openComparisonReference[1](true)
    setDialogTypeofComreferValue('update')
  })

  const handleDeleteComFerValue = useCallback((data: any) => {
    updateComReferValue({
      variables: {
        input: JSON.stringify({
          id: data.id,
          deleteYn: true
        })
      }
    }).then(refetchComrefervalue)
  }, [updateComReferValue, refetchComrefervalue])
  // TODO: wait database change the field name

  const COLUMN_DEF_SERVICE_COMREFER: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 132,
      field: 'index',
      maxWidth: 150,
      headerName: '#'
    },

    {
      flex: 0.25,
      minWidth: 334,
      field: 'male',
      headerName: 'Giới tính',
      maxWidth: 350,
      renderCell(params) {
        let gender = ""
        if (params.value) {
          gender = "Nam"
        } else {
          if (params.row?.female) {
            gender = "Nữ"
          } else {
            gender = "Tất cả"
          }
        }
        return (
          <span>{gender}</span>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 285,
      field: 'allAge',
      maxWidth: 25,
      headerName: 'Độ tuổi',
      renderCell(params) {
        let isAllage = ""
        if (params.value) {
          isAllage = "Tất cả độ tuổi"
        } else {
          isAllage = "Giới hạn"
        }
        return (
          <span>{isAllage}</span>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 243,
      field: 'smallestValue',
      maxWidth: 245,
      headerName: 'Gt nhỏ nhất'
    },
    {
      flex: 0.15,
      minWidth: 243,
      field: 'greatestValue',
      maxWidth: 245,
      headerName: 'Gt lớn nhất'
      // valueGetter: params => params.row.serviceGroup.label
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: (params) => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'

            onClick={() => {
              handleOpenUpdateComFerValue(params.row);
            }}
          >
            <Icon icon='bx:edit-alt' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton title='Xoá'
            onClick={() => {
              handleDeleteComFerValue(params.row);
            }}>
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]

  const COLUMN_DEF_SERVICE_INDEX: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      maxWidth: 100,
      field: 'index',
      headerName: '#',
      renderCell: params => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '10%' }}>
          <span>{params.value}</span>
          <div style={{ display: 'flex' }}>
            <Box>
              {params.value !== 1 && (
                <IconButton
                  size='small'
                  title='Thay đổi thứ tự'
                  onClick={() => {
                    handleChangePositionIndex('up', params.value, params.row)
                  }}
                >
                  <Icon color={theme.palette.success.main} icon='bx:up-arrow-alt' fontSize={22} />
                </IconButton>
              )}
            </Box>
            <Box>
              {params.value !== serviceIndexList.length ? (
                <IconButton
                  size='small'
                  title='Thay đổi thứ tự'
                  onClick={() => {
                    handleChangePositionIndex('down', params.value! as number, params.row)
                  }}
                >
                  <Icon color={theme.palette.success.main} icon='bx:down-arrow-alt' fontSize={22} />
                </IconButton>
              ) : (
                <p>&nbsp;</p>
              )}
            </Box>
          </div>
        </div>
      )
    },

    {
      flex: 0.1,
      minWidth: 180,
      field: 'id',
      headerName: 'Mã chỉ số',
      maxWidth: 220,
      valueGetter: params => params?.row?.serviceIndex?.id
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'name',
      headerName: 'Tên dịch vụ',
      maxWidth: 220,
      valueGetter: params => params?.row?.service?.name
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'serviceIndex',
      maxWidth: 200,
      headerName: 'Loại chỉ số',
      renderCell(params) {
        const indexTypeValue = params.value
        let indexType = ''
        if (indexTypeValue.normalIndex && !indexTypeValue.fatherIndex && !indexTypeValue.subIndex) {
          indexType = 'Chỉ Số Thường'
        }
        if (!indexTypeValue.normalIndex && indexTypeValue.fatherIndex && !indexTypeValue.subIndex) {
          indexType = 'Chỉ Số Cha'
        }
        if (!indexTypeValue.normalIndex && !indexTypeValue.fatherIndex && indexTypeValue.subIndex) {
          indexType = 'Chỉ Số Con'
        }
        return (
          <ActivityTag
            type={
              params.value.normalIndex
                ? 'success'
                : params.value.subIndex
                  ? 'warning'
                  : params.value.fatherIndex
                    ? 'primary'
                    : undefined
            }
          >
            {indexType}
          </ActivityTag>
        )
      },
      valueGetter: params => params.row.serviceIndex
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'serviceIndex.indexType.name',
      headerName: 'Kiểu Chỉ Số',
      maxWidth: 200,
      valueGetter: params => params?.row?.serviceIndex?.indexType?.name
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'cost',
      headerName: 'Giá Vốn',
      maxWidth: 200,
      valueGetter: params => params?.row?.serviceIndex?.cost
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'price',
      headerName: 'Giá Bán',
      maxWidth: 200,
      valueGetter: params => params?.row?.serviceIndex?.price
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'unit',
      headerName: 'Đơn Vị Tính',
      maxWidth: 200,
      valueGetter: params => params?.row?.serviceIndex?.unit
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 100,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton title='Chỉnh sửa' onClick={() => handleUpdate(params?.row)}>
            <Icon icon='bx:edit-alt' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton
            title='Xoá'
            onClick={() => {
              handleDelete(params?.row)

            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]

  const COLUMN_DEF_CONSUME_GOODS: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 10,
      maxWidth: 50,
      field: 'index',
      headerName: '#'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: 'Tên',
      maxWidth: 300
    },
    {
      flex: 0.25,
      minWidth: 300,
      field: 'unit',
      headerName: 'Đơn Vị Tính',
      maxWidth: 300,
      renderCell(params) {
        const defaultunit = params.value
        const consumId = params.row.id
        return (
          <Autocomplete
            autoHighlight
            openOnFocus
            sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            options={unitType}
            //defaultValue={unitType.find((x:any)=>x===defaultunit)}
            defaultValue={defaultunit}
            onInputChange={(_, newInputValue) => {
              handleConsumChange('unit', newInputValue, consumId)
            }}
            renderInput={params => (
              <TextField
                {...params}
                required
                sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
            )}
          />
        )

      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'quantity',
      maxWidth: 400,
      headerName: 'Số lượng',
      renderCell: params => {
        const consumId = params.row.id
        return (
          <Stack direction='row' justifyContent='spacing-between' gap={4}>
            <TextField type='number' defaultValue={params.value} onChange={e => handleConsumChange('quantity', e.target.value, consumId)} />
            <Button>
              <Icon icon='bx:bx-trash' fontSize={30} style={{ marginRight: 5 }} color='red' onClick={e => handleDeleteConSumProDuct(consumId)} />
            </Button>
          </Stack>
        )
      }
    }
  ]

  const COLUMN_DEF_RESULT_SAMPLE: GridColDef[]= [
    {
      minWidth: 10,
      maxWidth: 50,
      field: 'index',
      headerName: '#'  
    },
    {
      minWidth: 50,
      width:500,
      field: 'name',
      headerName: 'Tên Mẫu Kết Quả'  
    },
    {
      minWidth: 50,
      width: 700,
      field: 'description',
      headerName: 'Kết Luận'  
    },
    {
      field: '',
      minWidth: 100,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton title='Chỉnh sửa' onClick={() => handleUpdateRS(params?.row)}>
            <Icon icon='bx:edit-alt' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton
            title='Xoá'
            onClick={() => {
              handleDeleteServiceExampleValue(params?.row)

            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]

  const handleOpenAddRS=(()=>{
    setDataServiceExample({
      serviceId:input?.id,
      deleteYn:false,
      clinicId:dataUs.clinicId,
      parentClinicId:dataUs.parentClinicId
    })
    openAddResultSample[1](true)
    setDialogRSType('add')
  })

  const handleUpdateRS=((data:any)=>{
    setDataServiceExample(data)
    openAddResultSample[1](true)
    setDialogRSType('update')
  })

  function validateServiceType(input: any): any {
    if (input === null || input === undefined) {
      return data?.serviceType?.id
    }
    return serviceTypeValue?.id
  }
  function validateServiceGroup(input: any): any {
    if (input === null || input === undefined) {
      return data?.serviceGroup?.id
    }
    return serviceGroupValue?.id
  }

  useEffect(() => {
    setInput(prevInputService => ({
      ...prevInputService,
      serviceTypeId: validateServiceType(serviceTypeValue?.id),
      serviceGroupId: validateServiceGroup(serviceGroupValue?.id),
      gender: +getGenderCode(gender)
    }))
    setInputDataIndex(prevInputServiceIndex => ({
      ...prevInputServiceIndex,
      id: dataProcIndex?.id ? dataProcIndex?.id : undefined,
      serviceId: input?.id,
      indexTypeId: dataProcIndex?.indexTypeId ? dataProcIndex?.indexTypeId : '',
      defaultValue: dataProcIndex?.defaultValue ? dataProcIndex?.defaultValue : '',
      referenceValue: dataProcIndex?.referenceValue ? dataProcIndex?.referenceValue : '',
      unit: dataProcIndex?.unit ? dataProcIndex?.unit : '',
      testers: dataProcIndex?.testers ? dataProcIndex?.testers : '',
    }))
    setServiceIndexList(dataProcbyId)
    //setConSumUpdate(ConSumProductData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceTypeValue, serviceGroupValue, gender, getGenderCode, isChecked, dataProcIndex, dataProcbyId])

  
  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật dịch vụ')
  }, [])

  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  const onCompleted = useCallback(() => {
    refetchIndexProcs()
    toast.success('Cập nhật dịch vụ thành công')
    if (onSubmit) onSubmit()
    handleClose()
  }, [handleClose, onSubmit, refetchIndexProcs])

  const submit = useCallback(() => {
    if (!input?.serviceTypeId || input?.serviceTypeId === '') {
      toast.error('Vui Lòng Chọn Loại Dịch Vụ')
      return
    }
    if (!input?.serviceGroupId || input?.serviceGroupId === '') {
      toast.error('Vui Lòng Chọn Nhóm Dịch Vụ')
      return
    }
    if (!input?.name || input?.name === '') {
      toast.error('Vui Lòng Nhập Tên Dịch Vụ')
      return
    }
    if (dialogType.value === 'add') {
      if (input?.serviceTypeId === 'SRT00016') {
        if (!inputDataIndex?.indexTypeId || inputDataIndex?.indexTypeId === '') {
          toast.error('Kiễu Dữ Liệu Không Được Để Trống')
          return
        }
        addService({
          variables: {
            input: {
              ...input
            }
          }
        }).then((res: any) => {
          addServiceIndex({
            variables: {
              input: {
                ...inputDataIndex,
                serviceId: res.data.addService?.id,
                rowIndex: 1
              }
            }
          }).then((res: any) => {
            addServiceIndexProc({
              variables: {
                input: {
                  serviceId: res?.data?.addServiceIndex?.serviceId,
                  serviceIndexId: res?.data?.addServiceIndex?.id,
                  deleteYn: false,
                  clinicId: dataUs.clinicId,
                  parentClinicId: dataUs.parentClinicId
                }
              },
              onError,
              onCompleted
            })
          })
        })
      } else {
        addService({
          variables: {
            input: input
          },
          onError,
          onCompleted
        })
      }
    } else {
      if (input?.serviceTypeId === 'SRT00016') {
        if (!inputDataIndex.id || inputDataIndex.id === '') {
          if (!inputDataIndex?.indexTypeId || inputDataIndex?.indexTypeId === '') {
            toast.error('Kiễu Dữ Liệu Không Được Để Trống')
            return
          }
          updateService({
            variables: {
              input: JSON.stringify(input)
            }
          }).then(() => {
            addServiceIndex({
              variables: {
                input: {
                  ...inputDataIndex,
                  rowIndex: 1
                }
              }
            }).then((res: any) => {
              addServiceIndexProc({
                variables: {
                  input: {
                    serviceId: input?.id,
                    serviceIndexId: res?.data?.addServiceIndex?.id,
                    deleteYn: false,
                    clinicId: dataUs.clinicId,
                    parentClinicId: dataUs.parentClinicId
                  }
                },
                onError,
                onCompleted
              }).then(() => {
                const update = conSumUpdate.map(e => {
                  return {
                    id: e.id,
                    unit: e.unit,
                    quantity: e.quantity
                  }
                })
                if (chooseConsumeGoods === true && conSumUpdate.length > 0) {
                  updateManyConsumProduct({
                    variables: {
                      input: JSON.stringify(update)
                    }
                  })
                }
              })
            })
          })
        } else {
          if (!inputDataIndex?.indexTypeId || inputDataIndex?.indexTypeId === '') {
            toast.error('Kiễu Dữ Liệu Không Được Để Trống')
            return
          }
          updateService({
            variables: {
              input: JSON.stringify(input)
            }
          }).then(() => {
            updateServiceIndex({
              variables: {
                input: JSON.stringify(inputDataIndex)
              }
            }).then((res: any) => {
              updateServiceIndexProc({
                variables: {
                  input: JSON.stringify({
                    id: dataProcbyId.find((x: any) => x.serviceId === input?.id)?.id,
                    serviceId: input?.id,
                    serviceIndexId: res?.data?.updateServiceIndex?.id,
                    deleteYn: false,
                    clinicId: dataUs.clinicId,
                    parentClinicId: dataUs.parentClinicId
                  })
                },
                onError,
                onCompleted
              }).then(() => {
                const update = conSumUpdate.map(e => {
                  return {
                    id: e.id,
                    unit: e.unit,
                    quantity: e.quantity
                  }
                })
                if (chooseConsumeGoods === true && conSumUpdate) {
                  updateManyConsumProduct({
                    variables: {
                      input: JSON.stringify(update)
                    }
                  })
                }
              })
            })
          })
        }
      } else {
        updateService({
          variables: {
            input: JSON.stringify(input)
          }, onError,
          onCompleted
        }).then(() => {
          const update = conSumUpdate.map(e => {
            return {
              id: e.id,
              unit: e.unit,
              quantity: e.quantity
            }
          })
          if (chooseConsumeGoods === true && conSumUpdate.length > 0) {
            updateManyConsumProduct({
              variables: {
                input: JSON.stringify(update)
              },
              onError,
              onCompleted
            })
          }
        })
      }
    }
  }, [
    chooseConsumeGoods,
    addService,
    updateService,
    input,
    dataProcbyId,
    onError,
    onCompleted,
    addServiceIndex,
    addServiceIndexProc,
    updateServiceIndex,
    updateServiceIndexProc,
    updateManyConsumProduct,
    inputDataIndex,
    conSumUpdate
  ])

  return (
    <MuiDialogContent
      onClose={() => {
        setShow(false)
      }}
      onSubmit={submit}
      dialogActionsStyles={{ justifyContent: 'flex-end' }}
      dialogActionsConfirm={
        <>
          <Icon icon='bx:save' />
          Lưu
        </>
      }
      dialogActionsCancel={
        <>
          <Icon icon='bx:x' />
          Đóng
        </>
      }
    >
      <>
        <TabContext value={tab}>
          <Box>
            {/* Tab Header */}
            <Box sx={{ width: '90%', borderBottom: `2px solid ${theme.palette.primary.main}` }}>
              <TabListWrapper onChange={(e, newValue) => setTab(newValue)}>
                <Tab key='1' label='Thông tin dịch vụ' value='1' />
                {inputDataIndex.id !== undefined && input.serviceTypeId==='SRT00016' && <Tab key='2' label='Chỉ số' value='2' />}
                {input?.id !== undefined &&(
                  <Tab key='5' label='Mẫu kết quá' value='5' />
                )}
                {chooseConsumeGoods && input.id !== undefined && <Tab key='3' label='Hàng hóa tiêu hao' value='3' />}
                <Tab key='4' label='Mẫu in kết quá' value='4' />
              </TabListWrapper>
            </Box>
            {/* End Tab   Header */}
            <Box sx={{ mt: 8 }}>
              <TabPanel value='1'>
                <Grid container spacing={4}>
                  <Grid item xs={2.5}>
                    <MuiSelect
                      notched={input?.serviceTypeId ? true : false}
                      fullWidth
                      label='Loại Dịch Vụ'
                      data={serviceTypes}
                      value={input?.serviceTypeId}
                      onChange={e => {
                        handleChange('serviceTypeId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={2.5}>
                    <Stack direction='row'>
                      <MuiSelect
                        notched={input?.serviceGroupId ? true : false}
                        fullWidth
                        label='Nhóm dịch vụ'
                        required
                        data={serviceGroups}
                        value={input?.serviceGroupId}
                        onChange={e => {
                          handleChange('serviceGroupId', e.target.value)
                        }}
                      />
                      <TinyButton onClick={() => openAddSG[1](true)} variant='contained' color='primary' size='medium'>
                        <Icon icon='bx:plus' fontSize={22} />
                      </TinyButton>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Autocomplete
                      fullWidth
                      defaultValue={getGenderFromNumToFrom(input?.gender)}
                      /*  value={getGenderFromNumToFrom(input?.gender)} */
                      onInputChange={(_, newInputValue) => {
                        setGender(newInputValue || genders[0])
                      }}
                      options={genders}
                      disablePortal
                      renderInput={params => <StyledRequiredTextField {...params} required label='Giới tính' />}
                    />
                  </Grid>
                  <Grid container item xs={5}>
                    <Grid item xs={3}>
                      <FormGroup>
                        <FormControlLabel
                          labelPlacement='top'
                          control={
                            <Switch
                              defaultChecked={input.status}
                              onChange={(e, checked) => {
                                handleChange('status', checked)
                              }}
                            />
                          }
                          label='Trạng thái'
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={3}>
                      <FormGroup>
                        <FormControlLabel
                          labelPlacement='top'
                          control={
                            <Switch
                              defaultChecked={input?.argeeBhyt}
                              onChange={(e, checked) => {
                                handleChange('argeeBhyt', checked)
                              }}
                            />
                          }
                          label='BHYT'
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={3}>
                      <FormGroup>
                        <FormControlLabel
                          labelPlacement='top'
                          control={<Switch size='medium' sx={{ m: 1 }} defaultChecked />}
                          label='Kết nối LIS'
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={3}>
                      <FormGroup>
                        <FormControlLabel
                          labelPlacement='top'
                          control={
                            <Switch
                              defaultChecked={input?.groupSubclinical}
                              onChange={(e, checked) => {
                                handleChange('groupSubclinical', checked)
                              }}
                            />
                          }
                          label='Chỉ Số Gộp'
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid marginTop={2} container spacing={3}>
                  <Grid item xs={1.5}>
                    <TextField
                      label='Mã dịch vụ'
                      disabled
                      defaultValue={input.id}
                      onBlur={e => handleChange('id', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <StyledRequiredTextField
                      required
                      label='Tên dịch vụ'
                      style={{ width: '100%' }}
                      defaultValue={input.name}
                      error={error}
                      helperText={error ? "Tên dịch vụ không được để trống" : ""}
                      onBlur={e => {
                        handleChangeValidate('name', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <MuiSelect
                      notched={input?.unitId ? true : false}
                      fullWidth
                      label='Đơn Vị Tính'
                      data={unitData}
                      value={input?.unitId}
                      onChange={e => {
                        handleChange('unitId', e.target.value)
                      }}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <TextField
                      label='Giá vốn'
                      value={input?.cost}
                      onChange={e => handleChange('cost', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={1.5}>
                    <TextField
                      label='Giá dịch vụ'
                      value={input?.price}
                      onChange={e => handleChange('price', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <MuiSelect
                        notched={input?.departmentId ? true : false}
                        fullWidth
                        label='Phòng Ban'
                        data={dataDepartment}
                        value={input?.departmentId}
                        onChange={e => {
                          handleChange('departmentId', e.target.value)
                        }}
                      />
                  </Grid>
                </Grid>
                {/* BHYT */}
                {input?.argeeBhyt && (
                  <Grid container marginTop={4} spacing={3}>
                    <Grid item xs={2}>
                      <TextField
                        label='Mã BHYT'
                        defaultValue={input?.bhytId}
                        onBlur={e => {
                          handleChange('bhytId', e.target.value)
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        required
                        label='Tên BHYT'
                        style={{ width: '100%' }}
                        defaultValue={input?.bhytName}
                        onBlur={e => {
                          handleChange('bhytName', e.target.value)
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label='Tỉ lệ thanh toán BHYT'
                        defaultValue={input?.insurancePaymentRate}
                        onBlur={e => {
                          handleChange('insurancePaymentRate', parseFloat(e.target.value))
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label='Đơn giá BHYT'
                        defaultValue={input?.bhytPrice}
                        onBlur={e => {
                          handleChange('bhytPrice', parseFloat(e.target.value))
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label='Giá phụ thu'
                        defaultValue={input?.surchargePrice}
                        onBlur={e => {
                          handleChange('surchargePrice', parseFloat(e.target.value))
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                {input?.serviceTypeId === 'SRT00016' && (
                  <Grid marginTop={4} container spacing={3}>
                    <Grid item xs={3}>
                      <Stack direction='row'>
                        <TextField
                          fullWidth
                          label='Giá Trị Tham Chiếu'
                          placeholder='Giá Trị Tham Chiếu'
                          defaultValue={inputDataIndex?.referenceValue}
                          onBlur={e=>{handleChangeIndex('referenceValue',e.target.value)}}
                        />
                        <TinyButton variant='contained' color='primary' size='medium' onClick={handleOpenAddRef} disabled={dialogType.value==='add'?true:false}>
                          <Icon icon='bx:plus' fontSize={22} />
                        </TinyButton>
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <MuiSelect
                        notched={inputDataIndex?.indexTypeId ? true : false}
                        fullWidth
                        label='Kiểu Dữ Liệu'
                        required
                        data={indexDataType}
                        value={inputDataIndex?.indexTypeId}
                        onChange={e => {
                          handleChangeIndex('indexTypeId', e.target.value)
                        }}
                      />
                    </Grid>
                    {inputDataIndex?.indexTypeId === 'ID0000003' && (
                      <Grid item xs={1} display={'flex'}>
                        <TextField
                          className={styles['custom-input']}
                          value={decimalNumber}
                          label='Thập phân'
                          InputProps={{
                            endAdornment: (
                              <Stack style={{ height: '100%' }}>
                                <button
                                  onClick={() => setDecimalNumber(prev => ++prev)}
                                  style={{ backgroundColor: theme.palette.primary.main }}
                                  className={styles['custom-button']}
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => {
                                    if (decimalNumber === 1) return
                                    setDecimalNumber(prev => --prev)
                                  }}
                                  style={{ backgroundColor: theme.palette.primary.main }}
                                  className={styles['custom-button']}
                                >
                                  -
                                </button>
                              </Stack>
                            )
                          }}
                          onChange={e => {
                            //handleChangeIndex('unit', e.target.value)
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={1}>
                      <TextField
                        defaultValue='Lần'
                        label='Đơn vị số'
                        value={inputDataIndex?.unit}
                        onChange={e => {
                          handleChangeIndex('unit', e.target.value)
                        }}
                      />
                    </Grid>
                    {inputDataIndex.indexTypeId !== 'ID0000001' && (
                      <Grid item xs={2}>
                        <TextField
                          fullWidth
                          label='Giá trị mặc định'
                          defaultValue={inputDataIndex?.defaultValue}
                          onChange={e => {
                            handleChangeIndex('defaultValue', e.target.value)
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={2}>
                      <TextField
                        label='Máy xét nghiệm'
                        value={inputDataIndex?.testers}
                        onChange={e => {
                          handleChangeIndex('testers', e.target.value)
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container marginTop={4}>
                  {inputDataIndex.id && comReferValues.length > 0 && (
                    <GreyDataGrid
                    hideFooter
                    rows={comReferValues.map((item: any, index: any) => ({ ...item, index: index + 1 }))}
                    columns={COLUMN_DEF_SERVICE_COMREFER}
                    paginationMode='server'
                    loading={false}
                    slots={{
                      noRowsOverlay: () => (
                        <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                      )
                    }}
                    style={{ height: '20vh', marginTop: '5px' }}

                  />
                  )}
                  <Grid item xs={12}>
                    <TextField
                      label='Mô tả'
                      variant='outlined'
                      multiline
                      placeholder='Mô tả'
                      rows={4}
                      fullWidth
                      defaultValue={input?.describe}
                      onBlur={e => {
                        handleChange('describe', e.target.value)
                      }}
                    />
                  </Grid>
                </Grid>
                {inputDataIndex.indexTypeId === "ID0000001" && (
                  <Grid>
                    <Typography style={{marginTop:'5px'}}>Giá Trị Mặc Định</Typography>
                    <TextField
                      variant='outlined'
                      multiline
                      rows={4}
                      fullWidth
                      defaultValue={inputDataIndex?.defaultValue}
                      onBlur={e => {
                        handleChangeIndex('defaultValue', e.target.value)
                      }}
                    />
                  </Grid>
                )}
                <Grid xs={6}></Grid>
                <Box marginTop={4}>
                  <FormGroup>
                    {input?.serviceTypeId === 'SRT00016' && (
                      <FormControlLabel control={<Checkbox />} label='In kết quả riêng' />
                    )}
                    {input?.id && input?.serviceTypeId === 'SRT00016' &&(
                      <FormControlLabel 
                      control={
                        <Checkbox
                          defaultChecked={chooseSpec}
                          onChange={(e,checked)=>handleChange('chooseSpecIndex',checked)}
                        />
                      } 
                      label='Cho phép chọn chỉ sổ chỉ định' 
                    />
                    )}
                    {dialogType.value === "update" && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={chooseConsumeGoods}
                            checked={chooseConsumeGoods}
                            onChange={() => setChooseConsumeGoods(prev => !prev)}
                          />
                        }
                        label='Cho phép chọn hàng hóa tiêu hao'
                      />
                    )}
                  </FormGroup>
                </Box>
              </TabPanel>
              {/* Service Index */}
              <TabPanel value='2'>
                <Box marginBottom={4}>
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{ pl: 5, pr: 8 }}
                    onClick={() => handleAddServiceIndex()}
                  >
                    <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                    Thêm mới
                  </Button>
                </Box>
                <GreyDataGrid
                  rows={serviceIndexList.map((item: any, index: any) => ({
                    ...item,
                    index: index + 1
                  }))}
                  hideFooter
                  rowCount={3}
                  columns={COLUMN_DEF_SERVICE_INDEX}
                  paginationMode='server'
                  loading={false}
                  style={{ height: serviceIndexList.length > 0 ? '30vh' : 0 }}
                  //style={{ minHeight: 500, height: '30vh' }}
                  slots={{
                    noRowsOverlay: () => (
                      <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                    )
                  }}
                />

                <Box marginTop={4}>
                  <TextField label='Kết luận' variant='outlined' multiline placeholder='Mô tả' rows={4} fullWidth />
                </Box>
              </TabPanel>
              {/* End Service Index */}
              {/* Result Sample */}
              <TabPanel value='5'>
                <Box marginBottom={4}>
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{ pl: 5, pr: 8 }}
                      onClick={() => handleOpenAddRS()}
                    >
                      <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                      Thêm mới
                    </Button>
                </Box>
                <GreyDataGrid
                  rows={dataServiceExampleValue.map((item: any, index: any) => ({
                    ...item,
                    index: index + 1
                  }))}
                  hideFooter
                  rowCount={3}
                  columns={COLUMN_DEF_RESULT_SAMPLE}
                  paginationMode='server'
                  loading={false}
                  style={{ height: dataServiceExampleValue.length > 0 ? '30vh' : 0 }}
                  //style={{ minHeight: 500, height: '30vh' }}
                  slots={{
                    noRowsOverlay: () => (
                      <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                    )
                  }}
                />
              </TabPanel>  
              {/* End Result Sample */}
              {/* ConsumeProduct */}
              <TabPanel value='3'>
                <Box>
                  <Grid xs={4}>
                    <Autocomplete
                      freeSolo
                      autoHighlight
                      openOnFocus
                      options={productList}
                      open={isAutocompleteOpen}
                      onOpen={() => setIsAutocompleteOpen(true)}
                      onClose={() => setIsAutocompleteOpen(false)}
                      sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.productName)}
                      // defaultValue={productData.find(i => i.id === dataSelectProduct?.id)}
                      onChange={(e: any, newValue: any) => {
                        handleItemSelected(newValue)
                      }}
                      renderOption={(props, option) => (
                        <Box
                          component='li'
                          key={option.id}
                          {...props}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography
                            variant='body1'
                            sx={{ width: '100%', textAlign: 'left' }}
                          >
                            <strong>{option.productName}</strong>-{option.unit.name}
                          </Typography>
                          <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                            Hoạt Chất: <strong>{option.ingredients}</strong>
                          </Typography>
                          <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                            Đóng gói: <strong>1 {option.unit.name} 1000 viên</strong>
                          </Typography>
                          <Typography variant='body2' color='primary' sx={{ width: '100%', textAlign: 'left' }}>
                            <strong>CĐ00021</strong> Giá:<strong>{formatVND(option.price)}</strong> Tồn:<strong>{QuantityRemaining(option.cansales)}</strong>
                          </Typography>
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Nhập tên thuốc'
                          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          value={params.InputLabelProps}
                        />
                      )}
                    />
                  </Grid>
                  <DataGrid
                    hideFooter
                    rows={ConSumProductData.map((item: any, index: any) => ({ ...item, index: index + 1 }))}
                    columns={COLUMN_DEF_CONSUME_GOODS}
                    paginationMode='server'
                    loading={false}
                    slots={{
                      noRowsOverlay: () => (
                        <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                      )
                    }}
                    style={{ height: ConSumProductData.length ? '30vh' : 0, marginTop: '32px' }}
                  />
                </Box>
              </TabPanel>
              {/* End Consume Product*/}

              {/* Print model */}
              <TabPanel value='4'>
                <Box marginBottom={4}>
                  <FormGroup>
                    <Stack direction='row' spacing={4}>
                      <FormControlLabel control={<Checkbox />} label='Mẫu 1' />
                      <FormControlLabel control={<Checkbox defaultChecked />} label='Mẫu 2' />
                      <FormControlLabel control={<Checkbox defaultChecked />} label='Mẫu tùy chỉnh' />
                    </Stack>
                  </FormGroup>
                </Box>
                <Button variant='outlined' color='error' startIcon={<Icon icon='bx:upload' />}>
                  Tải file
                  <VisuallyHiddenInput type='file' />
                </Button>
              </TabPanel>
              {/* End Print Model */}
            </Box>
          </Box>
        </TabContext>

        <MUIDialog
          maxWidth='xl'
          open={openAddServiceIndex}
          title={dialogTypeProc.value === 'addProc' ? 'Thêm mới chỉ số' : 'Cập nhật chỉ số'}
        >
          <UpdateServiceIndex open={openAddServiceIndex} data={inputProp} onSubmit={refetchIndexProcs} dataLenght={serviceIndexList.length} />
        </MUIDialog>
        <MUIDialog maxWidth='sm' open={openAddSG} title='Thêm mới nhóm dịch vụ'>
          <UpdateServiceGroup open={openAddSG} onSubmit={refentchServiceGroup} dialogType='add' data={SGdata} />
        </MUIDialog>
        <MUIDialog
          maxWidth='sm'
          open={openComparisonReference}
          title={dialogTypeProc.value === 'addProc' ? 'Thêm mới chỉ số' : 'Cập nhật chỉ số'}
        >
          <UpdateComparisonReferenceValue open={openComparisonReference} dialogType={dialogTypeOfComreferValue} data={dataComrefer} onSubmit={refetchComrefervalue} />
        </MUIDialog>
        <MUIDialog
          maxWidth='lg'
          open={openAddResultSample}
          title={dialogRSType==='add'?'Thêm Mới Mẫu Kết Quả':'Chỉnh Sửa Mẫu Kết Quả'}
        >
          <UpdateServiceExampleValue open={openAddResultSample} dialogType={dialogRSType} data={dataServiceExample} onSubmit={refetchdataExample} />
        </MUIDialog>
      </>
    </MuiDialogContent>
  )
}

export default UpdateService
