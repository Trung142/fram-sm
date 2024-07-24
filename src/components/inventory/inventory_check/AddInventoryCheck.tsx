import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  TextareaAutosize,
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

import { GET_WH, GET_PRODUCT, GET_UNIT, GET_BATCH, GET_CANSALE } from './graphql/query'
import { formatVND } from 'src/utils/formatMoney'
import { getLocalstorage } from 'src/utils/localStorageSide'
import AddBatch from '../../dialog/batch/adBatch'
import { useRouter } from 'next/router'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { ADD_MANY_WH_INVENTORY_CHECK_DT, ADD_WH_INVENTORY_CHECK, UPDATE_MANY_CAN_SALE } from './graphql/mutaion'
import apollo from 'src/graphql/apollo'
import { Product } from './graphql/variables'
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

const AddInventoryCheck = () => {
  //======================================HANDLER================================

  const route = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [batchId, setBatchId] = useState(true)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    calculateTotals()
    checkBatchId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])
  const user = getLocalstorage('userData')
  const [addData, setAddData] = useState<any>({
    whPersionId: '',
    createAt: new Date(),
    whReleaseId: '',
    totalDifference: 0,
    note: ''
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
  const handleAddInventoryCheck = (status: string) => {
    const dataWhInventoryCheck = {
      whPersionId: user.id,
      createAt: addData.createAt,
      whReleaseId: addData.whReleaseId,
      totalDifference: addData.totalDifference,
      note: addData.note,
      clinicId: user.clinicId,
      parentClinicId: user.parentClinicId,
      status: status
    }
    if (
      dataWhInventoryCheck.whReleaseId === '' ||
      dataWhInventoryCheck.whReleaseId === undefined ||
      dataWhInventoryCheck.whReleaseId === null
    ) {
      toast.error('Vui lòng chọn kho nhập')
    } else if (selectedProducts.length === 0 || selectedProducts.length === undefined) {
      toast.error('Vui lòng chọn sản phẩm')
    } else if (batchId === false) {
      toast.error('Vui lòng nhập đầy đủ số lô')
    } else
      addWhInventoryCheck({
        variables: {
          input: dataWhInventoryCheck
        }
      })
        .then((res: any) => {
          const dataWhInventoryCheckDt = selectedProducts.map((data: any) => {
            return {
              whCheckInvId: res.data.addWhCheckInv.id,
              unitId: data.unitId,
              createAt: addData.createAt,
              qtyExistBeforeCheck: data.qtyExistBeforeCheck,
              qtyExistAfterCheck: data.qtyExistAfterCheck,
              batchId: data.batchId,
              productId: data.id,
              dueDate: data.dueDate,
              amountDifference: data.amountDifference,
              clinicId: user.clinicId,
              parentClinicId: user.parentClinicId
            }
          })
          addManyWhInventoryCheckDt({
            variables: {
              input: JSON.stringify(dataWhInventoryCheckDt)
            }
          })
        })
        .then(async res => {
          if (status === '302') {
            const dataUpdate: any[] = []
            for (const product of selectedProducts) {
              const res = await apollo.query({
                query: GET_CANSALE,
                variables: {
                  input: {
                    productId: { eq: product.id },
                    batchId: { eq: product.batchId },
                    whId: { eq: addData.whReleaseId }
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
            totalDifference: 0,
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

  const handleSelectProduct = (selectedProduct: any) => {
    const productIndex = selectedProducts.findIndex(service => service.id === selectedProduct.id)
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
          ...selectedProduct,
          qtyExistAfterCheck: 1,
          amountDifference:
            (selectedProduct.qtyExistAfterCheck - selectedProduct.qtyExistBeforeCheck) * selectedProduct.price +
            (selectedProduct.vat * selectedProduct.price) / 100
        }
      ])
    }
  }

  const calculateTotals = () => {
    let totalDifference = 0

    for (const product of selectedProducts) {
      totalDifference += product.amountDifference
    }
    setAddData((pre: any) => ({
      ...pre,
      totalDifference: totalDifference
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
  const [addWhInventoryCheck] = useMutation(ADD_WH_INVENTORY_CHECK)
  const [updateManyCansale] = useMutation(UPDATE_MANY_CAN_SALE)
  const [addManyWhInventoryCheckDt] = useMutation(ADD_MANY_WH_INVENTORY_CHECK_DT)
  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH)
  const { data: getProduct, refetch: refetchProduct } = useQuery(GET_PRODUCT, { fetchPolicy: 'network-only' })

  const whName = useMemo(() => {
    return getWh?.getWarehouse?.items ?? []
  }, [getWh])
  const unitName = useMemo(() => {
    return getUnit?.getUnit?.items ?? []
  }, [getUnit])
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
  //====================================================RENDER==================================
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>Kiểm kho</h2>
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
                  sx={{ backgroundColor: '#0292B1', color: 'white', width: 135, height: 42, fontSize: '13px' }}
                  startIcon={<NoteIcon />}
                  onClick={e => {
                    handleAddInventoryCheck('301')
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
                    handleAddInventoryCheck('302')
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
              handleAdd('whPersionId', user.id)
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
              Kho
            </Typography>
          </CustomBox>
          <Autocomplete
            id='free-solo-2-demo'
            options={whName}
            style={{ width: '100%' }}
            value={whName.find((x: any) => x.id === addData.whReleaseId) ?? ''}
            onChange={(e, value: any) => handleAdd('whReleaseId', value?.id)}
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
              fullWidth
              inputProps={{ readOnly: true }}
              value={formatVND(addData.totalDifference || 0)}
              onChange={e => {
                handleAdd('totalDifference', parseInt(e.target.value))
              }}
            />
          </CustomGrid>
          <CustomGrid item display='flex' alignItems='center'>
            <CustomBox>
              <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>
                Trạng thái
              </Typography>
            </CustomBox>
            <CustomTextField type='text' variant='filled' fullWidth value='Khởi tạo' />
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
            value={addData.note}
            onChange={e => {
              handleAdd('note', e.target.value)
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
                                  ? toast.error('Vui lòng chọn kho')
                                  : selectedProducts.length === 500 &&
                                    !selectedProducts.find(item => option.id === item.id)
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
                                  : selectedProducts.length === 500 &&
                                    !selectedProducts.find(item => option.id === item.id)
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
              sx={{
                backgroundColor: 'white',
                fontSize: '1rem',
                fontWeight: '800',
                borderBottomColor: '#32475C61',
                fontFamily: 'inherit'
              }}
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
              {selectedProducts.map((product: any, index) => (
                <React.Fragment key={index}>
                  <TableRow key={product.id}>
                    <StyledTableCell style={{ width: '5%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{product.id}</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
                      {/* <Autocomplete
                        autoHighlight
                        openOnFocus
                        sx={{ minWidth: '250px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
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
                              dueDate: product.batches.find((item: any) => item.id === value.id).endDate,
                              qtyExistBeforeCheck: checkTotalRemainingByBatchId(value.id, product),
                              amountDifference:
                                (newServices[serviceIndex].qtyExistAfterCheck -
                                  checkTotalRemainingByBatchId(value.id, product)) *
                                (product.price + (product.price * product.vat) / 100)
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
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          if (value && value.id) {
                            if (checkTotalRemainingByBatchId(value.id, product) === 'Không có') {
                              toast.error(`Sản phẩm: ${product.id} với mã lô: ${value.id} chưa tồn tại trong kho`)
                            } else {
                              newServices[serviceIndex] = {
                                ...newServices[serviceIndex],
                                batchId: value.id,
                                dueDate: product.batches.find((item: any) => item.id === value.id).endDate,
                                qtyExistBeforeCheck: checkTotalRemainingByBatchId(value.id, product),
                                amountDifference:
                                  (newServices[serviceIndex].qtyExistAfterCheck -
                                    checkTotalRemainingByBatchId(value.id, product)) *
                                  (product.price + (product.price * product.vat) / 100)
                              }
                              setSelectedProducts(newServices)
                            }
                          }
                        }}
                        onSearch={e => {
                          console.log(e)
                        }}
                        product={product}
                        batchId={product.batchId}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>
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
                    <StyledTableCell style={{ width: '10%' }}>
                      <Typography>{checkTotalRemainingByBatchId(product.batchId, product)}</Typography>
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '10%' }}>
                      <TextField
                        id='outlined-basic'
                        variant='outlined'
                        value={product.qtyExistAfterCheck}
                        type='number'
                        inputProps={{ min: 1 }}
                        style={{ width: '70px' }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            qtyExistAfterCheck: Number(e.target.value),
                            amountDifference:
                              (Number(e.target.value) - newServices[serviceIndex].qtyExistBeforeCheck) *
                              (product.price + (product.price * product.vat) / 100)
                          }
                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '15%' }}>
                      <Typography>{product.qtyExistAfterCheck - product.qtyExistBeforeCheck}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%', position: 'relative' }}>
                      <Typography>
                        {formatVND(
                          (product.qtyExistAfterCheck - product.qtyExistBeforeCheck) *
                            (product.price + (product.price * product.vat) / 100)
                        )}
                      </Typography>
                      <IconButton
                        sx={{ position: 'absolute', right: 10, top: 25 }}
                        aria-label='delete'
                        onClick={() => handleRemoveProduct(product.id, index)}
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
export default AddInventoryCheck
