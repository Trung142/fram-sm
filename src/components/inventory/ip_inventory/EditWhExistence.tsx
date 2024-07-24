import React, { useState, useEffect, useMemo, useRef } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'

import {
  Grid,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
  Card,
  ButtonGroup,
  Paper,
  Divider,
  Typography,
  Collapse,
  InputLabel,
  FormControl,
  MenuItem,
  Grid2Props,
  SelectChangeEvent,
  Select
} from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import toast from 'react-hot-toast'
import SaveIcon from '@mui/icons-material/Save'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'

import Link from 'next/link'
import { GET_WH, GET_WH_EXISTENCE, GET_PRODUCT, GET_UNIT, GET_BATCH, GET_CANSALES } from './graphql/query'
import {
  ADD_CANSALE,
  ADD_MANY_CANSALE,
  ADD_WH_EXISTENCE_DT,
  DELETE_WH_EXISTENCE_Dt,
  UPDATE_CANSALE,
  UPDATE_MANY_CANSALE,
  UPDATE_WH_EXISTENCE,
  UPDATE_WH_EXISTENCE_Dt
} from './graphql/mutation'
import { ICanSale, IWhExistenceInput, IpInventory, whExistenceDt } from './graphql/variables'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { formatVND } from 'src/utils/formatMoney'
import AddBatch from '../../dialog/batch/adBatch'
import { useRouter } from 'next/router'
import InputProductSearch from 'src/components/inputSearch/InputProductSearch'
import InputBatchSearch from 'src/components/inputSearch/InputBatchSearch'
const tienichex = [
  { id: 1, name: 'Xuất mẫu có data (Excel)' },
  { id: 2, name: 'Xuất mẫu không data (Excel)' },
  { id: 3, name: 'In phiếu ' }
]
const status = [
  { id: '301', name: 'Lưu nháp' },
  { id: '302', name: 'Hoàn thành' },
  { id: '303 ', name: 'Huỷ phiếu' }
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
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

const CustomGrid = styled(Grid)<Grid2Props>(({ theme }) => ({
  '& .MuiGrid-item': {
    borderLeft: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    borderTop: '1px solid #e0e0e0'
  }
}))
const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#E0E0E0',
  width: '120px',
  minWidth: '120px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #e0e0e0'
}))

const EditWhExistence = (props: any) => {
  const [productId, setProductId] = useState('')
  const [updateWhExistence] = useMutation(UPDATE_WH_EXISTENCE)
  const [updateWhExistenceDt] = useMutation(UPDATE_WH_EXISTENCE_Dt)
  const [DeleteWhExistenceDt] = useMutation(DELETE_WH_EXISTENCE_Dt)
  const [AddManyCansale] = useMutation(ADD_MANY_CANSALE)
  const [AddCansale] = useMutation(ADD_CANSALE)
  const [UpdateCansale] = useMutation(UPDATE_CANSALE)
  const [UpdateManyCansale] = useMutation(UPDATE_MANY_CANSALE)
  const [AddWhExistenceDt] = useMutation(ADD_WH_EXISTENCE_DT)
  const client = useApolloClient()

  const { data: getWhEx, refetch } = useQuery(GET_WH_EXISTENCE, {
    variables: {
      input: {
        id: { eq: props.data }
      }
    }
  })
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [utilities, setUtilities] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [Tongtienvat, setTongtienvat] = useState(0)
  const [Tongthanhtien, setTongthanhtien] = useState(0)
  const { data: getProduct } = useQuery(GET_PRODUCT, {})
  const { data: getBatchData, refetch: refetchBatch } = useQuery(GET_BATCH)

  const batchData: any[] = useMemo(() => {
    return getBatchData?.getBatch?.items ?? []
  }, [getBatchData])

  const productData: any[] = useMemo(() => {
    return getProduct?.getProduct?.items ?? []
  }, [getProduct])

  const handleChange = (event: SelectChangeEvent) => {
    setUtilities(event.target.value as string)
  }

  const [selectedProducts, setSelectedProducts] = useState<whExistenceDt[]>([])
  const [dataEdit, setDataEdit] = useState<IWhExistenceInput>()
  const user = getLocalstorage('userData')

  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getCanSale } = useQuery(GET_CANSALES)
  const { data: getWh } = useQuery(GET_WH)
  const canSales: ICanSale[] = useMemo(() => {
    return getCanSale?.getCansale?.items ?? []
  }, [getCanSale])
  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])

  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })
  useEffect(() => {
    setDataEdit(getWhEx?.getWhExistence?.items[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])
  useEffect(() => {
    const whExistenceDt = getWhEx?.getWhExistence?.items[0]?.whExistenceDts as []
    const whExistence = getWhEx?.getWhExistence?.items[0] as IWhExistenceInput
    if (whExistenceDt && whExistenceDt.length > 0) {
      const productData = whExistenceDt.map((e: any) => ({
        id: e.product.id,
        price: e.product.price,
        productName: e.product?.productName,
        thanhtien: e.finalAmount,
        unitId: e.product?.unit?.id,
        productId: e.product?.id,
        quantity: e.quantity,
        batchId: e.batchId,
        vat: e.vat,
        maximumInventory: e.maximumInventory,
        whExistenceId: e.id,
        cansales: e.product.cansales
      }))
      setSelectedProducts(productData)
      setTongthanhtien(whExistence?.finalAmount || 0)
      setTongtien(whExistence?.totalAmount || 0)
      setTongtienvat(whExistence?.totalVatAmount || 0)
    }
  }, [getWhEx])
  useEffect(() => {
    calculateTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])

  const [Tongtien, setTongtien] = useState(dataEdit?.totalAmount || 0)
  const [addData, setAddData] = useState<IpInventory>({
    whPersionId: '',
    createAt: new Date(),
    whId: '',
    totalAmount: dataEdit?.totalAmount || 0,
    totalDiscount: 0,
    unitId: '',
    totalVatAmount: Tongtienvat,
    finalAmount: Tongthanhtien,
    // ListProduct:ListProductEx,
    note: ''
  })

  const [editData, setEditData] = useState<IpInventory>({
    whPersionId: dataEdit?.whPersionId,
    createAt: new Date(),
    whId: '',
    totalAmount: Tongtien,
    totalDiscount: 0,
    unitId: '',
    totalVatAmount: Tongtienvat,
    finalAmount: Tongthanhtien,
    note: ''
  })
  const handleQuantityBatch = (batchId: string, product: any) => {
    const data = product.cansales.find((e: any) => e.batchId === batchId)
    if (data) {
      return data.totalRemaining
    }
    return 0
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = async (value: string) => {
    setOpen(false)
    await refetchBatch()
  }

  const handleAdd = (key: string, value: string | number) => {
    setEditData({
      ...editData,
      [key]: value
    })
  }

  const handleEditIpinventory = async (status: string) => {
    const dataApi = dataEdit?.whExistenceDts ?? []
    const dataWhExistence = {
      id: dataEdit?.id,
      createAt: new Date(addData.createAt ?? ''),
      whId: dataEdit?.whId,
      totalAmount: Tongtien,
      totalDiscount: 0,
      totalVatAmount: Tongtienvat,
      finalAmount: Tongthanhtien,
      note: dataEdit?.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status
    }
    updateWhExistence({
      variables: {
        input: JSON.stringify(dataWhExistence)
      },
      onCompleted: async () => {
        await refetch()
        toast.success('Cập nhập số phiếu thành công')
      }
    })
    const duplicatedItems = selectedProducts.filter(item1 => dataApi.some(item2 => item1.id === item2?.product?.id))
    const uniqueInArray2 = selectedProducts.filter(item2 => !dataApi.some(item1 => item2.id === item1.product?.id))

    if (duplicatedItems.length > 0) {
      duplicatedItems.map((data: whExistenceDt) => {
        const dtSale = canSales.find(e => e.batchId === data.batchId && e.productId === data.productId)
        if ((data?.totalRemaining || 0) > (dtSale?.totalRemaining || 0)) {
          toast.error('Số lượng tồn kho đã bán vượt quá số lượng đã thêm')
          return
        }
        updateWhExistenceDt({
          variables: {
            input: JSON.stringify({
              id: data.whExistenceId,
              unitId: data.unitId,
              importPrice: data.price,
              quantity: data.quantity,
              totalRemaining: data.totalRemaining,
              batchId: data.batchId,
              vat: data.vat,
              finalAmount: (data.price || 0) * (data.quantity || 0),
              totalVatAmount: ((data.price || 0) * (data.quantity || 0) * data.vat) / 100,
              clinicId: user.clinicId,
              parentClinicId: user.parentClinicId
            })
          },
          onError: () => {
            toast.error('Có lỗi xảy khi cập nhập phiếu nhập kho')
          }
        })
      })
    }

    if (status === '301') {
      const removedFromDataEdit = dataApi.filter(
        itemEdit => !selectedProducts.some(itemSelected => itemSelected.id === itemEdit.product?.id)
      )
      if (removedFromDataEdit.length > 0) {
        duplicatedItems.map((data: whExistenceDt) => {
          DeleteWhExistenceDt({
            variables: {
              input: data.whExistenceId
            },
            onCompleted: async () => {
              await refetch()
              toast.success('Xoá hàng hoá ra khỏi kho thành công')
            }
          })
        })
      }
      if (uniqueInArray2.length > 0) {
        const dataWhExistenceDtUnque = uniqueInArray2.map((data: whExistenceDt) => {
          return {
            whExistenceId: dataEdit?.id,
            unitId: data.unitId,
            importPrice: data.price,
            quantity: data.quantity,
            totalRemaining: data.quantity,
            batchId: data.batchId,
            vat: data.vat,
            productId: data.id,
            finalAmount: (data.price || 0) * (data.quantity || 0),
            totalVatAmount: ((data.price || 0) * (data.quantity || 0) * data.vat) / 100,
            clinicId: user.clinicId,
            parentClinicId: user.parentClinicId
          }
        })

        AddWhExistenceDt({
          variables: {
            input: JSON.stringify(dataWhExistenceDtUnque)
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi thêm chi tiết phiếu kho mới')
          }
        })
        const dataSubmit = selectedProducts.map((data: any) => {
          return {
            totalRemaining: data.quantity,
            quantity: data.quantity,
            batchId: data.barId,
            productId: data.id,
            whId: addData.whId,
            clinicId: user.clinicId,
            parentClinicId: user.parentClinicId
          }
        })
        const dataUpdate: any[] = []
        dataSubmit.forEach(dataSubmit => {
          const matchingCindition = canSales.find(itemCanSl => {
            return (
              itemCanSl.productId === dataSubmit.productId &&
              itemCanSl.batchId === dataSubmit.batchId &&
              itemCanSl.whId === dataSubmit.whId
            )
          })

          if (matchingCindition) {
            const data = {
              id: matchingCindition?.id,
              totalRemaining: dataSubmit.quantity + matchingCindition?.quantity,
              quantity: dataSubmit.quantity + matchingCindition?.quantity
            }
            dataUpdate.push(data)
          }
        })

        const uniqueInArray = dataSubmit.filter(
          itemEdit =>
            !canSales.find(
              itemSelected =>
                itemSelected.productId === itemEdit.productId &&
                itemSelected.batchId === itemEdit.batchId &&
                itemSelected.whId === itemEdit.whId
            )
        )

        if (uniqueInArray.length > 0) {
          AddManyCansale({
            variables: {
              input: JSON.stringify(uniqueInArray2)
            },
            onCompleted: () => {
              toast.success('Thêm sản phẩm vào tồn kho thành công')
            }
          })
        }
        if (dataUpdate.length > 0) {
          UpdateManyCansale({
            variables: {
              input: JSON.stringify(dataUpdate)
            },
            onCompleted: () => {
              toast.success('Cập nhập số lượng tồn kho thành công')
            }
          })
        }
      }
      for (const data of selectedProducts) {
        const result = await client.query({
          query: GET_CANSALES,
          variables: {
            input: {
              and: [
                { batchId: data.batchId ? { eq: data.batchId } : undefined },
                { productId: data.id ? { eq: data.id } : undefined },
                { whId: addData.whId ? { eq: addData.whId } : undefined },
                { clinicId: user.clinicId ? { eq: user.clinicId } : undefined },
                { parentClinicId: user.parentClinicId ? { eq: user.parentClinicId } : undefined }
              ]
            },
            skip: 0,
            take: 25
          }
        })
        const canSales = result.data?.getCansale?.items ?? []
        if (canSales && canSales.length > 0) {
          UpdateCansale({
            variables: {
              input: JSON.stringify({
                id: canSales?.id,
                totalRemaining: data.quantity + canSales[0].totalRemaining,
                quantity: data.quantity + canSales[0].quantity
              })
            }
          })
        } else {
          AddCansale({
            variables: {
              input: {
                batchId: data.batchId,
                productId: data.id,
                whId: addData.whId,
                quantity: data.quantity,
                totalRemaining: data.quantity,
                clinicId: user.clinicId,
                parentClinicId: user.parentClinicId
              }
            }
          })
        }
      }
    }
  }

  const handleRemoveProduct = (productId: string, index: number, product: whExistenceDt) => {
    setSelectedProducts(pro => {
      const productItem = pro[index]

      if (productItem.id === productId) {
        if (productItem.quantity && productItem.quantity > 1) {
          const updatedServices = [...pro]
          updatedServices[index] = { ...productItem, quantity: productItem.quantity - 1 }

          return updatedServices
        } else {
          return pro.filter(e => e.id !== productId)
        }
      }

      return pro
    })
    if (dataEdit?.totalAmount) {
      setDataEdit({
        ...dataEdit,
        totalAmount: dataEdit?.totalAmount - (product.price || 0)
      })
    }
  }

  const handleSelectProduct = (selectedProduct: any) => {
    const productIndex = selectedProducts.findIndex(service => service.id === selectedProduct.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].quantity = (updateProduct[productIndex].quantity || 0) + 1
      updateProduct[productIndex].thanhtien = ((updateProduct[productIndex].quantity || 0) + 1) * selectedProduct.price
      setSelectedProducts(updateProduct)
      const product = {
        ...dataEdit?.whExistenceDts,
        updateProduct
      }
    } else {
      setSelectedProducts(e => [...e, { ...selectedProduct, quantity: 1, thanhtien: selectedProduct.price }])
    }
  }
  const calculateTotals = () => {
    let totalAmount = 0
    let totalVatAmount = 0
    let payableAmount = 0

    for (const product of selectedProducts) {
      totalAmount += product.thanhtien
      totalVatAmount += (product.thanhtien * product.vat) / 100
      payableAmount += product.thanhtien + (product.thanhtien * product.vat) / 100
    }
    setTongtien(totalAmount)
    setTongtienvat(totalVatAmount)
    setTongthanhtien(payableAmount)
  }
  const handleSearch = (searchValue: any) => {
    console.log('Searching for:', searchValue)
  }

  const handleCreate = (value: any) => {
    console.log('Creating:', value)
    const productIndex = selectedProducts.findIndex(service => service.id === value.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].quantity = (updateProduct[productIndex].quantity || 0) + 1
      updateProduct[productIndex].thanhtien = ((updateProduct[productIndex].quantity || 0) + 1) * value.price
      setSelectedProducts(updateProduct)
    } else {
      setSelectedProducts(e => [...e, { ...value, quantity: 1, thanhtien: value.price }])
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>SỬA PHIẾU NHẬP HÀNG TỒN KHO</h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, backgroundColor: '#8592A3', width: 125, height: 42, fontSize: '13px' }}
                // onClick={() => handleOpenAdd()}
                startIcon={<ArrowBackIcon />}
              >
                <Link href='/inventory/ip-inventory' style={{ color: 'white', textDecoration: 'none' }}>
                  Quay lại
                </Link>
              </Button>

              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: 'green',
                    color: 'white',
                    width: 144,
                    height: 42,
                    fontSize: '11px'
                  }}
                  onClick={e => {
                    handleEditIpinventory('302')
                  }}
                  startIcon={<SaveIcon />}
                >
                  HOÀN THÀNH
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#8592A3',
                    color: 'white',
                    borderTopRightRadius: 0,
                    width: 125,
                    height: 42,
                    fontSize: '13px'
                  }}
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
              </Box>
              <FormControl
                sx={{
                  width: '150px'
                }}
              >
                <InputLabel id='demo-simple-select-label' style={{ height: 30, position: 'absolute', top: -5 }}>
                  Tiện ích
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={utilities}
                  label='Tiện ích'
                  placeholder='Tiện ích'
                  onChange={handleChange}
                  sx={{ height: 42, lineHeight: 30 }}
                >
                  {tienichex.map(item => (
                    <MenuItem key={item.id} sx={{ height: 42, lineHeight: 42 }} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Box>
      </Grid>

      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Mã phiếu
            </Typography>
          </CustomBox>
          <CustomTextField type='text' variant='filled' fullWidth value={dataEdit?.id} />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Người nhập kho
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={(dataEdit?.whPersion?.fristName || '') + ' ' + (dataEdit?.whPersion?.lastName || '')}
            onChange={e => {
              handleAdd('whPersionId', user.id)
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ngày nhập
            </Typography>
          </CustomBox>
          <CustomTextField
            type='datetime-local'
            variant='filled'
            fullWidth
            value={new Date(dataEdit?.createAt || Date.now()).toISOString().substring(0, 16)}
            onChange={e => handleAdd('createAt', e.target.value)}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Kho nhập
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={whName}
            // options={patType}
            style={{ width: '100%' }}
            value={whName.find((x: any) => x.id === dataEdit?.whId) ?? null}
            onChange={(e, value: any) => handleAdd('whId', value?.id)}
            renderInput={params => <TextField {...params} placeholder='Kho' InputLabelProps={{ shrink: true }} />}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Tổng tiền
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={formatVND(Tongtien)}
            // value={formatVND(Tongtien)}
            onChange={e => {
              handleAdd('totalAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Giảm giá
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='number'
            fullWidth
            sx={{ width: '100%' }}
            value={dataEdit?.totalDiscount}
            onChange={e => {
              handleAdd('totalDiscount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Tổng tiền vat
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            value={formatVND(Math.round(Tongtienvat * 100) / 100)}
            onChange={e => {
              handleAdd('totalVatAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Thành tiền
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            value={formatVND(Math.round(Tongthanhtien * 100) / 100)}
            onChange={e => {
              handleAdd('finalAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Trạng thái
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={status.find((x: any) => x.id === dataEdit?.status)?.name ?? ''}
          />
        </CustomGrid>
        <CustomGrid item xs={9.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ghi chú
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            type='text'
            fullWidth
            sx={{ width: '100%' }}
            defaultValue={dataEdit?.note}
            onChange={e => {
              handleAdd('note', e.target.value)
            }}
          />
        </CustomGrid>
      </CustomGrid>
      <Grid container spacing={0}>
        <Grid item xs={6} style={{ marginLeft: '-20px' }}>
          <Collapse in={expandedCard['card1']} timeout='auto' unmountOnExit>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <InputProductSearch
                    placeholder='Tìm kiếm sản phẩm'
                    onSearch={handleSearch}
                    onCreate={handleSelectProduct}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Grid>
      </Grid>

      <Grid item xs={12}>
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
            // aria-label='simple table'
            aria-label='customized table'
          >
            <TableHead
              sx={{ backgroundColor: 'white', fontSize: '10px', fontWeight: '800', borderBottomColor: '#32475C61' }}
            >
              <TableRow>
                <TableCell style={{ width: '5%' }}>STT</TableCell>
                <TableCell style={{ width: '10%' }}>MÃ HÀNG HÓA</TableCell>
                <TableCell style={{ width: '10%' }}>TÊN HÀNG HÓA</TableCell>
                <TableCell style={{ width: '12%' }}>SỐ LÔ</TableCell>
                <TableCell style={{ width: '10%' }}>TỒN KHO</TableCell>
                <TableCell style={{ width: '10%' }}>ĐƠN VỊ TÍNH</TableCell>
                <TableCell style={{ width: '15%' }}>SỐ LƯỢNG </TableCell>
                <TableCell style={{ width: '10%' }}>GIÁ NHẬP </TableCell>
                <TableCell style={{ width: '10%' }}>CHIẾT KHẤU </TableCell>
                <TableCell style={{ width: '10%' }}>% VAT</TableCell>
                <TableCell style={{ width: '10%' }}>THÀNH TIỀN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product: whExistenceDt, index) => (
                <React.Fragment key={index}>
                  <TableRow key={product.id}>
                    <StyledTableCell style={{ width: '10%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{product.id}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>{product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%', display: 'grid', gridTemplateColumns: '30px 1fr' }}>
                      <IconButton
                        aria-label='Thêm lô'
                        color='error'
                        onClick={() => {
                          setProductId(product.id)
                          handleClickOpen()
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                      <InputBatchSearch
                        onChange={value => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              batchId: value.id
                            }
                            setSelectedProducts(newServices)
                          }
                        }}
                        onSearch={e => {
                          console.log(e)
                        }}
                        product={product}
                        batchId={product.batchId}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {handleQuantityBatch(product.batchId, product)}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id='combo-box-demo'
                        options={unitName}
                        style={{ minWidth: 130 }}
                        value={unitName.find((x: any) => x.id === product.unitId) ?? null}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              unitId: value.id
                            }
                            setSelectedProducts(newServices)
                          }
                        }}
                        renderInput={params => <TextField {...params} label='Đơn vị' />}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ minWidth: '150px' }}>
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={product.quantity}
                        type='number'
                        style={{ minWidth: '150px' }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            thanhtien: Number(e.target.value) * (product.price || 0)
                          }

                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '20%' }}>
                      <Typography>{formatVND(product.price || 0)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>0</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{product.vat ? product.vat : 0}</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {/* {formatVND(product.quantity * product.price)} */}
                      {formatVND(product.thanhtien || 0)}
                    </StyledTableCell>
                    {dataEdit?.status === '301' && (
                      <TableCell style={{ width: '10%' }}>
                        <IconButton aria-label='delete' onClick={() => handleRemoveProduct(product.id, index, product)}>
                          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <AddBatch open={[open, setOpen]} productId={productId} />
    </Grid>
  )
}
export default EditWhExistence
