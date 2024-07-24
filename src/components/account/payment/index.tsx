import React, { useState, useMemo, useEffect, use, useCallback } from 'react'
import moment from 'moment'
import { useQuery, useLazyQuery } from '@apollo/client'
import ReactDatePicker from 'react-datepicker'
import {
  Grid,
  Card,
  TextField,
  CardHeader,
  CardContent,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Stack,
  Autocomplete,
  Typography,
  Tab
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import RefreshIcon from '@mui/icons-material/Refresh'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getGender } from 'src/utils/common'
import { GET_RES_EXAM } from './graphql/query'
import { Icon } from '@iconify/react'
import { ResExamStatuses } from './constants/index'
import PaymentInfoDialog from './PaymentInfoDialog'
import { getStatusResExam, getStatusPrescriptionsResExam, getExploreObjectType } from './helper'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
import dateformat from 'dateformat'
import ResExamDialog from './ResExamDialog'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'

const Payment = () => {
  const [openDetailsPaymentDialog, setOpenDetailsPaymentsDialog] = useState(false)
  const [dialogResExamInfoOpen, setDialogResExamInfoOpen] = useState(false)
  const [selectedResExam, setSelectedResExam] = useState<string>('')
  const [tabValue, setTabValue] = useState<string>('1')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState({
    status: null,
    departmentId: null,
    fromDate: null,
    toDate: null,
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })
  const [queriesResExamCondition, setQueriesResExamCondition] = useState({
    input: {},
    skip: searchData.skip,
    take: searchData.take,
    order: [{ createAt: 'DESC' }]
  })

  const { data: getResExamData, refetch: refetchResExam } = useQuery(GET_RES_EXAM, {
    variables: queriesResExamCondition,
    fetchPolicy: 'network-only'
  })

  const resExamsData: any[] = useMemo(() => getResExamData?.getResExam?.items ?? [], [getResExamData])

  useEffect(() => {
    setQueriesResExamCondition((x: any) => ({
      ...x,
      input: {
        or: [
          { id: { contains: searchData.keySearch } },
          { patName: { contains: searchData.keySearch } },
          { phone: { contains: searchData.keySearch } },
          { patCccd: { contains: searchData.keySearch } },
          { patBhyt: { contains: searchData.keySearch } }
        ],
        createAt: {
          gte: searchData.fromDate ? dateformat(searchData.fromDate, 'yyyy-mm-dd') : undefined,
          lte: searchData.toDate ? dateformat(searchData.toDate, 'yyyy-mm-dd') : undefined
        },
        status: searchData.status ? { eq: searchData.status } : undefined,
        departmentId: searchData.departmentId ? { eq: searchData.departmentId } : undefined
      },

      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      order: [{ createAt: 'DESC' }]
    }))
  }, [searchData, paginationModel])

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleSearch = () => {
    return null
  }

  const clearSearch = () => {
    // setQueryVariables({
    //   patTypeId: '',
    //   patGroupId: '',
    //   keySearch: '',
    //   skip: 0,
    //   take: paginationModel.pageSize
    // })
    // setPaginationModel({
    //   ...paginationModel,
    //   page: 0
    // })
    // setKeySearch('')
    refetchResExam()
  }

  const handleOpenPaymentInfoDialog = (id: string) => {
    setSelectedResExam(id)
    setOpenDetailsPaymentsDialog(!openDetailsPaymentDialog)
  }

  const handleOpenResExamInfoDialog = (id: string) => {
    setSelectedResExam(id)
    setDialogResExamInfoOpen(!dialogResExamInfoOpen)
  }

  const onChangeTab = (e: any, value: any) => {
    setTabValue(value)
    setSearchData({
      ...searchData,
      skip: 0,
      take: paginationModel.pageSize,
      status: null
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
  }

  const renderPatInfo = useCallback((params: { row: any }) => {
    const { patName, gender, age, year } = params.row
    return (
      <div className='flex flex-col'>
        <span>
          {patName} - {getGender(gender)}
        </span>
        <div className='text-xs text-gray-500'>
          {year} - {age} tuổi
        </div>
      </div>
    )
  }, [])

  const columnsPaymentListInfoIndex: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        minWidth: 50,
        flex: 1,
        headerName: '#',
        renderCell: (params: { row: { index?: any } }) => {
          const { index } = params.row
          return <div>{index}</div>
        }
      },
      {
        field: 'patId',
        minWidth: 150,
        flex: 1,
        headerName: 'Mã Phiếu',
        renderCell: (params: { row: { createdAt?: any; patId?: any } }) => {
          const { patId } = params.row

          return (
            <div>
              <span>{patId}</span>
              <div>
                <span>{moment(params.row.createdAt).format('DD/MM/YYYY HH:mm')}</span>
              </div>
            </div>
          )
        }
      },
      {
        field: 'patInfo',
        minWidth: 300,
        flex: 1,
        headerName: 'Họ và Tên',
        renderCell: renderPatInfo
      },
      {
        field: 'paymentObjectId',
        minWidth: 150,
        flex: 1,
        headerName: 'Đối tượng',
        renderCell: (params: { row: { exploreObjects: any } }) => {
          const { exploreObjects } = params.row
          return (
            <div style={{ ...getExploreObjectType(exploreObjects?.id).styles, textAlign: 'center' }}>
              {exploreObjects?.name ?? getExploreObjectType(exploreObjects?.id).label}
            </div>
          )
        }
      },
      {
        field: 'doctor',
        minWidth: 150,
        flex: 1,
        headerName: 'Bác sỉ',
        renderCell: (params: { row: { doctor: any } }) => {
          const { doctor } = params.row

          return (
            <div>
              {doctor?.fristName} {doctor?.lastName}
            </div>
          )
        }
      },
      {
        field: 'total',
        minWidth: 150,
        flex: 1,
        headerName: 'Tổng tiền',
        renderCell: (param: any) => {
          const totalPrice = param.row.resExamServiceDts.reduce((acc: number, item: any) => {
            return acc + (item.totalPrice || 0)
          }, 0)
          return <Typography>{totalPrice}</Typography>
        }
      },
      {
        field: 'status',
        minWidth: 250,
        flex: 1,
        headerName: 'Trạng thái',
        renderCell: (param: any) => {
          const isPayment = param.row?.resExamServiceDts?.every((item: any) => item?.paymentStatus)

          return (
            <Stack direction={'row'} justifyContent={'space-around'} columnGap={3}>
              <span style={{ ...getStatusResExam(param.row.status).styles, textAlign: 'center' }}>
                {getStatusResExam(param.row.status).label}
              </span>

              <span
                style={{
                  ...getStatusPrescriptionsResExam(isPayment, false).styles,
                  textAlign: 'center'
                }}
              >
                <Icon icon='ic:baseline-attach-money' fontSize={24} />
              </span>

              {param.row.prescriptions.deleteYn ? (
                <span
                  style={{
                    ...getStatusPrescriptionsResExam(param.row.prescriptions.status, param.row.prescriptions.deleteYn)
                      .styles,
                    textAlign: 'center'
                  }}
                >
                  <Icon icon='ion:bandage-outline' width='1.6rem' height='1.6rem' />
                </span>
              ) : (
                <span
                  style={{
                    ...getStatusPrescriptionsResExam(param.row.prescriptions.status, param.row.prescriptions.deleteYn)
                      .styles,
                    textAlign: 'center'
                  }}
                >
                  <Icon icon='ion:bandage-outline' width='1.6rem' height='1.6rem' />
                </span>
              )}
              {/* <span
              style={{
                ...getInvoiceCapsuleStatus(params.row.invoiceStatus).styles,
                textAlign: 'center',
                textTransform: 'uppercase'
              }}
            >
              <Icon icon='mdi:dollar' width='1.6rem' height='1.6rem' />
            </span>
  
            <span
              style={{
                ...getInvoiceCapsuleStatus(params.row.invoiceCapsuleStatus).styles,
                textAlign: 'center',
                textTransform: 'uppercase'
              }}
            >
              <Icon icon='ion:bandage-outline' width='1.6rem' height='1.6rem' />
            </span> */}
            </Stack>
          )
        }
      },
      {
        field: 'none',
        minWidth: 150,
        flex: 1,
        headerName: 'Thao tác',
        renderCell: (params: any) => (
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <span
              style={{
                border: '1px solid rgb(217, 217, 217)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#67C932',
                cursor: 'pointer'
              }}
              onClick={() => handleOpenPaymentInfoDialog(params.row.id)}
            >
              <Icon icon='mdi:dollar' width='2.4rem' height='2.4rem' />
            </span>
            <span
              style={{
                cursor: 'pointer'
              }}
              onClick={() => handleOpenResExamInfoDialog(params.row.id)}
            >
              <RemoveRedEyeRoundedIcon />
            </span>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <React.Fragment>
      <Grid container>
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader title='Thanh toán' />
            <CardContent>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={2}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                      <ReactDatePicker
                        selected={searchData.fromDate}
                        dateFormat={'dd/MM/yyyy'}
                        customInput={
                          <TextField
                            fullWidth
                            label='Từ ngày'
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
                        onChange={(date: Date) => handleChangeSearch('fromDate', date)}
                      />
                    </DatePickerWrapper>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                    <ReactDatePicker
                      selected={searchData.toDate}
                      dateFormat={'dd/MM/yyyy'}
                      customInput={
                        <TextField
                          fullWidth
                          label='Đến ngày'
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
                      onChange={(date: Date) => handleChangeSearch('toDate', date)}
                    />
                  </DatePickerWrapper>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    options={ResExamStatuses}
                    getOptionLabel={option => (typeof option === 'string' ? option : option.label)}
                    value={
                      searchData.status ? ResExamStatuses.find(status => status.value === searchData.status) : null
                    }
                    onChange={(_, value) => handleChangeSearch('status', value?.value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Trạng thái'
                        placeholder='Chọn trạng thái'
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <div style={{ display: 'flex', width: '80%' }}>
                    <TextField
                      label='Nhập từ khoá tìm kiếm'
                      placeholder='Nhập từ khoá tìm kiếm'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={searchData.keySearch}
                      onChange={e => handleChangeSearch('keySearch', e.target.value)}
                      variant='outlined'
                      sx={{
                        '& label': { paddingLeft: theme => theme.spacing(2) },
                        '& input': { paddingLeft: theme => theme.spacing(3.5) },
                        width: '100%',
                        '& fieldset': {
                          paddingLeft: theme => theme.spacing(2.5),
                          maxWidth: 600,
                          borderTopRightRadius: '0px',
                          borderBottomRightRadius: '0px'
                        }
                      }}
                    />
                    <Button
                      sx={{ borderRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                      onClick={() => handleSearch()}
                    >
                      <Icon fontSize={20} icon='bx:bx-search' color='white' />
                    </Button>
                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      variant='contained'
                      style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
                      onClick={() => clearSearch()}
                    >
                      <RefreshIcon />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12} xs={12} sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <TabContext value={tabValue}>
                      <TabList
                        onChange={onChangeTab}
                        color='red'
                        centered={false}
                        variant='scrollable'
                        sx={{ width: '100%' }}
                      >
                        <Tab value='1' label='Danh sách thanh toán' />
                      </TabList>
                    </TabContext>
                    <DataGrid
                      paginationMode='server'
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      rowCount={getResExamData?.getResExam?.totalCount ?? 0}
                      rows={resExamsData.map((item, index) => ({
                        ...item,
                        index: index + 1 + paginationModel.page * paginationModel.pageSize
                      }))}
                      columns={columnsPaymentListInfoIndex}
                      rowHeight={70}
                      pagination
                      slots={{
                        noRowsOverlay: () => (
                          <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                        )
                      }}
                      style={{ minHeight: 500, height: '60vh' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* =============================== DIALOG ======================================= */}
      {/* =============================== DIALOG ======================================= */}
      {/* =============================== DIALOG ======================================= */}
      {openDetailsPaymentDialog && (
        <PaymentInfoDialog
          key={selectedResExam}
          open={openDetailsPaymentDialog}
          onClose={() => setOpenDetailsPaymentsDialog(!openDetailsPaymentDialog)}
          resExamId={selectedResExam}
        />
      )}
      <ResExamDialog open={[dialogResExamInfoOpen, setDialogResExamInfoOpen]} resExamId={selectedResExam} />
    </React.Fragment>
  )
}

export default Payment
