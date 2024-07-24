import React, { useEffect, useState, useCallback, useMemo, use } from 'react'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import {
  Stack,
  Typography,
  Button,
  Grid,
  Box,
  Tab,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Autocomplete
} from '@mui/material'
import { Icon } from '@iconify/react'
import { Checkbox } from '@mui/material'
import MUIDialog from 'src/@core/components/dialog'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useMutation, useQuery } from '@apollo/client'
import { GET_RES_EXAM, GET_SERVICE_GROUP, GET_USER, GET_PAYMENT_TYPE } from './graphql/query'
import { UPDATE_PAYMENT, UPDATE_RES_EXAM_SERVICE_DT } from './graphql/mutation'
import { ADD_PAYMENT } from './graphql/mutation'
import { GET_PAYMENT } from './graphql/query'
import { Payment } from './graphql/types'
import { Controller, useForm, useWatch } from 'react-hook-form'
import moment from 'moment'
import { getLocalstorage } from 'src/utils/localStorageSide'
import toast from 'react-hot-toast'
import { getPaymentStatus } from './helper'
import { getValue } from '@mui/system'

const userLogin = getLocalstorage('userData')

const initPayment: Payment = {
  actuallyReceivedAmount: 0,
  bhytAmount: 0,
  couponAmount: 0,
  createAt: new Date(),
  createBy: '',
  debtAmount: 0,
  discountAmount: 0,
  finalPrice: 0,
  note: '',
  clinicId: userLogin?.clinicId,
  parentClinicId: userLogin?.parentClinicId,
  patName: '',
  paymentDate: new Date(),
  paymentTypeId: '',
  promotionAmount: 0,
  status: '',
  totalAmount: 0,
  vatAmount: 0,
  seller: userLogin?.id
}

interface PaymentInfoDialogProps {
  open: boolean
  onClose: () => void
  resExamId?: string
}

const colorActive = {
  color: '#0292B1'
}

const currentUser = getLocalstorage('userData')!

const RowPayment = (props: { row: any; index: number; onDeletePayment: (id: string, status: string) => void }) => {
  const { row, index, onDeletePayment } = props
  const [open, setOpen] = useState(false)

  const handleDeletePayment = () => {
    onDeletePayment(row.id, '113')
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          {index + 1}
        </TableCell>
        <TableCell component='th' scope='row' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          {row.id}
        </TableCell>
        <TableCell align='right' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          {row.totalAmount ?? 0}
        </TableCell>
        <TableCell align='right' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          {row.discount ?? 0}
        </TableCell>
        <TableCell align='right' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          {row.finalPrice ?? 0}
        </TableCell>
        <TableCell align='right' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          <span style={{ ...getPaymentStatus(row.status).styles, textAlign: 'center' }}>
            {getPaymentStatus(row.status).label}
          </span>
        </TableCell>
        <TableCell align='right' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <div
              style={{
                border: '1px solid rgb(217, 217, 217)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e3a043'
              }}
            >
              <Icon icon='ic:round-print' />
            </div>
            <div
              style={{
                border: '1px solid rgb(217, 217, 217)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'red'
              }}
              onClick={() => handleDeletePayment()}
            >
              <Icon icon='mdi:delete' />
            </div>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: '0px' }}></TableCell>
        <TableCell style={{ padding: '0px' }} colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <TableContainer component={Paper}>
              <Table
                sx={{
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0'
                }}
                aria-label='simple table'
              >
                <TableHead sx={{ backgroundColor: '#dde1e6', borderBottomColor: '#32475C61' }}>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>#</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Dịch vụ/Hàng hoá</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>ĐVT</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>S.lg</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>ĐƠN GIÁ</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>C.khấu</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.paymentDts?.map((paymentDt: any, index: number) => (
                    <TableRow key={paymentDt.id}>
                      <TableCell component='th' scope='row' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
                        {index}
                      </TableCell>
                      <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>{paymentDt.service?.name}</TableCell>
                      <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>{paymentDt.service?.unit}</TableCell>
                      <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>{paymentDt.quantity}</TableCell>
                      <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>{paymentDt.service?.price}</TableCell>
                      <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>{paymentDt.couponAmount}</TableCell>
                      <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>{paymentDt.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

const PaymentInfoDialog = ({ open, onClose, resExamId }: PaymentInfoDialogProps) => {
  const { handleSubmit, control, setValue, getValues, watch, reset } = useForm({
    defaultValues: initPayment
  })
  const [tab, setTab] = useState('noPaid')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [unPaidServicesList, setUnPaidServicesList] = useState<any>({})
  const [queriesPaymentCondition, setQueriesPaymentCondition] = useState({
    input: {
      resExamId: { eq: resExamId }
    }
  })
  const { data: getResExamData, refetch: refetchResExamData } = useQuery(GET_RES_EXAM, {
    variables: {
      input: {
        id: { eq: resExamId }
      }
    }
  })

  const handleSetTab = (val: any) => {
    setTab(val)
  }

  const [addPayment] = useMutation(ADD_PAYMENT, {})
  const [updateResExamServiceDt] = useMutation(UPDATE_RES_EXAM_SERVICE_DT, {})
  const [updatePayment] = useMutation(UPDATE_PAYMENT, {})

  const { data: getServiceGroupData } = useQuery(GET_SERVICE_GROUP, {})
  const { data: getUserData } = useQuery(GET_USER, {})
  const { data: getPaymentTypeData } = useQuery(GET_PAYMENT_TYPE, {})
  const { data: getPayment, refetch: refetchPaymentData } = useQuery(GET_PAYMENT, {
    variables: queriesPaymentCondition
  })

  const servicesGroupData = useMemo(() => getServiceGroupData?.getServiceGroup?.items ?? [], [getServiceGroupData])
  const resExamsData = useMemo(() => getResExamData?.getResExam?.items[0] ?? {}, [getResExamData])
  const userDatas = useMemo(() => getUserData?.getUser?.items ?? [], [getUserData])
  const paymentTypeDatas = useMemo(() => getPaymentTypeData?.getPaymentType?.items ?? [], [getPaymentTypeData])
  const unPaidServices = useMemo(() => {
    return resExamsData?.resExamServiceDts?.filter((serviceDts: any) => !serviceDts.paymentStatus) ?? []
  }, [resExamsData])
  const paidServices = useMemo(() => {
    return resExamsData?.resExamServiceDts?.filter((serviceDts: any) => serviceDts.paymentStatus) ?? []
  }, [resExamsData])
  const prescriptionsUnPaid = useMemo(() => {
    return resExamsData?.prescriptions?.filter((prescription: any) => !prescription.paymentStatus) ?? []
  }, [resExamsData])
  const groupServicesDtsUnPaid = useMemo(() => {
    const groupServices: any = {}
    unPaidServices.forEach((service: any) => {
      if (!groupServices[service.service.serviceGroupId]) {
        groupServices[service.service.serviceGroupId] = []
      }
      groupServices[service.service.serviceGroupId].push(service)
    })

    prescriptionsUnPaid && prescriptionsUnPaid.length > 0 && (groupServices['prescription'] = prescriptionsUnPaid)

    return groupServices
  }, [unPaidServices, prescriptionsUnPaid])
  const paymentData: any[] = useMemo(() => getPayment?.getPayment?.items ?? [], [getPayment])

  useEffect(() => {
    const totalAmount = Object.keys(groupServicesDtsUnPaid)
      .map((key: string) => {
        if (key === 'prescription') {
          return groupServicesDtsUnPaid[key].reduce(
            (acc: any, prescription: any) => acc + prescription.prescriptionDts[0]?.totalPrice,
            0
          )
        }

        return groupServicesDtsUnPaid[key].reduce((acc: any, resExamService: any) => {
          if (resExamService.freeYn) {
            return acc
          } else {
            return acc + resExamService.totalPrice
          }
        }, 0)
      })
      .reduce((acc: any, total: any) => acc + total, 0)

    const discountAmount = Object.keys(groupServicesDtsUnPaid)
      .map((key: string) => {
        if (key === 'prescription') {
          return groupServicesDtsUnPaid[key].reduce(
            (acc: any, prescription: any) => acc + (prescription.discount || 0),
            0
          )
        }
        return groupServicesDtsUnPaid[key].reduce(
          (acc: any, resExamService: any) => acc + (resExamService.discount || 0),
          0
        )
      })
      .reduce((acc: any, total: any) => acc + total, 0)
    const bhytTotal = unPaidServices
      .filter((resExamService: any) => resExamService?.bhytYn)
      .reduce((acc: any, resExamService: any) => acc + resExamService?.quantity * resExamService.service.price, 0)

    setValue('discountAmount', discountAmount)
    setValue('totalAmount', totalAmount)
    setValue('bhytAmount', bhytTotal)

    setValue('finalPrice', totalAmount - discountAmount - bhytTotal)
  }, [groupServicesDtsUnPaid, paidServices, prescriptionsUnPaid, setValue, watch, unPaidServices])

  useEffect(() => {
    if (resExamsData) {
      setValue('patName', resExamsData.patName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resExamsData])

  useEffect(() => {
    if (paymentTypeDatas.length > 0) {
      setValue('paymentTypeId', paymentTypeDatas[0].id)
    }
  }, [paymentTypeDatas, setValue])

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }, [])

  const handleDeleteService = (serviceId: string, groupId: string) => {
    console.log(`Delete service with ID: ${serviceId} from group: ${groupId}`)
  }

  const handleUpdateResExamServiceDt = async () => {
    const updatePromises = unPaidServices.map((resExamServiceDt: any) =>
      updateResExamServiceDt({
        variables: {
          input: JSON.stringify({
            id: resExamServiceDt.id,
            paymentStatus: true
          })
        }
      })
    )

    await Promise.all(updatePromises)

    refetchPaymentData()
    refetchResExamData()
  }

  const handleAddPayment = async (data: any) => {
    const paymentData = {
      ...data,
      status: '112',
      resExamId: resExamId,
      actuallyReceivedAmount: +data.actuallyReceivedAmount,
      paymentDts: unPaidServices.map((resExamService: any) => ({
        resExamServiceId: resExamService.id,
        bhytAmount: resExamService.bhytYn ? resExamService.totalPrice : 0,
        clinicId: userLogin.clinicId,
        couponAmount: 0,
        createAt: new Date(),
        createBy: currentUser.id,
        discountAmount: resExamService.discount ?? 0,
        finalPrice: resExamService.totalPrice,
        parentClinicId: userLogin.parentClinicId,
        totalAmount: resExamService.totalPrice,
        vatAmount: 0,
        serviceId: resExamService.service.id,
        quantity: resExamService.quantity
      }))
    }

    try {
      await addPayment({ variables: { input: paymentData } })
      toast.success('Thanh toán thành công')

      // Update resExamServiceDt statuses after payment is successfully added
      await handleUpdateResExamServiceDt()

      // Reset form and close dialog
      reset({
        ...initPayment,
        paymentTypeId: paymentTypeDatas[0].id
      })
    } catch (error) {
      console.error('Error during payment process:', error)
    }
  }

  const onSubmit = (data: any) => {
    handleAddPayment(data)
  }

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await updatePayment({
        variables: {
          input: JSON.stringify({
            id: paymentId,
            status: 113
          })
        }
      })

      const paymentDts = paymentData.filter((payment: any) => payment.id === paymentId)[0].paymentDts

      const updatePromises = paymentDts.map((paymentDt: any) =>
        updateResExamServiceDt({
          variables: {
            input: JSON.stringify({
              id: paymentDt.resExamServiceId,
              paymentStatus: false
            })
          }
        })
      )

      await Promise.all(updatePromises)

      toast.success('Xóa thanh toán thành công')
      refetchPaymentData()
      refetchResExamData()
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const actuallyReceivedAmount = useWatch({ name: 'actuallyReceivedAmount', control })

  useEffect(() => {
    setValue('debtAmount', (getValues('finalPrice') ?? 0) - (actuallyReceivedAmount ?? 0))
  }, [actuallyReceivedAmount, setValue, getValues])

  return (
    <MUIDialog useFooter={false} maxWidth='xl' open={[open, onClose]} title='Thanh toán'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} sx={{ padding: '20px' }}>
          <Grid item xs={9}>
            <TabContext value={tab}>
              <TabList
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#0292B1'
                  }
                }}
                value={tab}
                onChange={(_, val) => handleSetTab(val)}
                aria-label='basic tabs example'
              >
                <Tab
                  label={
                    <Typography
                      style={tab === 'noPaid' ? colorActive : {}}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Icon icon='mdi:cash-off' width={24} />
                      <span style={{ height: '100%', marginLeft: '8px' }}>Chưa thanh toán</span>
                    </Typography>
                  }
                  value={'noPaid'}
                />
                <Tab
                  label={
                    <Typography
                      style={tab === 'paid' ? colorActive : {}}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Icon icon='ph:wallet-fill' width={24} />
                      <span style={{ height: '100%', marginLeft: '8px' }}>Đã Thanh Toán</span>
                    </Typography>
                  }
                  value={'paid'}
                />
              </TabList>
              <TabPanel value='noPaid'>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table
                        sx={{
                          minWidth: 650,
                          mt: 5,
                          overflow: 'hidden',
                          borderTopRadius: '12px'
                        }}
                        aria-label='simple table'
                      >
                        <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
                          <TableRow>
                            <TableCell align='center'>#</TableCell>
                            <TableCell align='center'>Tên</TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              Đơn vị tính
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              Số lượng
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              ĐƠN giá
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              Chiết khấu
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              Thành tiền
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              BH
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              MP
                            </TableCell>
                            <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                              XOÁ
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <React.Fragment>
                            {Object.keys(groupServicesDtsUnPaid).map(key => (
                              <React.Fragment key={key}>
                                <TableRow>
                                  <TableCell
                                    component='th'
                                    scope='row'
                                    colSpan={11}
                                    style={{
                                      backgroundColor: '#f0f0f0',
                                      color: '#0292B1',
                                      fontWeight: 'bold',
                                      textTransform: 'uppercase'
                                    }}
                                  >
                                    <IconButton size='small' onClick={() => toggleGroup(key)}>
                                      {expandedGroups[key] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                    {key === 'prescription'
                                      ? 'Đơn thuốc'
                                      : servicesGroupData.find((serviceGroup: any) => serviceGroup.id === key)?.name}
                                  </TableCell>
                                </TableRow>
                                {key === 'prescription'
                                  ? groupServicesDtsUnPaid[key].map((prescription: any, index: string) => (
                                      <TableRow key={prescription.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{prescription.prescriptionDts[0]?.product?.productName}</TableCell>
                                        <TableCell>{prescription.prescriptionDts[0]?.unit}</TableCell>
                                        <TableCell>{prescription.prescriptionDts[0]?.quantity}</TableCell>
                                        <TableCell>{prescription.prescriptionDts[0]?.price}</TableCell>
                                        <TableCell>{prescription.discount ?? 0}</TableCell>
                                        <TableCell>{prescription.prescriptionDts[0]?.totalPrice}</TableCell>
                                        <TableCell>
                                          <Checkbox
                                            checked={prescription.bhytYn}
                                            onChange={() => console.log('bhytYn', prescription.id)}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Checkbox
                                            checked={prescription.freeYn}
                                            onChange={() => console.log('freeYn', prescription.id)}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <IconButton onClick={() => console.log('delete', prescription.id)}>
                                            <Icon color='red' icon='bx:bx-trash' />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  : groupServicesDtsUnPaid[key].map((serviceDts: any, index: string) => (
                                      <TableRow key={serviceDts.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{serviceDts.service?.name}</TableCell>
                                        <TableCell>{serviceDts.service?.unit}</TableCell>
                                        <TableCell>{serviceDts.quantity}</TableCell>
                                        <TableCell>{serviceDts.service?.price}</TableCell>
                                        <TableCell>{serviceDts.discount ?? 0}</TableCell>
                                        <TableCell>{serviceDts.quantity * serviceDts.service?.price}</TableCell>
                                        <TableCell>
                                          <Checkbox
                                            checked={serviceDts.bhytYn}
                                            onChange={() => console.log('bhytYn', serviceDts.id)}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Checkbox
                                            checked={serviceDts.freeYn}
                                            onChange={() => console.log('freeYn', serviceDts.id)}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <IconButton onClick={() => handleDeleteService(serviceDts.id, key)}>
                                            <Icon color='red' icon='bx:bx-trash' />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value='paid'>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table
                        sx={{
                          minWidth: 650,
                          mt: 5,
                          overflow: 'hidden',
                          borderTopRadius: '12px',
                          border: '2px solid #e0e0e0'
                        }}
                        aria-label='simple table'
                      >
                        <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
                          <TableRow>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>#</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>Mã Hoá đơn</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>Tổng tiền</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>Giảm giá</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>thành tiền</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>trạng thái</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paymentData.map((payment, idx) => (
                            <RowPayment
                              key={payment.id}
                              row={payment}
                              index={idx}
                              onDeletePayment={handleDeletePayment}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={4} sx={{ mt: 8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Khách hàng</Typography>
                <Controller
                  name='patName'
                  control={control}
                  render={({ field }) => (
                    <Typography {...field} sx={{ fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase' }}>
                      {field.value}
                    </Typography>
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Người bán</Typography>
                <Controller
                  name='seller'
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Autocomplete
                      autoHighlight
                      openOnFocus
                      disablePortal
                      sx={{ width: '200px' }}
                      options={userDatas}
                      getOptionLabel={option => option.fristName + ' ' + option.lastName}
                      value={userDatas.find((option: { id: string }) => option.id === value) || null}
                      onChange={(_, newValue) => {
                        onChange(newValue ? newValue.id : '')
                      }}
                      defaultValue={userDatas.find((option: { id: string }) => option.id === userLogin.id) || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant='standard'
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ ...params.inputProps, style: { textAlign: 'right', fontWeight: 'bold' } }}
                        />
                      )}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Ngày bán</Typography>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography>{moment().format('DD/MM/YYYY')}</Typography>
                  <Typography sx={{ marginLeft: 4 }}>{moment().format('hh:mm:ss')}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Mã phiếu</Typography>
                <Typography>{resExamsData.id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Đối tượng</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{resExamsData.exploreObjects?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>BHYT chi trả:</Typography>
                <Controller
                  name='bhytAmount'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Typography {...field} sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                        {field.value}
                      </Typography>
                    )
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Tổng tiền</Typography>
                <Controller
                  name='totalAmount'
                  control={control}
                  render={({ field }) => (
                    <Typography {...field} sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {field.value}
                    </Typography>
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Giảm giá</Typography>
                <Controller
                  name='discountAmount'
                  control={control}
                  render={({ field }) => (
                    <Typography {...field} sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {field.value}
                    </Typography>
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Thành tiền</Typography>
                <Controller
                  name='finalPrice'
                  control={control}
                  render={({ field }) => (
                    <Typography {...field} sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {field.value}
                    </Typography>
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Khách trả</Typography>
                <Controller
                  name='actuallyReceivedAmount'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ width: '200px', fontWeight: 'bold' }}
                      variant='standard'
                      fullWidth
                      placeholder='Nhập số tiền'
                      onChange={e => field.onChange(e.target.value)}
                      inputProps={{ min: 0, style: { textAlign: 'right', fontWeight: 'bold' } }}
                      InputProps={{ inputMode: 'numeric' }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Còn lại</Typography>
                <Controller
                  name='debtAmount'
                  control={control}
                  render={({ field }) => (
                    <Typography {...field} sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {field.value}
                    </Typography>
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Phương thức TT</Typography>
                <Typography component={'div'}>
                  <Controller
                    name='paymentTypeId'
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        autoHighlight
                        openOnFocus
                        disablePortal
                        sx={{ width: '200px' }}
                        options={paymentTypeDatas}
                        getOptionLabel={option => option.name}
                        value={paymentTypeDatas.find((option: { id: string }) => option.id === value) || null}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.id : '')
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            variant='standard'
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ ...params.inputProps, style: { textAlign: 'right', fontWeight: 'bold' } }}
                          />
                        )}
                      />
                    )}
                  />
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Ghi chú</Typography>
              </Box>
              <Box>
                <textarea
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #D9D9D9'
                  }}
                ></textarea>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Stack
          sx={{ padding: '20px', backgroundColor: '#D9D9D9' }}
          direction={'row'}
          spacing={12}
          justifyContent={'end'}
        >
          <Box>
            <Checkbox />
            In giấy hẹn
          </Box>
          <Button
            variant='contained'
            sx={{ mr: 5, width: '200px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            type='submit'
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '200px', backgroundColor: '#8592A3', color: '#fff' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={onClose}
          >
            Đóng
          </Button>
        </Stack>
      </form>
    </MUIDialog>
  )
}

export default React.memo(PaymentInfoDialog)
