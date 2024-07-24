import { useMutation, useQuery } from '@apollo/client'
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  Grid2Props,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import apollo from 'src/graphql/apollo'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { Product, WhTransferDtInput, WhTransferInput } from './graphql/variables'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { formatVND } from 'src/utils/formatMoney'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import NoteIcon from '@mui/icons-material/Note'
import DeleteIcon from '@mui/icons-material/Delete'
import { ADD_MANY_CAN_SALE, ADD_MANY_WH_TRANSFER_DT, ADD_WH_TRANSFER, UPDATE_MANY_CAN_SALE } from './graphql/mutation'
import { GET_BATCH, GET_CANSALE, GET_CLINIC, GET_PRODUCT, GET_UNIT, GET_WH } from './graphql/query'
import AddBatch from 'src/components/dialog/batch/adBatch'
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

const AddEpTransfer = () => {
  //======================================HANDLER================================
  const route = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<WhTransferDtInput[]>([])
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [batchId, setBatchId] = useState(true)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    calculateTotals()
    checkBatchId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])
  const user = getLocalstorage('userData')
  const [addData, setAddData] = useState<WhTransferInput>({
    whPersionId: '',
    createAt: new Date(),
    whReleaseId: '',
    whReceivingId: '',
    placeReceivingId: '',
    placeReleaseId: '',
    totalAmount: 0,
    note: '',
    totalQuantity: 0
  })

  const handleAdd = (key: string, value: any) => {
    setAddData({
      ...addData,
      [key]: value
    })
  }

  const checkBatchId = () => {
    selectedProducts.forEach((data: any) => {
      if (data.batchId === null || data.batchId === undefined || data.batchId === '') {
        return setBatchId(false)
      } else {
        setBatchId(true)
      }
    })
  }
  const checkTotalRemaining = (data: any[]) => {
    let total = 0
    data.forEach((p: any) => {
      total += p.totalRemaining
    })
    return total
  }
  const checkTotalRemainingByBatchId = (batchId: string, product: any) => {
    let result: any = 'Không có'
    product.cansales.forEach((data: any) => {
      if (data.batchId === batchId && data.whId === addData.whReleaseId) result = data.totalRemaining
    })
    return result
  }
  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })
  const handleAddEpTransfer = (status: string) => {
    const dataWhEpTransfer = {
      whPersionId: user.id,
      createAt: addData.createAt,
      placeReceivingId: addData.placeReceivingId,
      placeReleaseId: addData.placeReleaseId,
      whReleaseId: addData.whReleaseId,
      whReceivingId: addData.whReceivingId,
      totalAmount: addData.totalAmount,
      //transQuantity: addData.totalQuantity,
      note: addData.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status,
      statusPlaceRelease: true
    }
    if (
      dataWhEpTransfer.whReleaseId === '' ||
      dataWhEpTransfer.whReleaseId === undefined ||
      dataWhEpTransfer.whReleaseId === null
    ) {
      toast.error('Vui lòng chọn kho xuất')
    } else if (
      dataWhEpTransfer.whReceivingId === '' ||
      dataWhEpTransfer.whReceivingId === undefined ||
      dataWhEpTransfer.whReceivingId === null
    ) {
      toast.error('Vui lòng nhập kho nhận')
    } else if (
      dataWhEpTransfer.placeReceivingId === '' ||
      dataWhEpTransfer.placeReceivingId === undefined ||
      dataWhEpTransfer.placeReceivingId === null
    ) {
      toast.error('Vui lòng nhập nơi nhận')
    } else if (
      dataWhEpTransfer.placeReleaseId === '' ||
      dataWhEpTransfer.placeReleaseId === undefined ||
      dataWhEpTransfer.placeReleaseId === null
    ) {
      toast.error('Vui lòng nhập nơi nhận')
    } else if (selectedProducts.length === 0 || selectedProducts.length === undefined) {
      toast.error('Vui lòng chọn sản phẩm')
    } else if (batchId === false) {
      toast.error('Vui lòng nhập đầy đủ số lô')
    } else
      addWhTransfer({
        variables: {
          input: dataWhEpTransfer
        }
      })
        .then((res: any) => {
          const dataWhEpTransferDt = selectedProducts.map((data: WhTransferDtInput) => {
            return {
              whTransferId: res.data.addWhTransfer.id,
              unitId: data.unitId,
              createAt: addData.createAt,
              productId: data.product.id,
              batchId: data.batchId,
              dueDate: data.dueDate,
              transAmount: data.transAmount,
              transQuantity: data.transQuantity,
              clinicId: user.clinicId,
              parentClinicId: user.parentClinicId
            }
          })
          addManyWhTransferDt({
            variables: {
              input: JSON.stringify(dataWhEpTransferDt)
            }
          })
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
                      productId: { eq: product.product.id },
                      batchId: { eq: product.batchId },
                      whId: { eq: addData.whReleaseId }
                    }
                  }
                })
                const canSaleRelease = res.data.getCansale.items
                if (canSaleRelease.length > 0) {
                  const data = {
                    id: canSaleRelease[0].id,
                    quantity: canSaleRelease[0].quantity - product.transQuantity,
                    totalRemaining: canSaleRelease[0].totalRemaining - product.transQuantity
                  }
                  dataUpdate.push(data)
                }
                const r = await apollo.query({
                  query: GET_CANSALE,
                  variables: {
                    input: {
                      productId: { eq: product.product.id },
                      batchId: { eq: product.batchId },
                      whId: { eq: addData.whReceivingId }
                    }
                  }
                })
                const canSaleReceiving = r.data.getCansale.items
                if (canSaleReceiving.length > 0) {
                  const data = {
                    id: canSaleReceiving[0].id,
                    quantity: canSaleReceiving[0].quantity + product.transQuantity,
                    totalRemaining: canSaleReceiving[0].totalRemaining + product.transQuantity
                  }
                  dataUpdate.push(data)
                } else {
                  const data = {
                    quantity: product.transQuantity,
                    totalRemaining: product.transQuantity,
                    whId: addData.whReceivingId,
                    productId: product.product.id,
                    batchId: product.batchId,
                    parentClinicId: user.parentClinicId,
                    clinicId: addData.placeReceivingId
                  }
                  dataAdd.push(data)
                }
              } catch (err) {
                toast.error('Error querying CANSALE')
              }
            }
            if (dataUpdate.length > 0) {
              updateManyCansale({
                variables: {
                  input: JSON.stringify(dataUpdate)
                }
              })
            }
            if (dataAdd.length > 0) {
              addManyCansale({
                variables: {
                  input: JSON.stringify(dataAdd)
                }
              })
            }
          }
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi tạo số phiếu kho mới')
        })
        .then(() => {
          toast.success('Tạo số phiếu mới thành công')
          setAddData((pre: any) => ({
            ...pre,
            whPersionId: '',
            createAt: new Date(),
            whReleaseId: '',
            whReceivingId: '',
            placeReceivingId: '',
            placeReleaseId: '',
            totalAmount: 0,
            note: '',
            totalQuantity: 0
          }))
          setSelectedProducts([])
          apollo.resetStore()
        })
  }

  const handleRemoveProduct = (productId: string, index: number) => {
    setSelectedProducts(pro => {
      const productItem = pro[index]
      if (productItem.product.id === productId) {
        return pro.filter(e => e.product.id !== productId)
      }
      return pro
    })
  }

  const handleSelectProduct = (selectedProduct: Product) => {
    const productIndex = selectedProducts.findIndex(service => service.product.id === selectedProduct.id)
    if (productIndex !== -1) {
      const updateProduct = [...selectedProducts]
      updateProduct[productIndex].transQuantity = (updateProduct[productIndex].transQuantity || 0) + 1
      updateProduct[productIndex].transAmount =
        (updateProduct[productIndex].transQuantity || 0) *
        (selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100)
      setSelectedProducts(updateProduct)
    } else {
      setSelectedProducts(e => [
        ...e,
        {
          batchId: '',
          createAt: addData.createAt,
          dueDate: new Date(),
          product: selectedProduct,
          transQuantity: 1,
          transAmount: selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100,
          unitId: selectedProduct.unitId
        }
      ])
    }
  }

  const calculateTotals = () => {
    let totalAmount = 0
    let totalQuantity = 0
    for (const product of selectedProducts) {
      totalAmount += product.transAmount
      totalQuantity += product.transQuantity
    }
    setAddData((pre: any) => ({
      ...pre,
      totalAmount: totalAmount,
      totalQuantity: totalQuantity
    }))
  }
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
  //======================================DATA===================================
  const [addWhTransfer] = useMutation(ADD_WH_TRANSFER)
  const [updateManyCansale] = useMutation(UPDATE_MANY_CAN_SALE)
  const [addManyWhTransferDt] = useMutation(ADD_MANY_WH_TRANSFER_DT)
  const [addManyCansale] = useMutation(ADD_MANY_CAN_SALE)
  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWhRelease, refetch: refetchWhRelease } = useQuery(GET_WH, {
    variables: { input: { clinicId: { eq: addData.placeReleaseId } } }
  })
  const { data: getWhReceiving, refetch: refetchWhReceiving } = useQuery(GET_WH, {
    variables: { input: { clinicId: { eq: addData.placeReceivingId } } }
  })
  const { data: getProduct, refetch: refetchProduct } = useQuery(GET_PRODUCT, { fetchPolicy: 'network-only' })
  const { data: getClinic } = useQuery(GET_CLINIC)

  const whReleaseList = useMemo(() => {
    return getWhRelease?.getWarehouse?.items ?? []
  }, [getWhRelease])
  const whReceivingList = useMemo(() => {
    return getWhReceiving?.getWarehouse?.items ?? []
  }, [getWhReceiving])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])
  const clinic = useMemo(() => {
    return getClinic?.getClinic?.items ?? []
  }, [getClinic])
  const [productData, setProductData] = useState<Product[]>([])
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const handleOnChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
  }
  useEffect(() => {
    refetchProduct({
      input: { or: [{ id: { contains: debouncedSearchValue } }, { productName: { contains: debouncedSearchValue } }] }
    })
  }, [debouncedSearchValue])
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
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>Điều chuyển</h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, backgroundColor: '#8592A3', width: 125, height: 42, fontSize: '13px' }}
                onClick={() => route.push('/inventory/ep_transfer/')}
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
                    handleAddEpTransfer('301')
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
                    handleAddEpTransfer('302')
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
              Người điều chuyển
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
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Ngày điều chuyển
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
              nơi xuất
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={clinic}
            style={{ width: '100%' }}
            value={clinic.find((x: any) => x.id === addData.placeReleaseId) ?? ''}
            onChange={(e, value: any) => handleAdd('placeReleaseId', value?.id)}
            renderInput={params => (
              <TextField {...params} placeholder='Phòng khám' InputLabelProps={{ shrink: true }} />
            )}
          />
        </CustomGrid>
      </CustomGrid>
      <CustomGrid container display='flex' flexDirection='row'>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              kho xuất
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            disabled={addData.placeReleaseId === ''}
            options={whReleaseList}
            style={{ width: '100%' }}
            value={whReleaseList.find((x: any) => x.id === addData.whReleaseId) ?? ''}
            onChange={(e, value: any) => handleAdd('whReleaseId', value?.id)}
            renderInput={params => <TextField {...params} placeholder='Kho xuất' InputLabelProps={{ shrink: true }} />}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              nơi nhận
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={clinic}
            style={{ width: '100%' }}
            value={clinic.find((x: any) => x.id === addData.placeReceivingId) ?? ''}
            onChange={(e, value: any) => handleAdd('placeReceivingId', value?.id)}
            renderInput={params => (
              <TextField {...params} placeholder='Phòng khám' InputLabelProps={{ shrink: true }} />
            )}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              kho nhận
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            disabled={addData.placeReceivingId === ''}
            options={whReceivingList}
            style={{ width: '100%' }}
            value={whReceivingList.find((x: any) => x.id === addData.whReceivingId) ?? ''}
            onChange={(e, value: any) => handleAdd('whReceivingId', value?.id)}
            renderInput={params => <TextField {...params} placeholder='Kho nhận' InputLabelProps={{ shrink: true }} />}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
              Tổng sl
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            inputProps={{ readOnly: true }}
            value={addData.totalQuantity}
            onChange={e => {
              handleAdd('totalQuantity', parseInt(e.target.value))
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
          <CustomTextField type='text' variant='filled' fullWidth value='Khởi tạo' />
        </CustomGrid>
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
            value={formatVND(addData.totalAmount)}
            onChange={e => {
              handleAdd('totalAmount', parseInt(e.target.value))
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={6} display={'flex'} alignItems={'center'}>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ghi chú
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={addData.note}
            onChange={e => {
              handleAdd('note', parseInt(e.target.value))
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
                              sx={{
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              ref={lastOption}
                              onClick={() => {
                                addData.whReleaseId === ''
                                  ? toast.error('Vui lòng chọn nơi và kho xuất')
                                  : selectedProducts.length === 5 &&
                                    !selectedProducts.find(item => option.id === item.product.id)
                                  ? toast.error('Vượt quá số sản phẩm trong 1 lần nhập phiếu')
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
                                addData.whReleaseId === ''
                                  ? toast.error('Vui lòng chọn kho')
                                  : selectedProducts.length === 5 &&
                                    !selectedProducts.find(item => option.id === item.product.id)
                                  ? toast.error('Vượt quá số sản phẩm trong 1 lần nhập phiếu')
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
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ml: -1 }}
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
                <TableCell style={{ width: '10%' }}>SỐ LÔ</TableCell>
                <TableCell style={{ width: '10%' }}>TỒN KHO</TableCell>
                <TableCell style={{ width: '10%' }}>ĐƠN VỊ TÍNH</TableCell>
                <TableCell style={{ width: '5%' }}>SỐ LƯỢNG </TableCell>
                <TableCell style={{ width: '10%' }}>GIÁ NHẬP </TableCell>
                <TableCell style={{ width: '10%' }}>CHIẾT KHẤU </TableCell>
                <TableCell style={{ width: '10%' }}>% VAT</TableCell>
                <TableCell style={{ width: '10%' }}>THÀNH TIỀN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((whTransferDt: WhTransferDtInput, index) => (
                <React.Fragment key={index}>
                  <TableRow key={whTransferDt.product.id} sx={{ height: 200 }}>
                    <StyledTableCell style={{ width: '5%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{whTransferDt.product.id}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{whTransferDt.product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      {/* <Autocomplete
                        autoHighlight
                        openOnFocus
                        sx={{ minWidth: '250px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        options={whTransferDt.product.batches}
                        getOptionLabel={option => (typeof option === 'string' ? option : option.batch1)}
                        value={whTransferDt.product.batches.find((i: any) => i.id === whTransferDt.batchId) ?? null}
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
                          const serviceIndex = newServices.findIndex(s => s.product.id === whTransferDt.product.id)
                          if (value && value.id) {
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              batchId: value.id,
                              dueDate:
                                whTransferDt.product.batches.find((item: any) => item.id === value.id)?.endDate ??
                                new Date()
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
                      <InputBatchSearch
                        onChange={value => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.product.id === whTransferDt.product.id)
                          if (value && value.id) {
                            if (checkTotalRemainingByBatchId(value.id, whTransferDt.product) === 'Không có') {
                              toast.error(
                                `Sản phẩm: ${whTransferDt.product.id} với mã lô: ${value.id} chưa tồn tại trong kho`
                              )
                            } else {
                              newServices[serviceIndex] = {
                                ...newServices[serviceIndex],
                                batchId: value.id,
                                dueDate:
                                  whTransferDt.product.batches.find((item: any) => item.id === value.id)?.endDate ??
                                  new Date()
                              }
                              setSelectedProducts(newServices)
                            }
                          }
                        }}
                        onSearch={e => {
                          console.log(e)
                        }}
                        product={whTransferDt.product}
                        batchId={whTransferDt.batchId}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      {checkTotalRemainingByBatchId(whTransferDt.batchId, whTransferDt.product)}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id='combo-box-demo'
                        options={unitName}
                        style={{ minWidth: 150 }}
                        value={unitName.find((x: any) => x.id === whTransferDt.unitId) ?? null}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.product.id === whTransferDt.product.id)
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
                    <StyledTableCell style={{ width: '5%' }}>
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={whTransferDt.transQuantity}
                        type='number'
                        inputProps={{
                          min: 1,
                          max: checkTotalRemainingByBatchId(whTransferDt.batchId, whTransferDt.product)
                        }}
                        style={{ width: '70px' }}
                        onChange={e => {
                          if (
                            e.target.value > checkTotalRemainingByBatchId(whTransferDt.batchId, whTransferDt.product)
                          ) {
                            toast.error('Số lượng vượt quá tồn kho')
                          } else {
                            const newServices = [...selectedProducts]
                            const serviceIndex = newServices.findIndex(s => s.product.id === whTransferDt.product.id)
                            newServices[serviceIndex] = {
                              ...newServices[serviceIndex],
                              transQuantity: Number(e.target.value),
                              transAmount:
                                Number(e.target.value) *
                                (whTransferDt.product.price +
                                  (whTransferDt.product.price * whTransferDt.product.vat) / 100)
                            }
                            setSelectedProducts(newServices)
                          }
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '10%' }}>
                      <Typography>{formatVND(whTransferDt.product.price)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{formatVND(0)}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      {whTransferDt.product.vat ? whTransferDt.product.vat : 0}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%', position: 'relative' }}>
                      <Typography>{formatVND(whTransferDt.transAmount)}</Typography>
                      <IconButton
                        sx={{ position: 'absolute', right: 10, bottom: 80 }}
                        aria-label='delete'
                        onClick={() => handleRemoveProduct(whTransferDt.product.id, index)}
                      >
                        <DeleteIcon sx={{ color: 'red' }} />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
            <AddBatch open={[open, setOpen]} />
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default AddEpTransfer
