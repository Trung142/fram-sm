import {
  Autocomplete,
  Button,
  Checkbox,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Paper,
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

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, Stack } from '@mui/system'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PRECRIPTION, GET_PRECRIPTION_DT, GET_PRODUCTS } from './graphql/query'
import { formatVND } from 'src/utils/formatMoney'
import { CanSale, IMedicine, IProduct, SeleteProduct } from './graphql/variables'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import DeleteIcon from '@mui/icons-material/Delete'
import PaidIcon from '@mui/icons-material/Paid'
import {
  ADD_PRECRIPTION,
  ADD_PRECRIPTION_DT,
  UPDATE_PRECRIPTION_DT,
  UPDATE_RES_EXAM,
  ADD_ORDER
} from './graphql/mutation'
import toast from 'react-hot-toast'
import { getLocalstorage } from 'src/utils/localStorageSide'
import Prescription from '../prescription'
import InputProductSearch from '../../inputSearch/InputProductSearch'
import PrintsComponent from 'src/components/prints'

const Medicine = (props: any) => {
  const input = resExamInput.value
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [recipe, setRecipe] = useState('')
  const [openPrintDV, setOpenPrintDV] = useState(false)
  const [openPrint, setOpenPrint] = useState(false)
  const [error, setError] = useState(false)
  const [idDV, setIdDv] = useState<string>()
  const [idBHYT, setIdBHYT] = useState<string>()
  const [dataSelectProduct, setDataSelectProduct] = useState<SeleteProduct>()
  const [dataProduct, setDataProduct] = useState<SeleteProduct[]>([])
  const [dataProductWithBHYT, setDataProductWithBHYT] = useState<SeleteProduct[]>([])
  const [dataProductWithoutBHYT, setDataProductWithoutBHYT] = useState<SeleteProduct[]>([])
  // const [dataPrecription, setDataPrecription] = useState<IMedicine>()
  const [prescriptionDT, setDataPrescriptionDT] = useState<SeleteProduct[]>([])
  const { data: getProductData } = useQuery(GET_PRODUCTS, {})
  const [updateResExam] = useMutation(UPDATE_RES_EXAM)
  const [AddPrescription] = useMutation(ADD_PRECRIPTION)
  const [AddManyPrescriptionDt] = useMutation(ADD_PRECRIPTION_DT)
  const [UpdatePrescriptionDt] = useMutation(UPDATE_PRECRIPTION_DT)
  const [AddOrder] = useMutation(ADD_ORDER)
  const dataUs = getLocalstorage('userData')
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {
      deleteYn: { eq: false },
      resExamId: { eq: input.id }
    }
  })
  const { data: getPrecription, loading, refetch } = useQuery(GET_PRECRIPTION, { variables: queryVariables })

  const dataPrecription = useMemo(() => {
    const data = getPrecription?.getPrescription?.items
    const dataDV = data?.find((x: any) => x.bhytYn === false && x.deleteYn === false)
    const dataBHYT = data?.find((x: any) => x.bhytYn === true && x.deleteYn === false)
    setIdDv(dataDV?.id)
    setIdBHYT(dataBHYT?.id)
    return getPrecription?.getPrescription?.items
  }, [getPrecription])

  const dataWithBHYT = dataPrecription
    ?.find((x: any) => x.bhytYn === true && x.deleteYn === false)
    ?.prescriptionDts.filter((x: any) => x.bhytYn === true)
  const dataWithoutBHYT = dataPrecription
    ?.find((x: any) => x.bhytYn === false && x.deleteYn === false)
    ?.prescriptionDts.filter((x: any) => x.bhytYn === false)
  console.log('dataWithBHYT', dataWithBHYT)
  console.log('dataWithoutBHYT', dataWithoutBHYT)
  useEffect(() => {
    setDataSelectProduct({
      ...dataSelectProduct,
      quantity: calculateQuantity(dataSelectProduct?.dateNumber || 0),
      totalPrice: (dataSelectProduct?.quantity || 0) * (dataSelectProduct?.price || 0)
    })
    setDataProduct([...dataProductWithBHYT, ...dataProductWithoutBHYT])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProductWithBHYT, dataProductWithoutBHYT, dataSelectProduct?.dateNumber, recipe])

  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi thêm đơn thuốc mới')
  }, [])

  const handleSubmit = async () => {
    const dataPrescriptionInit = {
      resExamId: input.id,
      status: '111',
      statusSignOnline: false,
      clinicId: dataUs.clinicId,
      parentClinicId: dataUs.parentClinicId,
      statusDtqg: false
    }
    setDataProduct([])
    setDataProductWithBHYT([])
    setDataProductWithoutBHYT([])
    if (dataPrecription.length <= 0) {
      AddPrescription({
        variables: {
          input: {
            ...dataPrescriptionInit,
            bhytYn: true
          }
        },
        onError,
        onCompleted: async () => {
          await refetch()
        }
      }).then((res: any) => {
        const prescriptionDtWithBHYT = dataProductWithBHYT.map(e => {
          return {
            dosage: e.dosage,
            productId: e.id,
            quantity: e.quantity,
            note: e.note,
            prescriptionId: res.data?.addPrescription.id,
            clinicId: dataUs.clinicId,
            parentClinicId: dataUs.parentClinicId,
            bhytYn: e.bhytYn,
            freeYn: e.freeYn,
            totalPrice: e.totalPrice
          }
        })
        AddManyPrescriptionDt({
          variables: {
            input: JSON.stringify(prescriptionDtWithBHYT)
          },
          onCompleted: async () => {
            await refetch()
            if (prescriptionDtWithBHYT.length > 0) {
              toast.success('Thêm toa thuốc BHYT thành công')
            }
          }
        })
        AddPrescription({
          variables: {
            input: {
              ...dataPrescriptionInit,
              bhytYn: false
            }
          },
          onError,
          onCompleted: async () => {
            await refetch()
          }
        }).then((res: any) => {
          const prescriptionDtWithoutBHYT = dataProductWithoutBHYT.map(e => {
            return {
              dosage: e.dosage,
              productId: e.id,
              quantity: e.quantity,
              note: e.note,
              prescriptionId: res.data?.addPrescription.id,
              clinicId: dataUs.clinicId,
              parentClinicId: dataUs.parentClinicId,
              bhytYn: e.bhytYn,
              freeYn: e.freeYn,
              totalPrice: e.totalPrice
            }
          })
          AddManyPrescriptionDt({
            variables: {
              input: JSON.stringify(prescriptionDtWithoutBHYT)
            },
            onCompleted: async () => {
              await refetch()
              if (prescriptionDtWithoutBHYT.length > 0) {
                toast.success('Thêm toa thuốc dịch vụ thành công')
              }
            }
          })
        })
      })
      setDataSelectProduct({})
    } else {
      if (
        !dataPrecription.find((x: any) => x.bhytYn === true) &&
        dataPrecription.find((x: any) => x.bhytYn === false)
      ) {
        //TH thiếu đơn thuốc BHYT
        AddPrescription({
          variables: {
            input: {
              ...dataPrescriptionInit,
              bhytYn: true
            }
          }
        }).then(() => {
          const prescriptionDtWithBHYT = dataProductWithBHYT.map(e => {
            return {
              dosage: e.dosage,
              productId: e.id,
              quantity: e.quantity,
              note: e.note,
              prescriptionId: dataPrecription?.find((x: any) => x.bhytYn === true && x.deleteYn === false)?.id,
              clinicId: dataUs.clinicId,
              parentClinicId: dataUs.parentClinicId,
              bhytYn: e.bhytYn,
              freeYn: e.freeYn,
              totalPrice: e.totalPrice
            }
          })
          AddManyPrescriptionDt({
            variables: {
              input: JSON.stringify(prescriptionDtWithBHYT)
            },
            onCompleted: async () => {
              await refetch()
              if (prescriptionDtWithBHYT.length > 0) {
                toast.success('Thêm thuốc BHYT thành công')
              }
            }
          })
        })
      }
      if (
        !dataPrecription.find((x: any) => x.bhytYn === false) &&
        dataPrecription.find((x: any) => x.bhytYn === true)
      ) {
        //TH thiếu đơn thuốc dịch vụ
        AddPrescription({
          variables: {
            input: {
              ...dataPrescriptionInit,
              bhytYn: false
            }
          }
        }).then(() => {
          const prescriptionDtWithoutBHYT = dataProductWithoutBHYT.map(e => {
            return {
              dosage: e.dosage,
              productId: e.id,
              quantity: e.quantity,
              note: e.note,
              prescriptionId: dataPrecription?.find((x: any) => x.bhytYn === false && x.deleteYn === false)?.id,
              clinicId: dataUs.clinicId,
              parentClinicId: dataUs.parentClinicId,
              bhytYn: e.bhytYn,
              freeYn: e.freeYn,
              totalPrice: e.totalPrice
            }
          })
          AddManyPrescriptionDt({
            variables: {
              input: JSON.stringify(prescriptionDtWithoutBHYT)
            },
            onCompleted: async () => {
              await refetch()
              if (prescriptionDtWithoutBHYT.length > 0) {
                toast.success('Thêm toa thuốc dịch vụ thành công')
              }
            }
          })
        })
      }
      if (dataPrecription.find((x: any) => x.bhytYn === false) && dataPrecription.find((x: any) => x.bhytYn === true)) {
        const prescriptionDtWithBHYT = dataProductWithBHYT.map(e => {
          return {
            dosage: e.dosage,
            productId: e.id,
            quantity: e.quantity,
            note: e.note,
            prescriptionId: dataPrecription?.find((x: any) => x.bhytYn === true && x.deleteYn === false)?.id,
            clinicId: dataUs.clinicId,
            parentClinicId: dataUs.parentClinicId,
            bhytYn: e.bhytYn,
            freeYn: e.freeYn,
            totalPrice: e.totalPrice
          }
        })
        AddManyPrescriptionDt({
          variables: {
            input: JSON.stringify(prescriptionDtWithBHYT)
          },
          onCompleted: async () => {
            await refetch()
            if (prescriptionDtWithBHYT.length > 0) {
              toast.success('Thêm thuốc BHYT thành công')
            }
          }
        }).then(() => {
          const prescriptionDtWithoutBHYT = dataProductWithoutBHYT.map(e => {
            return {
              dosage: e.dosage,
              productId: e.id,
              quantity: e.quantity,
              note: e.note,
              prescriptionId: dataPrecription?.find((x: any) => x.bhytYn === false && x.deleteYn === false)?.id,
              clinicId: dataUs.clinicId,
              parentClinicId: dataUs.parentClinicId,
              bhytYn: e.bhytYn,
              freeYn: e.freeYn,
              totalPrice: e.totalPrice
            }
          })
          AddManyPrescriptionDt({
            variables: {
              input: JSON.stringify(prescriptionDtWithoutBHYT)
            },
            onCompleted: async () => {
              await refetch()
              if (prescriptionDtWithoutBHYT.length > 0) {
                toast.success('Thêm thuốc dịch vụ thành công')
              }
            }
          })
        })
      }
    }
    setDataSelectProduct({})
    await updateResExam({
      variables: {
        input: JSON.stringify({
          id: input.id,
          status: '104'
        })
      }
    })
  }

  const productData: any[] = useMemo(() => {
    return getProductData?.getProduct?.items ?? []
  }, [getProductData])

  const handleSelectService = (option: IProduct | null) => {
    const data = {
      ...dataSelectProduct,
      ...option,
      id: option?.id,
      ingredients: option?.ingredients,
      productName: option?.productName,
      describe: option?.describe,
      manufacturer: option?.manufacturer,
      price: option?.price,
      prescribingUnit: option?.prescribingUnit?.name,
      instructions: option?.instructions?.name
    }
    setDataSelectProduct(data)
  }

  const recipeService = (e: any) => {
    let result = ''
    const parts = e.match(/[a-z][0-9]+/g)
    let data = { ...dataSelectProduct }
    let total = 0
    if (parts) {
      parts.forEach((part: any) => {
        const number = parseInt(part.slice(1))
        if (part[0] !== 'n') {
          total += number
        }
      })

      parts.forEach((part: any) => {
        const number = parseInt(part.slice(1))

        switch (part[0]) {
          case 's':
            result += 'Sáng ' + number + ' lần, '
            break
          case 't':
            result += 'Trưa ' + number + ' lần, '
            break
          case 'c':
            result += 'Chiều ' + number + ' lần, '
            break
          case 'e':
            result += 'Tối ' + number + ' lần, '
            break
          case 'n':
            result += number + ' ngày, '
            data = {
              ...data,
              quantity: number * total,
              dateNumber: number
            }
            break
          default:
            result += 'Ký tự không hợp lệ '
        }
      })
    }
    data = { ...data, dosage: result.trim() }

    return data
  }
  const onSearch = () => console.log(1)
  const handleRemoveMedicineDT = (id: string, bhytYn: boolean) => {
    const prescriptionId = ''
    UpdatePrescriptionDt({
      variables: {
        input: JSON.stringify({
          id: id,
          deleteYn: true,
          prescriptionId: prescriptionId
        })
      },
      onCompleted: async () => {
        loading
        await refetch()
        toast.success('Xoá đơn thuốc thành công')
      }
    })
  }

  const handleChangeTypeOfBHYT = useCallback(
    (id: string, bhytYn: boolean) => {
      if (bhytYn === true) {
        UpdatePrescriptionDt({
          variables: {
            input: JSON.stringify({
              id: id,
              bhytYn: bhytYn,
              prescriptionId: dataPrecription?.find((x: any) => x.bhytYn === true && x.deleteYn === false)?.id
            })
          }
        })
      } else {
        UpdatePrescriptionDt({
          variables: {
            input: JSON.stringify({
              id: id,
              bhytYn: bhytYn,
              prescriptionId: dataPrecription?.find((x: any) => x.bhytYn === false && x.deleteYn === false)?.id
            })
          }
        })
      }
      refetch()
    },
    [UpdatePrescriptionDt, dataPrecription, refetch]
  )

  /*const handleRemoveService = (id: any,dosage:any, type:string) => {
    if(type==="dataWithBHYT"){
      const dataSelect = [...dataProductWithBHYT]
      const find = dataSelect.filter(e => e.id !== id )
      setDataProductWithBHYT(find)
    }else{
      const dataSelect = [...dataProductWithoutBHYT]
      const find = dataSelect.filter(e => e.id !== id)
      setDataProductWithoutBHYT(find)
    }
    setDataProduct([...dataProductWithBHYT,...dataProductWithoutBHYT])
  }*/

  const calculateQuantity = useCallback(
    (dosage: number) => {
      const parts = recipe.match(/[a-z][0-9]+/g)
      let total = 0
      if (parts) {
        parts.forEach((part: any) => {
          const number = parseInt(part.slice(1))
          if (part[0] !== 'n') {
            total += number
          }
        })
      }
      return total * (dosage || 0)
    },
    [recipe]
  )

  const updateDosageWithDateNumber = (dateNumber: number) => {
    let result = dataSelectProduct?.dosage || ''
    if (dateNumber > 0) {
      // Xóa phần 'ngày' hiện tại nếu có
      //result = result.replace(/,\s*\d+\s*ngày/, '')
      result = ''
      // Thêm phần 'ngày' mới
      result += dateNumber + ' ngày,' + ' '
    }
    return result.trim()
  }

  const QuantityRemaining = (arr: CanSale[]) => {
    for (let i = 0; i <= arr?.length; i++) {
      let totalcountRemaining = 0
      return (totalcountRemaining += arr[i]?.totalRemaining)
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Grid container gap={1}>
            <Grid item xs={12}>
              <InputProductSearch placeholder='Nhập tên thuốc' onSearch={onSearch} onCreate={handleSelectService} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1.5}>
          <TextField
            fullWidth
            label='Số ngày'
            placeholder='Số ngày dùng'
            type='number'
            error={error}
            helperText={error ? 'Ngày Dùng Sai Định Dạng' : ''}
            value={dataSelectProduct?.dateNumber}
            onChange={(e: any) => {
              const dateNumber = e.target.value
              if (dateNumber <= 0) {
                setError(true)
                return
              } else setError(false)
              setDataSelectProduct({
                ...dataSelectProduct,
                dateNumber: dateNumber,
                dosage: updateDosageWithDateNumber(dateNumber)
              })
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            label='Công thức'
            placeholder='Nhập công thức'
            value={recipe}
            onChange={(e: any) => {
              const data = recipeService(e.target.value)
              setDataSelectProduct(data)
              setRecipe(e.target.value)
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            label='Liều dùng'
            placeholder='Nhập liều dùng'
            value={dataSelectProduct?.dosage}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            label='Ghi chú'
            placeholder='Ví dụ: Sau ăn, Trước ăn, ...'
            defaultValue={dataSelectProduct?.note}
            onChange={(e: any) => {
              const note = { ...dataSelectProduct, note: e.target.value }
              setDataSelectProduct(note)
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <TextField
            fullWidth
            label='Số lượng'
            placeholder='Nhập số lượng'
            type='number'
            inputProps={{ min: 0 }}
            value={dataSelectProduct?.quantity}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label='Hoạt chất'
            placeholder='Thông tin hoạt chất'
            value={dataSelectProduct?.ingredients}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            fullWidth
            label='Mô tả thuốc'
            placeholder='Nhập mô tả thuốc'
            value={dataSelectProduct?.describe}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            label='Hãng sản xuất'
            placeholder='Nhập hãng sản xuất'
            value={dataSelectProduct?.manufacturer}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            fullWidth
            label='Đơn giá'
            placeholder='Đơn giá'
            value={formatVND(dataSelectProduct?.price || 0)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            fullWidth
            label='ĐVT kê'
            placeholder='Đơn vị kê'
            value={dataSelectProduct?.prescribingUnit}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <TextField
            fullWidth
            label='Đường dùng'
            placeholder='Đường dùng'
            value={dataSelectProduct?.instructions}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {input?.status !== '106' ? (
          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button
              variant='contained'
              disabled={!dataSelectProduct?.productName ? true : false}
              color='primary'
              onClick={() => {
                if (dataSelectProduct?.dosage === null || dataSelectProduct?.dosage === '') {
                  toast.error('Nhập liều dùng')
                  return
                }
                if (dataSelectProduct?.quantity === null || dataSelectProduct?.quantity === 0) {
                  toast.error('Nhập số lượng')
                  return
                }
                if (dataSelectProduct) {
                  setDataProduct(e => [...e, dataSelectProduct])
                  if (dataSelectProduct.bhytYn === true) {
                    setDataProductWithBHYT(e => [...e, dataSelectProduct])
                  } else {
                    setDataProductWithoutBHYT(e => [...e, dataSelectProduct])
                  }
                  setDataSelectProduct({
                    id: '',
                    ingredients: '',
                    productName: '',
                    describe: '',
                    manufacturer: '',
                    price: 0,
                    prescribingUnit: '',
                    instructions: '',
                    dosage: '',
                    dateNumber: 0
                  })
                  setRecipe('')
                }
              }}
            >
              Thêm thuốc
            </Button>
          </Grid>
        ) : (
          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button variant='contained' color='secondary'>
              Thêm thuốc
            </Button>
          </Grid>
        )}

        <>
          {dataProduct && dataProduct.length > 0 && (
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
                  aria-label='simple table'
                >
                  <TableRow style={{ height: '50px' }}>
                    <Typography style={{ width: '300px', position: 'absolute', padding: '15px' }}>
                      Tổng thuốc Dịch Vụ: {dataProductWithoutBHYT?.length || 0}
                    </Typography>
                  </TableRow>
                  <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên</TableCell>
                      <TableCell>Liều dùng</TableCell>
                      <TableCell>ĐVK</TableCell>
                      <TableCell>SL</TableCell>
                      <TableCell>Tồn</TableCell>
                      <TableCell style={{ letterSpacing: 0 }}>Đơn giá</TableCell>
                      <TableCell style={{ letterSpacing: 0 }}>Thành tiền</TableCell>
                      <TableCell>BH</TableCell>
                      <TableCell>M.phí</TableCell>
                      <TableCell>T.t</TableCell>
                      <TableCell>Xoá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataProductWithoutBHYT.map((product: SeleteProduct, index: number) => (
                      <TableRow key={product.id}>
                        <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                        <TableCell style={{ width: '20%' }}>
                          <Typography style={{ minWidth: '200px', width: '100%' }}>
                            {product?.productName || ''}{' '}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: '30%' }}>
                          <TextField
                            style={{ minWidth: '300px', width: '100%' }}
                            defaultValue={product?.dosage || ''}
                          />
                        </TableCell>

                        <TableCell style={{ width: '15%' }}>
                          <TextField style={{ minWidth: '70px' }} value={product?.prescribingUnit || ''} />
                        </TableCell>
                        <TableCell style={{ width: '10%', fontSize: '1rem' }}>
                          <TextField sx={{ width: '50px' }} value={product.quantity} />
                        </TableCell>
                        <TableCell style={{ width: '20%' }}>{product.whExistenceDts?.totalRemaining || 0}</TableCell>
                        <TableCell style={{ width: '20%' }}>{formatVND(product.price || 0)}</TableCell>
                        <TableCell style={{ width: '20%' }}>
                          {product.freeYn === true ? 0 : formatVND(product?.totalPrice || 0)}
                        </TableCell>
                        <TableCell sx={{ width: '5%' }}>
                          <Checkbox
                            {...label}
                            checked={product.bhytYn}
                            onChange={e => {
                              const index = dataProductWithoutBHYT.findIndex((x: any) => x.id === product.id)
                              const clonedata = [
                                ...dataProductWithBHYT,
                                {
                                  ...dataProductWithoutBHYT[index],
                                  bhytYn: e.target.checked
                                }
                              ]
                              setDataProductWithBHYT(clonedata)
                              dataProductWithoutBHYT.splice(index, 1)
                            }}
                          />
                        </TableCell>

                        <TableCell style={{ width: '10%' }}>
                          <Checkbox
                            {...label}
                            checked={product.freeYn}
                            onChange={e => {
                              const index = dataProductWithoutBHYT.findIndex((x: any) => x.id === product.id)
                              const clonedata = [...dataProductWithoutBHYT]
                              clonedata[index] = {
                                ...clonedata[index],
                                freeYn: e.target.checked
                              }
                              setDataProductWithoutBHYT(clonedata)
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ width: '10%' }}>
                          <Stack direction='row' spacing={1}>
                            <IconButton aria-label='delete'>
                              <PaidIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell style={{ width: '10%' }}>
                          <Tooltip title='Xoá'>
                            <MenuItem
                              onClick={() => {
                                const target = dataProductWithoutBHYT.findIndex(
                                  (x: any) => x.id === product.id && x.dosage === product.dosage
                                )
                                const clone = [...dataProductWithoutBHYT]
                                clone.splice(target, 1)
                                setDataProductWithoutBHYT(clone)
                              }}
                            >
                              <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                            </MenuItem>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableRow style={{ height: '50px' }}>
                    <Typography style={{ width: '300px', position: 'absolute', padding: '15px' }}>
                      Tổng thuốc BHYT: {dataProductWithBHYT?.length || 0}
                    </Typography>
                  </TableRow>
                  <TableBody>
                    {dataProductWithBHYT.map((product: SeleteProduct, index: number) => (
                      <TableRow key={product.id}>
                        <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                        <TableCell style={{ width: '20%' }}>
                          <Typography style={{ minWidth: '200px', width: '100%' }}>
                            {product?.productName || ''}{' '}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: '30%' }}>
                          <TextField
                            style={{ minWidth: '300px', width: '100%' }}
                            defaultValue={product?.dosage || ''}
                          />
                        </TableCell>

                        <TableCell style={{ width: '15%' }}>
                          <TextField style={{ minWidth: '70px' }} value={product?.prescribingUnit || ''} />
                        </TableCell>
                        <TableCell style={{ width: '10%', fontSize: '1rem' }}>
                          <TextField sx={{ width: '50px' }} value={product.quantity} />
                        </TableCell>
                        <TableCell style={{ width: '20%' }}>{product.whExistenceDts?.totalRemaining || 0}</TableCell>
                        <TableCell style={{ width: '20%' }}>{formatVND(product.bhytPrict || 0)}</TableCell>
                        <TableCell style={{ width: '20%' }}>
                          {product.freeYn === true ? 0 : formatVND(product?.totalPrice || 0)}
                        </TableCell>
                        <TableCell sx={{ width: '5%' }}>
                          <Checkbox
                            {...label}
                            checked={product.bhytYn}
                            onChange={e => {
                              const index = dataProductWithBHYT.findIndex((x: any) => x.id === product.id)
                              const clonedata = [
                                ...dataProductWithoutBHYT,
                                {
                                  ...dataProductWithBHYT[index],
                                  bhytYn: e.target.checked
                                }
                              ]
                              setDataProductWithoutBHYT(clonedata)
                              dataProductWithBHYT.splice(index, 1)
                            }}
                          />
                        </TableCell>

                        <TableCell style={{ width: '10%' }}>
                          <Checkbox
                            {...label}
                            checked={product.freeYn}
                            onChange={e => {
                              const index = dataProductWithBHYT.findIndex((x: any) => x.id === product.id)
                              const clonedata = [...dataProductWithBHYT]
                              clonedata[index] = {
                                ...clonedata[index],
                                freeYn: e.target.checked
                              }
                              setDataProductWithBHYT(clonedata)
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ width: '10%' }}>
                          <Stack direction='row' spacing={1}>
                            <IconButton aria-label='delete'>
                              <PaidIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell style={{ width: '10%' }}>
                          <Tooltip title='Xoá'>
                            <MenuItem
                              onClick={() => {
                                const target = dataProductWithBHYT.findIndex(
                                  (x: any) => x.id === product.id && x.dosage === product.dosage
                                )
                                const clone = [...dataProductWithBHYT]
                                clone.splice(target, 1)
                                setDataProductWithoutBHYT(clone)
                              }}
                            >
                              <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                            </MenuItem>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </>
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
              aria-label='simple table'
            >
              <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Liều dùng</TableCell>
                  <TableCell>ĐVK</TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Tồn</TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell>BH</TableCell>
                  <TableCell>M.phí</TableCell>
                  <TableCell>T.t</TableCell>
                  <TableCell>Xoá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow style={{ height: '50px' }}>
                  <Typography style={{ width: '300px', position: 'absolute', padding: '15px' }}>
                    Tổng thuốc dịch vụ: {dataWithoutBHYT?.length || 0}
                  </Typography>
                </TableRow>
                {dataWithoutBHYT?.map((Precription: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                    <TableCell style={{ width: '20%' }}>
                      <Typography style={{ minWidth: '200px', width: '100%' }}>
                        {Precription?.product?.productName || ''}{' '}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: '30%' }}>
                      <TextField style={{ minWidth: '300px', width: '100%' }} value={Precription?.dosage || ''} />
                    </TableCell>

                    <TableCell style={{ width: '15%' }}>
                      <TextField
                        style={{ minWidth: '70px' }}
                        value={Precription?.product?.prescribingUnit?.name || ''}
                      />
                    </TableCell>
                    <TableCell style={{ width: '10%', fontSize: '1rem' }}>
                      <TextField sx={{ width: '50px' }} value={Precription?.quantity} />
                    </TableCell>
                    <TableCell style={{ width: '20%' }}>{Precription.whExistenceDts?.totalRemaining || 0}</TableCell>
                    <TableCell style={{ width: '20%' }}>{formatVND(Precription?.product?.price || 0)}</TableCell>
                    <TableCell style={{ width: '20%' }}>
                      {Precription?.freeYn === true ? 0 : formatVND(Precription?.totalPrice)}
                    </TableCell>
                    <TableCell sx={{ width: '5%' }}>
                      <Checkbox
                        {...label}
                        checked={Precription?.bhytYn}
                        onClick={e => handleChangeTypeOfBHYT(Precription?.id, !Precription?.bhytYn)}
                      />
                    </TableCell>

                    <TableCell style={{ width: '10%' }}>
                      <Checkbox {...label} checked={Precription?.freeYn} disabled />
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Stack direction='row' spacing={1}>
                        <IconButton aria-label='delete'>
                          <PaidIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Tooltip title='Xoá'>
                        <MenuItem onClick={() => handleRemoveMedicineDT(Precription?.id || '', false)}>
                          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                        </MenuItem>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow style={{ height: '50px' }}>
                  <Typography style={{ width: '300px', position: 'absolute', padding: '15px' }}>
                    Tổng thuốc BHYT: {dataWithBHYT?.length || 0}
                  </Typography>
                </TableRow>
                {dataWithBHYT?.map((Precription: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                    <TableCell style={{ width: '20%' }}>
                      <Typography style={{ minWidth: '200px', width: '100%' }}>
                        {Precription?.product?.productName || ''}{' '}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: '30%' }}>
                      <TextField style={{ minWidth: '300px', width: '100%' }} value={Precription?.dosage || ''} />
                    </TableCell>

                    <TableCell style={{ width: '15%' }}>
                      <TextField
                        style={{ minWidth: '70px' }}
                        value={Precription?.product?.prescribingUnit?.name || ''}
                      />
                    </TableCell>
                    <TableCell style={{ width: '10%', fontSize: '1rem' }}>
                      <TextField sx={{ width: '50px' }} value={Precription?.quantity} />
                    </TableCell>
                    <TableCell style={{ width: '20%' }}>{Precription.whExistenceDts?.totalRemaining || 0}</TableCell>
                    <TableCell style={{ width: '20%' }}>{formatVND(Precription?.product?.bhytPrict || 0)}</TableCell>
                    <TableCell style={{ width: '20%' }}>
                      {Precription?.freeYn === true ? 0 : formatVND(Precription?.totalPrice)}
                    </TableCell>
                    <TableCell sx={{ width: '5%' }}>
                      <Checkbox
                        {...label}
                        checked={Precription?.bhytYn}
                        onChange={e => handleChangeTypeOfBHYT(Precription?.id, e.target.checked)}
                      />
                    </TableCell>

                    <TableCell style={{ width: '10%' }}>
                      <Checkbox {...label} disabled checked={Precription?.freeYn} />
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Stack direction='row' spacing={1}>
                        <IconButton aria-label='delete'>
                          <PaidIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ width: '10%' }}>
                      <Tooltip title='Xoá'>
                        <MenuItem onClick={() => handleRemoveMedicineDT(Precription.id || '', true)}>
                          <DeleteIcon sx={{ color: 'red', mr: 1.5 }} />
                        </MenuItem>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid xs={12} display='flex' justifyContent='center' gap='10px' marginTop='10px'>
          <Button
            variant='contained'
            color='warning'
            disabled={input?.status !== '106' && dataProduct.length > 0 ? false : true}
            onClick={() => {
              handleSubmit()
            }}
          >
            Kê đơn
          </Button>

          <Button
            variant='contained'
            color='primary'
            disabled={dataWithoutBHYT?.length == 0 ? true : false}
            onClick={() => {
              setOpenPrintDV(true)
            }}
          >
            In đơn thuốc dịch vụ
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={dataWithBHYT?.length == 0 ? true : false}
            onClick={() => {
              setOpenPrint(true)
            }}
          >
            In đơn thuốc BHYT
          </Button>
        </Grid>
      </Grid>

      <PrintsComponent
        printFunctionId='pr10000003'
        printType='p_prescription_id'
        printTypeId={idDV || ''}
        clinicId={getLocalstorage('userData').clinicId}
        parentClinicId={getLocalstorage('userData').parentClinicId}
        openPrint={openPrintDV}
        setOpenButtonDialog={setOpenPrintDV}
        titlePrint='In Đơn thuốc'
      />
      <PrintsComponent
        printFunctionId='pr10000003'
        printType='p_prescription_id'
        printTypeId={idBHYT || ''}
        clinicId={getLocalstorage('userData').clinicId}
        parentClinicId={getLocalstorage('userData').parentClinicId}
        openPrint={openPrint}
        setOpenButtonDialog={setOpenPrint}
        titlePrint='In Đơn thuốc'
      />
    </>
  )
}

export default Medicine
