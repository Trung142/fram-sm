import React, { useContext, useMemo, useState, useEffect, useTransition } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  Stack,
  TextField,
  MenuItem,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import Icon from 'src/@core/components/icon'
import FilterDropdown from 'src/@core/components/filter-dropdown'
import { dropdownOptions } from 'src/@core/components/filter-dropdown/constant'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import { GET_RES_EXAM, GET_DEPARTMENT } from './graphql/query'
import { useQuery } from '@apollo/client'
import CustomerInfoDialog from './dialogs/CustomerInfoDialog'
import { QueryContext } from './QueryProvider'
import { MutationContext } from './MutationProvider'
import dateformat from 'dateformat'
import { ResExamStatuses } from './constants'
import { getStatusResExam, getStatusPrescriptionsResExam } from './utils/helpers'
import ConfirmationDialog from './dialogs/ConfirmationDialog'
import toast from 'react-hot-toast'
import PrintsComponent from '../prints'
import PrintIcon from '@mui/icons-material/Print'
import { getLocalstorage } from 'src/utils/localStorageSide'

// *********************************************************************************** //
// ************************************ Component ************************************ //
// *********************************************************************************** //
const ExaminationListTab = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorOptionsEl, setAnchorOptionsEl] = useState(null)
  const dialogState = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = dialogState
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [printPrescription, setPrintPrescription] = useState(false)
  const [printRegisExam, setPrintRegisExam] = useState(false)
  const openFilter = Boolean(anchorEl)
  const openOptions = Boolean(anchorOptionsEl)
  const dataUser = getLocalstorage('userData')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [isPending, startTransition] = useTransition()
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

  const { triggerRefetchData } = useContext(QueryContext)
  const { updateResExam } = useContext(MutationContext)
  const [selectedResExam, setSelectedResExam] = useState<string>('')

  const {
    data: getResExamData,
    loading,
    refetch: refetchResExam
  } = useQuery(GET_RES_EXAM, {
    variables: queriesResExamCondition
  })

  const { data: getDepartmentData } = useQuery(GET_DEPARTMENT, {})

  const resExamData: any[] = useMemo(() => getResExamData?.getResExam?.items ?? [], [getResExamData])

  const departmentData: any[] = useMemo(() => {
    return getDepartmentData?.getDepartment?.items ?? []
  }, [getDepartmentData])

  useEffect(() => {
    refetchResExam({
      variables: queriesResExamCondition
    })
  }, [triggerRefetchData, refetchResExam, queriesResExamCondition])

  useEffect(() => {
    startTransition(() => {
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
    })
  }, [searchData, paginationModel])

  const columns = [
    { field: 'index', headerName: 'ID', width: 100 },
    {
      field: 'id',
      headerName: 'Mã phiếu',
      width: 200
    },
    {
      field: 'patName',
      headerName: 'Họ tên',
      width: 200,
      renderCell: (param: any) => {
        return (
          <Stack spacing={2}>
            <div>{param.row.patName}</div>
            <div>{`${param.row.age} tuổi - ${param.row.gender == 1 ? 'Nữ' : 'Nam'} - ${param.row.year}`}</div>
          </Stack>
        )
      }
    },
    { field: 'phone', headerName: 'Điện thoại', width: 200 },
    {
      field: 'doctorId',
      headerName: 'Bác sĩ',
      width: 200,
      renderCell: (params: any) => {
        const doctor = (params.row?.doctor?.fristName || '') + ' ' + (params.row?.doctor?.lastName || '')
        return (
          <>
            <Stack spacing={2}>
              <div>{doctor}</div>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'thanhToan',
      headerName: 'Thanh toán',
      width: 200,
      renderCell: (param: any) => {
        const isPayment = param.row?.resExamServiceDts?.every((item: any) => item?.paymentStatus)
        return (
          <>
            <Stack direction='column' spacing={1} alignItems='center'>
              <div style={{ ...getStatusResExam(param.row.status).styles, textAlign: 'center' }}>
                {getStatusResExam(param.row.status).label}
              </div>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  '& div': {
                    backgroundColor: 'rgba(184, 186, 183, 0.2)',
                    borderRadius: '10px',
                    border: '1px solid #646E7A',
                    padding: '8px 12px',
                    fontSize: '14px'
                  }
                }}
              >
                <div
                  style={{
                    ...getStatusPrescriptionsResExam(isPayment, false).styles,
                    textAlign: 'center'
                  }}
                >
                  <Icon icon='ic:baseline-attach-money' fontSize={24} />
                </div>

                {param.row.prescriptions.deleteYn ? (
                  <div
                    style={{
                      ...getStatusPrescriptionsResExam(param.row.prescriptions.status, param.row.prescriptions.deleteYn)
                        .styles,
                      textAlign: 'center'
                    }}
                  >
                    <Icon icon='bi:capsule' fontSize={24} />
                  </div>
                ) : (
                  <div
                    style={{
                      ...getStatusPrescriptionsResExam(param.row.prescriptions.status, param.row.prescriptions.deleteYn)
                        .styles,
                      textAlign: 'center'
                    }}
                  >
                    <Icon icon='bi:capsule' fontSize={24} />
                  </div>
                )}
              </Box>
            </Stack>
          </>
        )
      }
    },
    {
      field: 'tongTien',
      headerName: 'Tổng tiền',
      width: 200,
      renderCell: (param: any) => {
        const totalPrice = param.row.resExamServiceDts.reduce((acc: number, item: any) => {
          return acc + (item.totalPrice || 0)
        }, 0)
        return <Typography>{totalPrice}</Typography>
      }
    },
    {
      field: 'head',
      headerName: 'Head',

      width: 200,
      renderCell: (params: any) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setSelectedResExam(String(params.row.id))
                setDialogOpen(true)
              }}
            >
              <RemoveRedEyeIcon sx={{ fontSize: '32px' }} />
            </IconButton>
            <IconButton>
              <AttachMoneyIcon />
            </IconButton>
            <div>
              <Button
                aria-controls={openOptions ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={openOptions ? 'true' : undefined}
                onClick={(e: any) => {
                  setAnchorOptionsEl(e.currentTarget)
                  setSelectedResExam(String(params.row.id))
                }}
              >
                <Icon style={{ color: 'gray' }} icon='ph:dots-three-circle-light' fontSize={32} />
              </Button>
              <Menu
                anchorEl={anchorOptionsEl}
                open={openOptions}
                onClose={handleCloseMenu}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseMenu()
                    setPrintRegisExam(true)
                  }}
                >
                  <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In Phiếu đăng kí khám
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  {' '}
                  <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In phiếu chỉ định dịch vụ
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu()
                    setPrintPrescription(true)
                  }}
                >
                  <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In đơn thuốc
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setConfirmModalOpen(true)
                    handleCloseMenu()
                  }}
                >
                  <Icon icon='bx:trash' width='24' height='24' color='#FF3E1D' style={{ marginRight: 8 }} /> Hủy khám
                </MenuItem>
              </Menu>
            </div>
          </>
        )
      }
    }
  ]

  const handleOpenFilter = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setAnchorEl(null)
  }

  const handleCloseMenu = () => {
    setAnchorOptionsEl(null)
  }

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleUpdateResExam = () => {
    updateResExam({
      variables: {
        input: JSON.stringify({ id: selectedResExam, status: '107' })
      },
      onCompleted: () => {
        toast.success('Hủy khám thành công')
        refetchResExam({
          variables: queriesResExamCondition
        })
      },
      onError: () => {
        toast.error('Hủy khám thất bại')
      }
    })
  }

  return (
    <>
      <Grid container>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={6}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button
                variant='text'
                sx={{
                  backgroundColor: '#D9D9D9',
                  '&:hover': {
                    backgroundColor: '#D9D9D9'
                  }
                }}
                onClick={handleOpenFilter}
              >
                <FilterAltIcon sx={{ width: '2rem', height: '2rem' }} />
              </Button>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                <ReactDatePicker
                  selected={searchData.fromDate}
                  dateFormat={'dd/MM/yyyy'}
                  showMonthDropdown
                  showYearDropdown
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
              <Menu anchorEl={anchorEl} open={openFilter} onClose={handleCloseFilter}>
                <FilterDropdown options={dropdownOptions} onClick={handleCloseFilter} />
              </Menu>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
              <ReactDatePicker
                selected={searchData.toDate}
                dateFormat={'dd/MM/yyyy'}
                showMonthDropdown
                showYearDropdown
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
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={departmentData}
              placeholder='Chọn phòng khám'
              getOptionLabel={option => option.name}
              value={departmentData.find(dept => dept.id === searchData.departmentId) || null}
              onChange={(e, value) => handleChangeSearch('departmentId', value?.id)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Phòng Khám'
                  placeholder='Chọn phòng khám'
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={ResExamStatuses}
              getOptionLabel={option => (typeof option === 'string' ? option : option.label)}
              value={searchData.status ? ResExamStatuses.find(status => status.value === searchData.status) : null}
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
          <Grid item xs={12} sm={12}>
            <div style={{ display: 'flex' }}>
              <TextField
                label='Nhập từ khoá tìm kiếm'
                placeholder='Nhập từ khoá tìm kiếm'
                value={searchData.keySearch}
                onChange={e => handleChangeSearch('keySearch', e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant='outlined'
                sx={{
                  width: '100%',
                  '& fieldset': {
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px'
                  }
                }}
              />
              <Button
                sx={{ borderRadius: 0 }}
                variant='contained'
                style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
              >
                <SearchIcon />
              </Button>
              <Button
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                variant='contained'
                style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
              >
                <RefreshIcon />
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <DataGrid
                  paginationMode='server'
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  rowCount={getResExamData?.getResExam?.totalCount ?? 0}
                  rows={resExamData.map((item, index) => ({
                    ...item,
                    index: index + 1 + paginationModel.page * paginationModel.pageSize
                  }))}
                  loading={loading || isPending}
                  columns={columns}
                  rowHeight={110}
                  pagination
                  style={{ minHeight: 700 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <CustomerInfoDialog open={[dialogOpen, setDialogOpen]} resExamId={selectedResExam} />
      <ConfirmationDialog
        isOpen={confirmModalOpen}
        title='Confirm Cancellation'
        message='Are you sure you want to cancel this examination?'
        onConfirm={() => {
          handleUpdateResExam()
          setConfirmModalOpen(false)
        }}
        onCancel={() => setConfirmModalOpen(false)}
      />
      <PrintsComponent
        printFunctionId='pr10000003'
        printType='p_prescription_id'
        printTypeId={selectedResExam}
        clinicId={dataUser.clinicId}
        parentClinicId={dataUser.parentClinicId}
        openPrint={printPrescription}
        setOpenButtonDialog={setPrintPrescription}
        titlePrint='In Đơn thuốc'
      />
      <PrintsComponent
        printFunctionId='pr10000004'
        printType='p_res_ex_id'
        printTypeId={selectedResExam}
        clinicId={dataUser.clinicId}
        parentClinicId={dataUser.parentClinicId}
        openPrint={printRegisExam}
        setOpenButtonDialog={setPrintRegisExam}
        titlePrint='In Phiếu đăng kí khám'
      />
    </>
  )
}

export default ExaminationListTab
