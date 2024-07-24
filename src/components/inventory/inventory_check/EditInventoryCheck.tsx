import React, { useState, useEffect, useMemo, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

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
  Paper,
  Divider,
  Typography,
  Collapse,
  MenuItem,
  Grid2Props,
  Menu,
  CircularProgress,
  TextareaAutosize,
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

import { GET_WH, GET_WH_CHECK_INV, GET_PRODUCT, GET_UNIT, GET_BATCH, GET_CANSALE } from './graphql/query'

import { CanSale, Product, WhCheckInvDt, whChechInvInput } from './graphql/variables'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { formatVND } from 'src/utils/formatMoney'
import AddBatch from '../../dialog/batch/adBatch'
import { useRouter } from 'next/router'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import moment from 'moment'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  ADD_MANY_WH_INVENTORY_CHECK_DT,
  DELETE_WH_CHECK_INV_DT,
  UPDATE_MANY_CAN_SALE,
  UPDATE_MANY_WH_CHECK_INV_DT,
  UPDATE_WH_CHECK_INV
} from './graphql/mutaion'
import apollo from 'src/graphql/apollo'
import useDebounce from 'src/hooks/useDebounce'
import InputBatchSearch from 'src/components/inputSearch/InputBatchSearch'

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
type Props = {
  id?: string | undefined
}
const EditInventoryCheck = (props: Props) => {
  //===========================================DATA==================================
  const user = getLocalstorage('userData')
  const [updateWhInventoryCheck] = useMutation(UPDATE_WH_CHECK_INV)
  const [updateManyWhInventoryCheckDt] = useMutation(UPDATE_MANY_WH_CHECK_INV_DT)
  const [deleteWhInventoryCheckDt] = useMutation(DELETE_WH_CHECK_INV_DT)
  const [addManyWhInventoryCheckDt] = useMutation(ADD_MANY_WH_INVENTORY_CHECK_DT)
  const [updateManyCansale] = useMutation(UPDATE_MANY_CAN_SALE)
  const {
    data: getWhCheckInv,
    refetch: refetchWhInventoryCheck,
    loading: loadingWh
  } = useQuery(GET_WH_CHECK_INV, { variables: { input: { id: { eq: props.id } } } })
  const { data: getProduct, refetch: refetchProduct } = useQuery(GET_PRODUCT, { fetchPolicy: 'network-only' })
  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH)

  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])

  const [productData, setProductData] = useState<Product[]>([])
  //===========================================HANDLER===============================
  const route = useRouter()
  const [batchId, setBatchId] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openSelected = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<WhCheckInvDt[]>([])
  const [baseWhCheckInvDt, setBaseWhCheckInvDt] = useState<WhCheckInvDt[]>([])
  const [dataEdit, setDataEdit] = useState<whChechInvInput>()

  const [expandedCard, setExpandedCard] = useState({
    card1: true
  })
  useEffect(() => {
    //refetchWhInventoryCheck({ input: { id: { eq: props.id } } })
    setDataEdit(getWhCheckInv?.getWhCheckInv?.items[0])
    const WhCheckInvDt: WhCheckInvDt[] = getWhCheckInv?.getWhCheckInv?.items[0]?.whCheckInvDts
    if (WhCheckInvDt && WhCheckInvDt.length > 0) {
      const WhCheckInvDtData: WhCheckInvDt[] = WhCheckInvDt.map((e: WhCheckInvDt) => ({
        id: e.id,
        unitId: e.unitId,
        whCheckInvId: e.whCheckInvId,
        amountDifference: e.amountDifference,
        dueDate: e.dueDate,
        qtyExistBeforeCheck: e.qtyExistBeforeCheck,
        qtyExistAfterCheck: e.qtyExistAfterCheck,
        batchId: e.batchId,
        product: e.product
      }))
      setSelectedProducts(WhCheckInvDtData)
      setBaseWhCheckInvDt(WhCheckInvDtData)
    }
  }, [getWhCheckInv])
  useEffect(() => {
    checkBatchId()
    calculateTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])
  const checkBatchId = () => {
    selectedProducts.forEach((data: WhCheckInvDt) => {
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
  const checkTotalRemainingByBatchId = (batchId: string, product: Product) => {
    let result: any = 'Không có'
    product.cansales.forEach((data: CanSale) => {
      if (data.batchId === batchId && data.whId === dataEdit?.whReleaseId) result = data.totalRemaining
    })
    return result
  }

  const handleEdit = (key: string, value: any) => {
    setDataEdit({
      ...dataEdit,
      [key]: value
    })
  }

  const handleEditWhCheckInv = (status: string) => {
    const dataWhCheckInv = {
      id: dataEdit?.id,
      createAt: dataEdit?.createAt,
      whReleaseId: dataEdit?.whReleaseId,
      whPersionId: dataEdit?.whPersionId,
      totalDifference: dataEdit?.totalDifference,
      note: dataEdit?.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status
    }
    if (
      dataWhCheckInv.whReleaseId === '' ||
      dataWhCheckInv.whReleaseId === undefined ||
      dataWhCheckInv.whReleaseId === null
    ) {
      toast.error('Vui lòng chọn kho nhập')
    } else if (selectedProducts.length === 0 || selectedProducts.length === undefined) {
      toast.error('Vui lòng chọn sản phẩm')
    } else if (batchId === false) {
      toast.error('Vui lòng nhập đầy đủ số lô')
    } else
      updateWhInventoryCheck({
        variables: {
          input: JSON.stringify(dataWhCheckInv)
        },
        onError: () => {
          toast.error('Có lỗi khi cập nhật thông tin phiếu kho')
        }
      })
        .then(res => {
          const existProduct: WhCheckInvDt[] = selectedProducts.filter(item => item.id !== '')
          const newProduct: WhCheckInvDt[] = selectedProducts.filter(item => item.id === '')
          const deleteProduct: WhCheckInvDt[] = baseWhCheckInvDt.filter(
            item => !selectedProducts.find(item1 => item.product.id === item1.product.id)
          )
          if (existProduct.length > 0) {
            const dataUpdate = existProduct.map((data: WhCheckInvDt) => {
              return {
                id: data.id,
                unitId: data.unitId,
                amountDifference: data.amountDifference,
                dueDate: data.dueDate,
                qtyExistBeforeCheck: data.qtyExistBeforeCheck,
                qtyExistAfterCheck: data.qtyExistAfterCheck,
                batchId: data.batchId
              }
            })
            updateManyWhInventoryCheckDt({
              variables: {
                input: JSON.stringify(dataUpdate)
              },
              onError: () => {
                toast.error('Có lỗi xảy khi cập nhập chi tiết phiếu nhập kho')
              }
            })
          }
          if (newProduct.length > 0) {
            const dataNew = newProduct.map((data: WhCheckInvDt) => {
              return {
                id: null,
                unitId: data.unitId,
                whCheckInvId: dataEdit?.id,
                productId: data.product.id,
                amountDifference: data.amountDifference,
                dueDate: data.dueDate,
                qtyExistBeforeCheck: data.qtyExistBeforeCheck,
                qtyExistAfterCheck: data.qtyExistAfterCheck,
                batchId: data.batchId,
                clinicId: user.clinicId,
                parentClinicId: user.parentClinicId
              }
            })
            addManyWhInventoryCheckDt({
              variables: {
                input: JSON.stringify(dataNew)
              },
              onError: () => {
                toast.error('Có lỗi xảy ra khi thêm chi tiết phiếu kho mới')
              }
            })
          }
          if (deleteProduct.length > 0) {
            deleteProduct.map((data: WhCheckInvDt) => {
              deleteWhInventoryCheckDt({
                variables: {
                  input: data.id
                },
                onError: () => {
                  toast.error('Có lỗi xảy ra khi xóa chi tiết phiếu kho mới')
                }
              })
            })
          }
        })
        .then(async res => {
          if (status === '302') {
            const dataUpdate: any[] = []
            for (const product of selectedProducts) {
              const res = await apollo.query({
                query: GET_CANSALE,
                variables: {
                  input: {
                    productId: { eq: product.product.id },
                    batchId: { eq: product.batchId },
                    whId: { eq: dataEdit?.whReleaseId }
                  }
                }
              })
              const canSale = res.data.getCansale.items
              if (canSale.length > 0) {
                const data = {
                  id: canSale[0].id,
                  quantity: canSale[0].quantity + (product.qtyExistAfterCheck - product.qtyExistBeforeCheck),
                  totalRemaining: product.qtyExistAfterCheck
                }
                dataUpdate.push(data)
              }
            }
            if (dataUpdate.length > 0) {
              updateManyCansale({
                variables: {
                  input: JSON.stringify(dataUpdate)
                }
              })
            }
          } else {
            refetchWhInventoryCheck({
              input: { id: { eq: props.id } }
            })
          }
        })
        .catch(() => {
          toast.error('Có lỗi khi cập nhật chi tiết phiếu')
        })
        .then(() => {
          toast.success(`Cập nhật phiếu kho với id: ${dataEdit?.id} thành công`)
          refetchWhInventoryCheck({
            input: { id: { eq: props.id } }
          })
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
      updateProduct[productIndex].qtyExistAfterCheck = (updateProduct[productIndex].qtyExistAfterCheck || 0) + 1
      updateProduct[productIndex].amountDifference =
        (updateProduct[productIndex].qtyExistAfterCheck - updateProduct[productIndex].qtyExistBeforeCheck) *
        (selectedProduct.price + (selectedProduct.vat * selectedProduct.price) / 100)
      setSelectedProducts(updateProduct)
    } else {
      setSelectedProducts(e => [
        ...e,
        {
          id: '',
          unitId: selectedProduct.unitId,
          whCheckInvId: dataEdit?.id || '',
          product: selectedProduct,
          batchId: '',
          dueDate: new Date(),
          qtyExistBeforeCheck: 0,
          qtyExistAfterCheck: 1,
          amountDifference: 0
        }
      ])
    }
  }
  const calculateTotals = () => {
    let totalDifference = 0

    for (const product of selectedProducts) {
      totalDifference += product.amountDifference
    }
    setDataEdit((pre: any) => ({
      ...pre,
      totalDifference: totalDifference
    }))
  }
  const checkSale = (batchId: string, product: Product) => {
    if (dataEdit?.status === '301') return false
    else {
      const cansale = product.cansales.find(item => item.batchId === batchId)
      return cansale?.totalRemaining !== cansale?.quantity
    }
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
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>SỬA PHIẾU KIỂM KHO</h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{ pl: 5, backgroundColor: '#8592A3', width: 125, height: 42, fontSize: '13px' }}
                onClick={() => route.push('/inventory/inventory-check/')}
                startIcon={<ArrowBackIcon />}
              >
                Quay lại
              </Button>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  disabled={dataEdit?.status === '302'}
                  sx={{ backgroundColor: '#0292B1', color: 'white', width: 135, height: 42, fontSize: '13px' }}
                  startIcon={<NoteIcon />}
                  onClick={() => {
                    handleEditWhCheckInv('301')
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
                    fontSize: '13px'
                  }}
                  onClick={() => {
                    handleEditWhCheckInv('302')
                  }}
                  startIcon={<SaveIcon />}
                >
                  {dataEdit?.status === '301' ? 'HOÀN THÀNH' : 'SỬA PHIẾU'}
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
          <CustomTextField
            type='text'
            inputProps={{ readOnly: true }}
            variant='filled'
            fullWidth
            value={dataEdit?.id}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Người kiểm kê
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            inputProps={{ readOnly: true }}
            value={user.firstName + ' ' + user.lastName}
            onChange={e => {
              handleEdit('whPersionId', user.id)
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ngày kiểm kê
            </Typography>
          </CustomBox>
          <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
            <ReactDatePicker
              selected={moment(dataEdit?.createAt).toDate()}
              dateFormat={'dd/MM/yyyy HH:mm'}
              readOnly={dataEdit?.status === '302'}
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
              onChange={(date: Date) => handleEdit('createAt', date)}
            />
          </DatePickerWrapper>
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Kho
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={whName}
            readOnly={dataEdit?.status === '302'}
            style={{ width: '100%' }}
            value={whName.find((x: any) => x.id === dataEdit?.whReleaseId) ?? null}
            onChange={(e, value: any) => handleEdit('whReleaseId', value?.id)}
            renderInput={params => <TextField {...params} placeholder='Kho' InputLabelProps={{ shrink: true }} />}
          />
        </CustomGrid>
      </CustomGrid>
      <Grid container display={'flex'} direction={'row'}>
        <CustomGrid xs={3} container display={'flex'} direction={'column'}>
          <CustomGrid item display='flex' alignItems='center'>
            <CustomBox>
              <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }} textAlign={'center'}>
                Tổng giá trị chênh lệch
              </Typography>
            </CustomBox>
            <CustomTextField
              type='text'
              variant='filled'
              inputProps={{ readOnly: true }}
              fullWidth
              value={formatVND(dataEdit?.totalDifference || 0)}
              onChange={e => {
                handleEdit('totalDifference', parseInt(e.target.value))
              }}
            />
          </CustomGrid>
          <CustomGrid item display='flex' alignItems='center'>
            <CustomBox>
              <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
                Trạng thái
              </Typography>
            </CustomBox>
            <CustomTextField
              type='text'
              variant='filled'
              fullWidth
              inputProps={{ readOnly: true }}
              value={status.find((x: any) => x.id === dataEdit?.status)?.name ?? ''}
            />
          </CustomGrid>
        </CustomGrid>
        <CustomGrid item xs={9} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
              Ghi chú
            </Typography>
          </CustomBox>
          <TextareaAutosize
            style={{
              width: '100%',
              fontFamily: 'inherit',
              letterSpacing: 'inherit',
              color: 'currentcolor',
              fontSize: '1rem',
              height: '100%',
              border: 'none'
            }}
            value={dataEdit?.note}
            onChange={e => {
              handleEdit('note', e.target.value)
            }}
          />
        </CustomGrid>
      </Grid>
      <Grid container spacing={0}>
        <Grid item xs={6} style={{ marginLeft: '-20px' }}>
          <Collapse in={expandedCard['card1']} timeout='auto' unmountOnExit>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <div style={{ display: 'flex' }}>
                    <Autocomplete
                      autoHighlight
                      openOnFocus
                      loading={loading}
                      sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      options={productData === null || productData === undefined ? [] : productData}
                      open={isAutocompleteOpen}
                      onOpen={async () => {
                        refetchProduct({ input: {}, skip: 0 })
                        setIsAutocompleteOpen(true)
                      }}
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
                                dataEdit?.status === '301'
                                  ? selectedProducts.length === 500 &&
                                    !selectedProducts.find(item => item.product.id === option.id)
                                    ? toast.error('Vượt quá số sản phầm trong 1 lần nhập phiếu')
                                    : handleSelectProduct(option)
                                  : toast.error('Phiếu đã hoàn thành vui lòng không thêm sản phẩm mới')
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
                                dataEdit?.status === '301'
                                  ? selectedProducts.length === 500 &&
                                    !selectedProducts.find(item => item.product.id === option.id)
                                    ? toast.error('Vượt quá số sản phầm trong 1 lần nhập phiếu')
                                    : handleSelectProduct(option)
                                  : toast.error('Phiếu đã hoàn thành vui lòng không thêm sản phẩm mới')
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
                <TableCell style={{ width: '15%' }}>TÊN HÀNG HÓA</TableCell>
                <TableCell style={{ width: '10%' }}>SỐ LÔ</TableCell>
                <TableCell style={{ width: '10%' }}>Đơn VỊ Tính</TableCell>
                <TableCell style={{ width: '10%' }}>TỒN TRƯỚC KIỂM</TableCell>
                <TableCell style={{ width: '10%' }}>TỒN SAU KIỂM</TableCell>
                <TableCell style={{ width: '15%' }}>CHÊCH LỆCH SỐ LƯỢNG</TableCell>
                <TableCell style={{ width: '15%' }}>CHÊCH LỆCH THÀNH TIỀN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((whCheckInvDt: WhCheckInvDt, index) => (
                <React.Fragment key={index}>
                  <TableRow key={whCheckInvDt.product.id}>
                    <StyledTableCell style={{ width: '5%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{whCheckInvDt.product.id}</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{whCheckInvDt.product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      {dataEdit?.status === '301' ? (
                        // <Autocomplete
                        //   autoHighlight
                        //   openOnFocus
                        //   sx={{ minWidth: '200px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        //   options={whCheckInvDt.product.batches}
                        //   getOptionLabel={option => (typeof option === 'string' ? option : option.batch1)}
                        //   value={whCheckInvDt.product.batches.find(i => i.id === whCheckInvDt.batchId) ?? null}
                        //   renderOption={(props, option) => (
                        //     <Stack key={option.id} {...props} component={'li'} direction={'column'}>
                        //       <Typography variant='body1' textAlign={'center'}>
                        //         {option.batch1}
                        //       </Typography>
                        //       <Typography variant='caption'>
                        //         Ngày sản xuất: {moment(option.startDate).format('DD/MM/YYYY')}
                        //       </Typography>
                        //       <Typography variant='caption'>
                        //         Ngày hết hạn: {moment(option.endDate).format('DD/MM/YYYY')}
                        //       </Typography>
                        //     </Stack>
                        //   )}
                        //   onChange={(e: any, value: any) => {
                        //     const newServices = [...selectedProducts]
                        //     const serviceIndex = newServices.findIndex(s => s.product.id === whCheckInvDt.product.id)
                        //     if (value && value.id) {
                        //       newServices[serviceIndex] = {
                        //         ...newServices[serviceIndex],
                        //         batchId: value.id,
                        //         dueDate:
                        //           whCheckInvDt.product.batches.find(item => item.id === value.id)?.endDate ??
                        //           new Date(),
                        //         qtyExistBeforeCheck: checkTotalRemainingByBatchId(value.id, whCheckInvDt.product),
                        //         amountDifference:
                        //           (newServices[serviceIndex].qtyExistAfterCheck -
                        //             checkTotalRemainingByBatchId(value.id, whCheckInvDt.product)) *
                        //           (whCheckInvDt.product.price +
                        //             (whCheckInvDt.product.price * whCheckInvDt.product.vat) / 100)
                        //       }
                        //       setSelectedProducts(newServices)
                        //     }
                        //   }}
                        //   renderInput={params => (
                        //     <TextField
                        //       {...params}
                        //       label='Chọn số lô'
                        //       sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
                        //     />
                        //   )}
                        // />
                        <InputBatchSearch
                        onChange={value => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.product.id === whCheckInvDt.product.id)
                          if (value && value.id) {
                            if (checkTotalRemainingByBatchId(value.id, whCheckInvDt.product) === 'Không có') {
                              toast.error(`Sản phẩm: ${whCheckInvDt.product.id} với mã lô: ${value.id} chưa tồn tại trong kho`)
                            } else {
                              newServices[serviceIndex] = {
                                ...newServices[serviceIndex],
                                batchId: value.id,
                                dueDate: whCheckInvDt.product.batches.find((item: any) => item.id === value.id)?.endDate ?? new Date(),
                                qtyExistBeforeCheck: checkTotalRemainingByBatchId(value.id, whCheckInvDt.product),
                                amountDifference:
                                  (newServices[serviceIndex]?.qtyExistAfterCheck -
                                    checkTotalRemainingByBatchId(value.id, whCheckInvDt.product)) *
                                  (whCheckInvDt.product.price + (whCheckInvDt.product.price * whCheckInvDt.product.vat) / 100)
                              }
                              setSelectedProducts(newServices)
                            }
                          }
                        }}
                        onSearch={e => {
                          console.log(e)
                        }}
                        product={whCheckInvDt.product}
                        batchId={whCheckInvDt.batchId}
                      />
                      ) : (
                        whCheckInvDt.batchId
                      )}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <Autocomplete
                        fullWidth
                        autoHighlight
                        id='combo-box-demo'
                        options={unitName}
                        style={{ minWidth: 150 }}
                        value={unitName.find((x: any) => x.id === whCheckInvDt.unitId) ?? null}
                        onChange={(e: any, value: any) => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.product.id === whCheckInvDt.product.id)
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
                    <StyledTableCell style={{ width: '10%' }}>
                      <Typography>
                        {dataEdit?.status === '301'
                          ? checkTotalRemainingByBatchId(whCheckInvDt.batchId, whCheckInvDt.product)
                          : whCheckInvDt.qtyExistBeforeCheck}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={whCheckInvDt.qtyExistAfterCheck}
                        type='number'
                        inputProps={{ min: 1 }}
                        style={{ width: '70px' }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.product.id === whCheckInvDt.product.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            qtyExistAfterCheck: Number(e.target.value),
                            amountDifference:
                              (Number(e.target.value) - newServices[serviceIndex].qtyExistBeforeCheck) *
                              (whCheckInvDt.product.price +
                                (whCheckInvDt.product.price * whCheckInvDt.product.vat) / 100)
                          }
                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      <Typography>{whCheckInvDt.qtyExistAfterCheck - whCheckInvDt.qtyExistBeforeCheck}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%', position: 'relative' }}>
                      <Typography>{formatVND(whCheckInvDt.amountDifference)}</Typography>
                      <IconButton
                        disabled={dataEdit?.status === '302'}
                        sx={{
                          position: 'absolute',
                          right: 10,
                          top: 25,
                          '&:disabled': {
                            cursor: 'not-allowed',
                            pointerEvents: 'all !important'
                          }
                        }}
                        aria-label='delete'
                        onClick={() => handleRemoveProduct(whCheckInvDt.product.id, index)}
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
export default EditInventoryCheck
