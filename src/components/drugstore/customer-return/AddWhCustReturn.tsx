import React, { useState, useEffect, useMemo, useRef } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import MUIDialog from 'src/@core/components/dialog'
// import UpdateWhEx from './update'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid2Props,
  CircularProgress
} from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import toast from 'react-hot-toast'
import SaveIcon from '@mui/icons-material/Save'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Icon from 'src/@core/components/icon'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'

import Link from 'next/link'
import { GET_WH, GET_UNIT, GET_BATCH, GET_CANSALES } from './graphql/query'
import {
  ADD_CANSALE,
  ADD_MANY_CANSALE,
  ADD_WH_CUST_RETURN,
  ADD_WH_MANY_CUST_RETURN_DT,
  UPDATE_CANSALE,
  UPDATE_MANY_CANSALE
} from './graphql/mutation'
import { ICanSale, IpInventory, Product, ProductGroup, RequestType } from './graphql/variables'
import { formatVND } from 'src/utils/formatMoney'
import { getLocalstorage } from 'src/utils/localStorageSide'
import AddBatch from '../../dialog/batch/adBatch'
import { useRouter } from 'next/navigation'
import InputProductSearch from 'src/components/inputSearch/InputProductSearch'
import InputBatchSearch from 'src/components/inputSearch/InputBatchSearch'
const tienichex = [
  { id: 1, name: 'Xuất mẫu có data (Excel)' },
  { id: 2, name: 'Xuất mẫu không data (Excel)' },
  { id: 3, name: 'In phiếu ' }
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
  // borderBottom: '1px solid #e0e0e0',
}))

const AddWhCustReturn = () => {
  const [AddWhCustReturn] = useMutation(ADD_WH_CUST_RETURN)
  const [AddCansale] = useMutation(ADD_CANSALE)
  const [UpdateCansale] = useMutation(UPDATE_CANSALE)
  const [AddManyCustReturnDt] = useMutation(ADD_WH_MANY_CUST_RETURN_DT)
  const [Tongtien, setTongtien] = useState(0)
  const [batchId, setBatchId] = useState('')
  const router = useRouter()
  const [Tongtienvat, setTongtienvat] = useState(0)
  const client = useApolloClient()
  const [Tongthanhtien, setTongthanhtien] = useState<number>(0)
  const { data: getBatchData } = useQuery(GET_BATCH)
  const [open, setOpen] = useState(false)

  const batchData: any[] = useMemo(() => {
    return getBatchData?.getBatch?.items ?? []
  }, [getBatchData])
  const [utilities, setUtilities] = React.useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setUtilities(event.target.value as string)
  }
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const { data: getUnit } = useQuery(GET_UNIT)
  const { data: getWh } = useQuery(GET_WH)

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
    calculateTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts])

  const user = getLocalstorage('userData')
  const [addData, setAddData] = useState<IpInventory>({
    whPersionId: '',
    createAt: new Date(),
    whId: '',
    totalAmount: Tongtien,
    totalDiscount: 0,
    unitId: '',
    totalVatAmount: Tongtienvat,
    finalAmount: Tongthanhtien,
    note: ''
  })

  const handleAdd = (key: string, value: string | number) => {
    setAddData({
      ...addData,
      [key]: value
    })
  }
  const handleAddWhCustReturn = async (status: string) => {
    if (addData.whId === '' || addData.whId === null) {
      toast.error('Vui lòng chọn kho nhập')
      return
    }

    const [batch] = selectedProducts.map((data: any) => {
      if (data.batchId === null || data.batchId === '' || data.batchId === undefined) {
        return true
      }
    })
    if (batch) {
      toast.error('Bạn chưa chọn mã số lô cho sản phẩm')
      return
    } else {
      const dataWhCustReturn = {
        whPersionId: user.id,
        createAt: new Date(addData.createAt ?? ''),
        whId: addData.whId,
        totalAmount: Tongtien,
        totalDiscount: 0,
        totalVatAmount: Tongtienvat,
        finalAmount: Tongthanhtien,
        note: addData.note,
        clinicId: user.clinicId,
        parentClinicId: user.parentClinicId,
        status: status
      }

      AddWhCustReturn({
        variables: {
          input: dataWhCustReturn
        }
      }).then((res: any) => {
        const dataWhCustReturnDt = selectedProducts.map((data: any) => {
          return {
            unitId: data.unitId,
            whCustReturnId: res.data.addWhCustReturn.id,
            importPrice: data.price,
            quantity: data.quantity,
            batchId: data.batchId,
            finalAmount: Tongthanhtien,
            productId: data.id,
            vat: data.vat,
            totalAmount: data.price * data.quantity,
            clinicId: user.clinicId,
            parentClinicId: user.parentClinicId,
            totalVatAmount: (data.price * data.quantity * data.vat) / 100
          }
        })

        AddManyCustReturnDt({
          variables: {
            input: JSON.stringify(dataWhCustReturnDt)
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi tạo số phiếu kho mới')
          },
          onCompleted: () => {
            toast.success('Tạo số phiếu mới thành công')
            router.push('/drugstore/customer-return/')
          }
        })
      })

      if (status === '302') {
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
                  id: canSales[0]?.id,
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
  }

  const handleRemoveProduct = (productId: string, index: number) => {
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

  const handleQuantityBatch = (batchId: string, product: any) => {
    let result: any = 'Không có'
    product.cansales.forEach((data: ICanSale) => {
      if (data.batchId === batchId) result = data.totalRemaining
    })
    return result
  }

  const handleSearch = (searchValue: any) => {
    // console.log('Searching for:', searchValue)
  }

  const handleCreate = (value: any) => {
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
            <h2 style={{ textAlign: 'left', textTransform: 'uppercase' }}>Phiếu trả hàng</h2>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', gap: '8px', float: 'right' }}>
              <Button
                variant='contained'
                color='info'
                sx={{ pl: 5, backgroundColor: '#03b1d7', width: 125, height: 42, fontSize: '13px' }}
                onClick={() => router.back()}
                startIcon={<ArrowBackIcon />}
              >
                <Link href='#' style={{ color: 'white', textDecoration: 'none' }}>
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
                    handleAddWhCustReturn('302')
                  }}
                  startIcon={<SaveIcon />}
                >
                  HOÀN THÀNH
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  color='error'
                  sx={{
                    backgroundColor: '#ff3e1d',
                    color: 'white',
                    borderTopRightRadius: 0,
                    width: 125,
                    height: 42,
                    fontSize: '13px'
                  }}
                  startIcon={<DownloadIcon />}
                >
                  IMPORT
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
          <CustomTextField type='text' variant='filled' fullWidth disabled />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Người Thực Hiện
            </Typography>
          </CustomBox>
          <CustomTextField
            type='text'
            variant='filled'
            fullWidth
            value={user.firstName + ' ' + user.lastName}
            onChange={e => {
              handleAdd('whPersionId', user.id)
            }}
          />
        </CustomGrid>
        <CustomGrid item xs={3.0} display='flex' alignItems='center'>
          <CustomBox>
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
              Ngày Trả Hàng
            </Typography>
          </CustomBox>
          <CustomTextField
            type='datetime-local'
            variant='filled'
            fullWidth
            value={addData.createAt}
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
            value={formatVND(Tongtien)}
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
                  <InputProductSearch placeholder='Tìm kiếm sản phẩm' onSearch={handleSearch} onCreate={handleCreate} />
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
              {selectedProducts.map((product: Product, index) => (
                <React.Fragment key={index}>
                  <TableRow key={product.id}>
                    <StyledTableCell style={{ width: '10%' }}>{`${index + 1}`}</StyledTableCell>
                    <StyledTableCell style={{ width: '10%' }}>{product.id}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>{product.productName}</StyledTableCell>
                    <StyledTableCell style={{ width: '20%' }}>
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
                            setBatchId(value.id)
                          }
                        }}
                        onSearch={e => {
                          console.log(e)
                        }}
                        product={product}
                        batchId={batchId}
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
                        style={{ width: '70px' }}
                        onChange={e => {
                          const newServices = [...selectedProducts]
                          const serviceIndex = newServices.findIndex(s => s.id === product.id)
                          newServices[serviceIndex] = {
                            ...newServices[serviceIndex],
                            quantity: Number(e.target.value),
                            thanhtien: Number(e.target.value) * product.price
                          }
                          setSelectedProducts(newServices)
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: '20%' }}>
                      <Typography>{formatVND(product.price)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>0</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>{product.vat ? product.vat : 0}</StyledTableCell>
                    <StyledTableCell style={{ width: '15%' }}>
                      {/* {formatVND(product.quantity * product.price)} */}
                      {formatVND(product.thanhtien)}
                    </StyledTableCell>
                    <TableCell style={{ width: '10%' }}>
                      <IconButton aria-label='delete' onClick={() => handleRemoveProduct(product.id, index)}>
                        <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
export default AddWhCustReturn
