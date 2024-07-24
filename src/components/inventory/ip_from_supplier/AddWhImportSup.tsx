import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Grid,
  Box,
  Button,
  TextField,
  IconButton,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
  Paper,
  Typography,
  Collapse,
  MenuItem,
  Grid2Props,
  Divider,
  Menu,
  InputAdornment,
  CircularProgress,
  Stack
} from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import toast from 'react-hot-toast'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import { useQuery, useMutation } from '@apollo/client'

import { GET_WH, GET_PRODUCT, GET_UNIT, GET_BATCH, GET_SUPPLIER, GET_PAYMENT_TYPE, GET_CANSALE } from './graphql/query'
import {
  ADD_MANY_CAN_SALE,
  ADD_WH_IMPORT_SUP,
  ADD_MANY_WH_IMPORT_SUP_DT,
  UPDATE_MANY_CAN_SALE
} from './graphql/mutation'
import { CanSale, IpInventory, Product } from './graphql/variables'
import { formatVND } from 'src/utils/formatMoney'
import { getLocalstorage } from 'src/utils/localStorageSide'
import AddBatch from '../../dialog/batch/adBatch'
import { useRouter } from 'next/router'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import apollo from 'src/graphql/apollo'
import useDebounce from 'src/hooks/useDebounce'
import moment from 'moment'
import InputBatchSearch from 'src/components/inputSearch/InputBatchSearch'

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

const AddWhImportSup = () => {
  //======================================HANDLER================================

  const route = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [batchId, setBatchId] = useState(true)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    calculateTotals()
    checkBatchId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])
  const user = getLocalstorage('userData')
  const [addData, setAddData] = useState<IpInventory>({
    whPersionId: '',
    createAt: new Date(),
    whId: '',
    supplierId: '',
    totalAmount: 0,
    totalDiscount: 0,
    totalVatAmount: 0,
    finalAmount: 0,
    totalPaid: 0,
    note: ''
  })

  const handleAdd = (key: string, value: any) => {
    setAddData({
      ...addData,
      [key]: value
    })
  }

  const checkBatchId = () => {
    selectedProducts.forEach((data: Product) => {
      if (data.batchId === null || data.batchId === undefined || data.batchId === '') {
        return setBatchId(false)
      } else {
        setBatchId(true)
      }
    })
  }
  const checkTotalRemaining = (data: CanSale[]) => {
    let total = 0
    data.forEach((p: CanSale) => {
      total += p.totalRemaining
    })
    return total
  }
  const checkTotalRemainingByBatchId = (batchId: string, product: any) => {
    let result: any = 'Không có'
    product.cansales.forEach((data: CanSale) => {
      if (data.batchId === batchId && data.whId === addData.whId) result = data.totalRemaining
    })
    return result
  }
  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })
  const handleAddWhImportSup = (status: string) => {
    const dataWhImport = {
      whPersionId: user.id,
      createAt: addData.createAt,
      whId: addData.whId,
      totalAmount: addData.totalAmount,
      totalDiscount: addData.totalDiscount,
      totalVatAmount: addData.totalVatAmount,
      finalAmount: addData.finalAmount,
      totalPaid: addData.totalPaid,
      debt: addData.finalAmount - addData.totalPaid < 0 ? 0 : addData.finalAmount - addData.totalPaid,
      paymentTypeId: addData.paymentTypeId,
      supplierId: addData.supplierId,
      note: addData.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status
    }
    if (dataWhImport.whId === '' || dataWhImport.whId === undefined || dataWhImport.whId === null) {
      toast.error('Vui lòng chọn kho nhập')
    } else if (
      dataWhImport.paymentTypeId === '' ||
      dataWhImport.paymentTypeId === undefined ||
      dataWhImport.paymentTypeId === null
    ) {
      toast.error('Vui lòng chọn phương thức thanh toán')
    } else if (
      dataWhImport.supplierId === '' ||
      dataWhImport.supplierId === undefined ||
      dataWhImport.supplierId === null
    ) {
      toast.error('Vui lòng chọn nhà cung cấp')
    } else if (selectedProducts.length === 0 || selectedProducts.length === undefined) {
      toast.error('Vui lòng chọn sản phẩm')
    } else if (batchId === false) {
      toast.error('Vui lòng nhập đầy đủ số lô')
    } else
      addWhImportSup({
        variables: {
          input: dataWhImport
        }
      })
        .then((res: any) => {
          const dataWhImportSupDt = selectedProducts.map((data: Product) => {
            return {
              whImportSupId: res.data.addWhImportSup.id,
              unitId: data.unitId,
              importPrice: data.price,
              quantity: data.quantity,
              totalRemaining: data.quantity,
              batchId: data.batchId,
              finalAmount: data.finalAmount,
              dueDate: data.dueDate,
              productId: data.id,
              discountAmount: 0,
              vat: data.vat,
              clinicId: user.clinicId,
              parentClinicId: user.parentClinicId,
              totalVatAmount: (data.quantity * data.price * data.vat) / 100
            }
          })
          addManyWhImportSupDt({
            variables: {
              input: JSON.stringify(dataWhImportSupDt)
            }
          })
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi tạo chi tiết phiếu kho mới')
        })
        .then(async res => {
          if (status === '302') {
            const dataUpdate: any[] = []
            const dataAdd: any[] = []
            for (const product of selectedProducts) {
              try {
                const res = await apollo.query({
                  query: GET_CANSALE,
                  variables: {
                    input: {
                      productId: { eq: product.id },
                      batchId: { eq: product.batchId },
                      whId: { eq: addData.whId }
                    }
                  }
                })
                const canSale = res.data.getCansale.items
                if (canSale.length > 0) {
                  const data = {
                    id: canSale[0].id,
                    quantity: canSale[0].quantity + product.quantity,
                    totalRemaining: canSale[0].totalRemaining + product.quantity
                  }
                  dataUpdate.push(data)
                } else {
                  const data = {
                    batchId: product.batchId,
                    clinicId: user.clinicId,
                    parentClinicId: user.parentClinicId,
                    productId: product.id,
                    quantity: product.quantity,
                    totalRemaining: product.quantity,
                    whId: addData.whId
                  }
                  dataAdd.push(data)
                }
              } catch (err) {
                toast.error('Error querying CANSALE')
              }
            }
            if (dataAdd.length > 0) {
              addManyCansale({
                variables: {
                  input: JSON.stringify(dataAdd)
                }
              })
            }
            if (dataUpdate.length > 0) {
              updateManyCansale({
                variables: {
                  input: JSON.stringify(dataUpdate)
                }
              })
            }
          }
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi tạo số phiếu kho mới')
        })
        .then(async () => {
          toast.success('Tạo số phiếu mới thành công')
          setAddData(pre => ({
            ...pre,
            whPersionId: '',
            createAt: new Date(),
            whId: '',
            supplierId: '',
            totalAmount: 0,
            totalDiscount: 0,
            totalVatAmount: 0,
            finalAmount: 0,
            totalPaid: 0,
            paymentTypeId: '',
            note: ''
          }))
          setSelectedProducts([])
          apollo.resetStore()
        })
  }

  const handleRemoveProduct = (productId: string, index: number) => {
    setSelectedProducts(pro => {
      const productItem = pro[index]
      if (productItem.id === productId) {
        return pro.filter(e => e.id !== productId)
      }
      return pro
    })
  }

  const handleSelectProduct = (selectedProduct: Product) => {
    const productIndex = selectedProducts.findIndex(service => service.id === selectedProduct.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].quantity = (updateProduct[productIndex].quantity || 0) + 1
      updateProduct[productIndex].finalAmount =
        (updateProduct[productIndex].quantity || 0) *
        (selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100)
      setSelectedProducts(updateProduct)
    } else {
      setSelectedProducts(e => [
        ...e,
        {
          ...selectedProduct,
          quantity: 1,
          finalAmount: selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100
        }
      ])
    }
  }

  const calculateTotals = () => {
    let totalAmount = 0
    let totalVatAmount = 0
    let payableAmount = 0

    for (const product of selectedProducts) {
      totalAmount += product.price * product.quantity
      totalVatAmount += (product.price * product.vat * product.quantity) / 100
      payableAmount += product.finalAmount
    }
    setAddData(pre => ({
      ...pre,
      totalAmount: totalAmount,
      finalAmount: payableAmount,
      totalVatAmount: totalVatAmount,
      totalPaid: payableAmount
    }))
  }
  const [changePaid, setChangePaid] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openSelected = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [loading, setLoading] = useState(false)
  const observer = useRef<any>()
  const lastOption = (node: HTMLElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(async entries => {
      if (entries[0].isIntersecting && getProduct?.getProduct?.pageInfo?.hasNextPage) {
        await refetchProduct({ skip: productData.length })
      }
    })
    if (node) observer.current.observe(node)
  }
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const handleOnChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
  }
  useEffect(() => {
    refetchProduct({
      input: {
        or: [
          { id: { contains: debouncedSearchValue } },
          { productName: { contains: debouncedSearchValue } },
          { ingredients: { contains: debouncedSearchValue } }
        ]
      }
    })
  }, [debouncedSearchValue])
  const [productId, setProductId] = useState('')
  //======================================DATA===================================
  const [addWhImportSup] = useMutation(ADD_WH_IMPORT_SUP)
  const [updateManyCansale] = useMutation(UPDATE_MANY_CAN_SALE)
  const [addManyCansale] = useMutation(ADD_MANY_CAN_SALE)
  const [addManyWhImportSupDt] = useMutation(ADD_MANY_WH_IMPORT_SUP_DT)
  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH, {
    variables: { input: { parentClinicId: { eq: user.parentClinicId } } }
  })
  const { data: getSupplier } = useQuery(GET_SUPPLIER)
  const { data: getPaymentType } = useQuery(GET_PAYMENT_TYPE)
  const { data: getProduct, refetch: refetchProduct } = useQuery(GET_PRODUCT, {
    variables: {
      input: {
        or: [
          { id: { contains: debouncedSearchValue } },
          { productName: { contains: debouncedSearchValue } },
          { ingredients: { contains: debouncedSearchValue } }
        ]
      }
    }
  })

  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])
  const supplierName = useMemo(() => {
    return getSupplier?.getSupplier?.items ?? []
  }, [getSupplier])
  const paymentTypeName = useMemo(() => {
    return getPaymentType?.getPaymentType?.items ?? []
  }, [getPaymentType])
  const [productData, setProductData] = useState<Product[]>([])
  useEffect(() => {
    if (!getProduct?.getProduct?.pageInfo.hasNextPage && !getProduct?.getProduct?.pageInfo.hasPreviousPage) {
      const newP: Product[] = getProduct?.getProduct?.items ?? []
      setProductData(newP)
    } else if (!getProduct?.getProduct?.pageInfo.hasPreviousPage) {
      const newP: Product[] = getProduct?.getProduct?.items ?? []
      setProductData(newP)
    } else {
      const newP: Product[] = getProduct?.getProduct?.items ?? []
      const product = [...productData, ...newP]
      setProductData(product)
    }
  }, [getProduct])
  //====================================================RENDER==================================
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>NHẬP HÀNG TỒN KHO từ nhà cung cấp</h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, backgroundColor: '#8592A3', width: 125, height: 42, fontSize: '13px' }}
                onClick={() => route.push('/inventory/ip-from-supplier/')}
                startIcon={<ArrowBackIcon />}
              >
                Quay lại
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: '#0292B1', color: 'white', width: 135, height: 42, fontSize: '13px' }}
                  startIcon={<NoteIcon />}
                  onClick={e => {
                    handleAddWhImportSup('301')
                  }}
                >
                  LƯU NHÁP
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: 'green',
                    color: 'white',
                    paddingX: 5,
                    height: 42,
                    fontSize: '13px'
                  }}
                  onClick={e => {
                    handleAddWhImportSup('302')
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
                    width: 125,
                    height: 42,
                    fontSize: '13px'
                  }}
                  startIcon={<DownloadIcon />}
                >
                  IMPORT
                </Button>
              </Box>
              <Button
                sx={{ height: 42 }}
                aria-controls={openSelected ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={openSelected ? 'true' : undefined}
                onClick={event => {
                  handleClick(event)
                }}
                variant='outlined'
              >
                Tiện ích
                <Divider orientation='vertical' sx={{ ml: 4, backgroundColor: '#0292B1' }} />
                <ArrowDropDownIcon sx={{ mr: -2 }} />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openSelected}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem>Xuất mẫu có data (Excel)</MenuItem>
                <MenuItem>Xuất mẫu không data (Excel)</MenuItem>
                <MenuItem>In phiếu</MenuItem>
              </Menu>
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
          <CustomTextField type='text' variant='filled' fullWidth />
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
            inputProps={{ readOnly: true }}
            value={user.firstName + ' ' + user.lastName}
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
          <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
            <ReactDatePicker
              selected={addData.createAt}
              dateFormat={'dd/MM/yyyy HH:mm'}
              customInput={
                <TextField
                  fullWidth
                  placeholder='dd/mm/yyyy HH:mm'
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
              onChange={(date: Date) => handleAdd('createAt', date)}
            />
          </DatePickerWrapper>
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
            style={{ width: '100%' }}
            value={whName.find((x: any) => x.id === addData.whId) ?? ''}
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
            inputProps={{ readOnly: true }}
            value={formatVND(addData.totalAmount || 0)}
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
            value={addData.totalDiscount}
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
            inputProps={{ readOnly: true }}
            value={formatVND(Math.round(addData.totalVatAmount || 0))}
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
            inputProps={{ readOnly: true }}
            value={formatVND(Math.round(addData.finalAmount || 0))}
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
              Thanh toán
            </Typography>
          </CustomBox>
          <CustomTextField
            variant='filled'
            fullWidth
            value={changePaid === true ? addData.totalPaid : formatVND(addData.totalPaid || 0)}
            onClick={() => setChangePaid(true)}
            onBlur={() => setChangePaid(false)}
            onChange={e => {
              handleAdd('totalPaid', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={6.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Nhà cung cấp
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={supplierName}
            style={{ width: '100%' }}
            value={supplierName.find((x: any) => x.id === addData.supplierId) ?? ''}
            onChange={(e, value: any) => handleAdd('supplierId', value?.id)}
            renderInput={params => (
              <TextField {...params} placeholder='Nhà cung cấp' InputLabelProps={{ shrink: true }} />
            )}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Phương thức TT
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={paymentTypeName}
            style={{ width: '100%' }}
            value={paymentTypeName.find((x: any) => x.id === addData.paymentTypeId) ?? ''}
            onChange={(e, value: any) => handleAdd('paymentTypeId', value?.id)}
            renderInput={params => (
              <TextField {...params} placeholder='Phương thức thanh toán' InputLabelProps={{ shrink: true }} />
            )}
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
          <CustomTextField type='text' variant='filled' fullWidth value='Khởi tạo' />
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
            value={addData.note}
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
                  <div style={{ display: 'flex' }}>
                    <Autocomplete
                      autoHighlight
                      loading={loading}
                      onOpen={() => {
                        refetchProduct({ input: {}, skip: 0 })
                        setIsAutocompleteOpen(true)
                      }}
                      sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      options={productData === null || productData === undefined ? [] : productData}
                      open={isAutocompleteOpen}
                      onClose={() => setIsAutocompleteOpen(false)}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.productName)}
                      renderOption={(props, option, index) => {
                        if (index.index === productData.length - 1) {
                          return (
                            <Box
                              component='li'
                              key={option.id}
                              {...props}
                              ref={lastOption}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              onClick={() => {
                                selectedProducts.length === 500 && !selectedProducts.find(item => item.id === option.id)
                                  ? toast.error('Vượt quá số sản phầm trong 1 lần nhập phiếu')
                                  : handleSelectProduct(option)
                              }}
                            >
                              <Typography
                                variant='body1'
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  textTransform: 'uppercase',
                                  fontWeight: 'bold'
                                }}
                              >
                                {option.id} - {option.productName}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                Hoạt chất: {option.ingredients}
                              </Typography>
                              <Typography variant='body1' sx={{ width: '100%', textAlign: 'left' }}>
                                Quy cách: <span style={{ fontWeight: 'bold' }}>{option.specifications}</span>
                              </Typography>
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                sx={{ width: '100%', textAlign: 'left' }}
                              >
                                Giá: {formatVND(option.price)} /{' '}
                                <span style={{ color: 'red' }}>Giá BHYT: {formatVND(option.bhytPrict)} </span>
                              </Typography>
                              <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                                Tồn kho: {checkTotalRemaining(option.cansales)}
                              </Typography>
                            </Box>
                          )
                        } else
                          return (
                            <Box
                              component='li'
                              key={option.id}
                              {...props}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              onClick={() => {
                                selectedProducts.length === 500 && !selectedProducts.find(item => item.id === option.id)
                                  ? toast.error('Vượt quá số sản phầm trong 1 lần nhập phiếu')
                                  : handleSelectProduct(option)
                              }}
                            >
                              <Typography
                                variant='body1'
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  textTransform: 'uppercase',
                                  fontWeight: 'bold'
                                }}
                              >
                                {option.id} - {option.productName}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{
                                  width: '100%',
                                  textAlign: 'left',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                Hoạt chất: {option.ingredients}
                              </Typography>
                              <Typography variant='body1' sx={{ width: '100%', textAlign: 'left' }}>
                                Quy cách: <span style={{ fontWeight: 'bold' }}>{option.specifications}</span>
                              </Typography>
                              <Typography
                                variant='body2'
                                color='textSecondary'
                                sx={{ width: '100%', textAlign: 'left' }}
                              >
                                Giá: {formatVND(option.price)} /{' '}
                                <span style={{ color: 'red' }}>Giá BHYT: {formatVND(option.bhytPrict)} </span>
                              </Typography>
                              <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
                                Tồn kho: {checkTotalRemaining(option.cansales)}
                              </Typography>
                            </Box>
                          )
                      }}
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
                          label='Nhập từ khóa tìm kiếm'
                          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        />
                      )}
                    />
                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                      onClick={() => {
                        refetchProduct({ input: {}, skip: 0 })
                        setIsAutocompleteOpen(!isAutocompleteOpen)
                      }}
                    >
                      <SearchIcon />
                    </Button>
                  </div>
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
                <TableCell style={{ width: '120px' }}>SỐ LƯỢNG </TableCell>
                <TableCell style={{ width: '10%' }}>GIÁ NHẬP </TableCell>
                <TableCell style={{ width: '10%' }}>CHIẾT KHẤU </TableCell>
                <TableCell style={{ width: '10%' }}>% VAT</TableCell>
                <TableCell style={{ width: '10%' }}>THÀNH TIỀN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product: any, index) => (
                <React.Fragment key={index}>
                  <TableRow key={product.id}>
                    <StyledTableCell style={{ width: '10%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{product.id}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>{product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>
                      {/* <Autocomplete
                        autoHighlight
                        openOnFocus
                        // onOpen={async () => await refetchBatchId()}
                        sx={{ minWidth: '200px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        options={product.batches}
                        getOptionLabel={option => (typeof option === 'string' ? option : option.batch1)}
                        value={product.batches.find((i: any) => i.id === product.batchId) ?? null}
                        renderOption={(props, option) => (
                          <Stack key={option.id} {...props} component={'li'} direction={'column'}>
                            <Typography variant='body1' textAlign={'center'}>
                              {option.batch1}
                            </Typography>
                            <Typography variant='caption'>
                              Ngày sản xuất: {moment(option.startDate).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography variant='caption'>
                              Ngày hết hạn: {moment(option.endDate).format('DD/MM/YYYY')}
                            </Typography>
                          </Stack>
                        )}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              batchId: value.id,
                              dueDate: product.batches.find((item: any) => item.id === value.id).endDate
                            }
                            setSelectedProducts(newServices)
                          }
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Chọn số lô'
                            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                          />
                        )}
                      /> */}
                      <Stack direction={'row'}>
                        <IconButton
                          aria-label='Thêm lô'
                          color='error'
                          onClick={() => {
                            setProductId(product.id)
                            setOpen(true)
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
                                batchId: value.id,
                                dueDate: product.batches.find((item: any) => item.id === value.id).endDate
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
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {checkTotalRemainingByBatchId(product.batchId, product)}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id='combo-box-demo'
                        options={unitName}
                        style={{ minWidth: 150 }}
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
                    <StyledTableCell style={{ width: '80px' }}>
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={product.quantity}
                        type='number'
                        inputProps={{ min: 1 }}
                        style={{ width: '70px' }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            finalAmount: Number(e.target.value) * (product.price + (product.price * product.vat) / 100)
                          }
                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '20%' }}>
                      <Typography>{formatVND(product.price)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{formatVND(0)}</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{product.vat ? product.vat : 0}</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{formatVND(product.finalAmount)}</StyledTableCell>
                    <TableCell style={{ width: '10%' }}>
                      <IconButton aria-label='delete' onClick={() => handleRemoveProduct(product.id, index)}>
                        <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
            <AddBatch open={[open, setOpen]} productId={productId} />
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
export default AddWhImportSup
