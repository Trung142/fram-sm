import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Tab,
  TextField,
  Typography
} from '@mui/material'
import ReactDatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridRowId,
  GridRowSelectionModel
} from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import { GET_PRESCRIPTION } from './graphql/query'
import { useMutation, useQuery } from '@apollo/client/react/hooks'
import moment from 'moment'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CreateIcon from '@mui/icons-material/Create'
import PrintIcon from '@mui/icons-material/Print'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import DetailDialog from './DetailDialog'
import { styled } from '@mui/system'
import { UPDATE_PRESCRIPTION } from './graphql/mutation'
import { IPrescription } from './graphql/variables'
import PrintsComponent from 'src/components/prints'
import { getLocalstorage } from 'src/utils/localStorageSide'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  keySearch: string
  skip: number
  take: number
}
const StyledDataGrid = styled('div')(({ theme }) => ({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#32475C38'
  }
}))
const Prescription = () => {
  const router = useRouter()
  //================================================TABLE================================
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false)
  const [dataPre, setDataPre] = useState<IPrescription>()
  const [priteOpen, setPrintOpen] = useState(false)
  const dataUser = getLocalstorage('userData')
  const [id, setId] = useState<any>({
    preId: '',
    resExamId: ''
  })
  console.log(id)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const setDialog = (data: IPrescription) => {
    setDataPre(data)
    setOpenDetailDialog(true)
  }
  const handPrint = () => {
    setPrintOpen(true)
    handleClose()
  }

  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.05,
      minWidth: 70,
      field: 'index',
      headerName: '#'
    },
    GRID_CHECKBOX_SELECTION_COL_DEF,
    {
      flex: 0.25,
      minWidth: 200,
      field: 'id',
      headerName: 'MÃ ĐƠN THUỐC',
      renderCell: params => (
        <div>
          <div>
            <span>{params.value}</span>
          </div>
          <div>
            <span>{moment(params.row?.createAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'resExamId',
      headerName: 'PHIẾU KHÁM',
      renderCell: params => (
        <div>
          <span>{params.row?.resExam?.id}</span>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'resExam',
      headerName: 'BÁC SĨ',
      renderCell: params => (
        <div>
          <span>
            {params.value?.doctor?.fristName} {params.value?.doctor?.lastName}
          </span>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'patName',
      headerName: 'KHÁCH HÀNG',
      renderCell: params => {
        const age =
          params.row?.resExam?.age === null ||
          params.row?.resExam?.age === undefined ||
          params.row?.resExam?.age == 0 ? (
            <span>{params.row?.resExam?.monthsOld} tháng tuổi</span>
          ) : (
            <span>{params.row?.resExam?.age} tuổi</span>
          )
        return (
          <div>
            <div>
              <span>{params.row?.resExam?.patName}</span>
            </div>
            <div>
              <span>
                {params.row?.resExam?.gender == '1' ? 'Nam' : 'Nữ'} - [{params.row?.resExam?.year}] - {age}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'statusSignOnline',
      headerName: 'KÝ SỐ',
      renderCell: params => {
        if (params.value === undefined || params.value === null || params.value == false) {
          return <span className={styles.waiting}>CHƯA KÝ</span>
        } else if (params.value === true) {
          return <span className={styles.approved}>ĐÃ KÝ</span>
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'statusDtqg',
      headerName: 'LIÊN THÔNG TOA THUỐC',
      renderCell: params => {
        if (params.value === undefined || params.value === null || params.value == false) {
          return <span className={styles.waiting}>CHƯA LIÊN THÔNG</span>
        } else if (params.value == true) {
          return <span className={styles.approved}>ĐÃ LIÊN THÔNG</span>
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'status',
      headerName: 'TRẠNG THÁI',
      renderCell: params => {
        const status = () => {
          if (params.row?.status === null || params.row?.status === undefined || params.row?.status === '113') {
            return <span className={styles.buy_delete}>ĐÃ HỦY</span>
          } else if (params.row?.status === '111') {
            return <span className={styles.buy_waiting}>CHƯA MUA</span>
          } else if (params.row?.status === '112') {
            return <span className={styles.buy_completed}>ĐÃ MUA</span>
          }
        }
        const paymentStatus =
          params.row?.paymentStatus === true ? <UploadFileIcon sx={{ color: '#72E1288A' }} /> : <UploadFileIcon />
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            {status()} {paymentStatus}
          </div>
        )
      }
    },
    {
      flex: 0.15,
      field: 'action',
      minWidth: 160,
      headerName: 'THAO TÁC',
      renderCell: params => (
        <div className='flex justify-center'>
          {params.row?.prescriptionDts === null || params.row?.prescriptionDts === undefined ? null : (
            <IconButton
              title='Xem chi tiết'
              onClick={() => {
                if (params.row?.id) {
                  setDialog(params.row)
                }
              }}
            >
              <RemoveRedEyeOutlinedIcon />
            </IconButton>
          )}
          <IconButton
            title='Thêm'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={event => {
              handleClick(event)
              setId({
                preId: params.row?.id,
                resExamId: params.row?.resExam?.id
              })
            }}
          >
            <Icon icon='icon-park-outline:more-two' />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem
              onClick={() => {
                router.push({
                  pathname: `/examination/examination-list/examination-update/${id.resExamId}/`,
                  query: { tabName: 'Prescription' }
                })
              }}
            >
              <CreateIcon sx={{ color: '#6062E8', mr: 2 }} /> Sửa
            </MenuItem>
            <MenuItem onClick={handPrint}>
              <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In đơn thuốc
            </MenuItem>
            <MenuItem onClick={handleStatusDtqg}>
              <KeyboardDoubleArrowRightIcon sx={{ color: '#0292B18A', mr: 2 }} /> Liên thông thuốc
            </MenuItem>
            <MenuItem onClick={handleSignOnlineClick}>
              <Icon icon='lucide:edit' style={{ color: '#32475CAD', marginRight: 14 }} /> Ký số
            </MenuItem>
          </Menu>
        </div>
      )
    }
  ]

  //============================================SEARCH-DATA==========================================
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  const [searchData, setSearchData] = useState<RequestType>({
    fromDate: startOfDay,
    toDate: endOfDay,
    statusId: '',
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })
  const handleChangeSearch = (key: string, value: any) => {
    setPaginationModel({
      page: 0,
      pageSize: 25
    })
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const statusGroup = [
    {
      id: '111',
      statusName: 'Chờ mua'
    },
    {
      id: '112',
      statusName: 'Đã mua'
    },
    {
      id: '113',
      statusName: 'Đã hủy'
    },
    {
      id: '',
      statusName: 'Tất cả'
    }
  ]
  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        status: searchData.statusId ? { eq: searchData.statusId } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        or: [
          { id: { contains: searchData.keySearch } },
          { resExamId: { contains: searchData.keySearch } },
          {
            resExam: { patName: { contains: searchData.keySearch } }
          },
          {
            resExam: {
              doctor: {
                fristName: { contains: searchData.keySearch }
              }
            }
          },
          {
            resExam: {
              doctor: {
                lastName: { contains: searchData.keySearch }
              }
            }
          }
        ]
      }
    }))
  }, [searchData, paginationModel])
  const clearSearch = () => {
    setSearchData({
      fromDate: startOfDay,
      toDate: endOfDay,
      statusId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setQueryVariables({
      input: {},
      skip: searchData.skip,
      take: searchData.take
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
  }
  //=======================================================DATA===========================
  const { data: queryData, loading, error, refetch } = useQuery(GET_PRESCRIPTION, { variables: queryVariables })

  const data: IPrescription[] = useMemo(() => {
    return queryData?.getPrescription?.items ?? []
  }, [queryData])

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }
  //==============================================UPDATE DATA ==========================
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])

  const [updatePrescription] = useMutation(UPDATE_PRESCRIPTION)
  const handleSignOnlineClick = async () => {
    if (id.preId !== '') {
      updatePrescription({
        variables: {
          input: JSON.stringify({
            id: id.preId,
            statusSignOnline: true
          })
        },
        onCompleted: async () => {
          await refetch()
          id.preId = ''
        }
      })
    } else {
      rowSelectionModel.map(row => {
        updatePrescription({
          variables: {
            input: JSON.stringify({
              id: row,
              statusSignOnline: true
            })
          },
          onCompleted: async () => {
            await refetch()
          }
        })
      })
    }
  }
  const handleStatusDtqg = async () => {
    if (id.preId !== '') {
      updatePrescription({
        variables: {
          input: JSON.stringify({
            id: id.preId,
            statusDtqg: true
          })
        },
        onCompleted: async () => {
          await refetch()
          id.preId = ''
        }
      })
    } else {
      rowSelectionModel.map(row => {
        updatePrescription({
          variables: {
            input: JSON.stringify({
              id: row,
              statusDtqg: true
            })
          },
          onCompleted: async () => {
            await refetch()
          }
        })
      })
    }
  }
  return (
    <Grid container>
      {openDetailDialog ? <DetailDialog open={[openDetailDialog, setOpenDetailDialog]} data={dataPre} /> : null}
      <Grid item md={12} xs={12}>
        <Card sx={{ p: 5 }}>
          <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
            <Typography variant='h4' ml={10}>
              Đơn thuốc
            </Typography>
            <Stack direction={'row'} spacing={2}>
              <Button variant='contained' color='info' sx={{ pl: 5, pr: 8 }} onClick={() => handleSignOnlineClick()}>
                <Icon icon='lucide:edit' style={{ color: '#ffffff', marginRight: 14 }} /> KÝ SỔ
              </Button>
              <Button
                variant='contained'
                sx={{ pl: 5, pr: 8, backgroundColor: '#55A629' }}
                onClick={() => handleStatusDtqg()}
              >
                <KeyboardDoubleArrowRightIcon sx={{ color: '#ffffff', mr: 2 }} /> LIÊN THÔNG THUỐC
              </Button>
              <Button
                variant='contained'
                color='primary'
                sx={{ pl: 5, pr: 8 }}
                onClick={() => router.push('/examination/examination-list/')}
              >
                <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                Thêm mới
              </Button>
            </Stack>
          </Stack>
          <Grid container spacing={6} mt={3}>
            <Grid item xs={6} md={2}>
              <DatePickerWrapper>
                <ReactDatePicker
                  selected={searchData.fromDate}
                  autoComplete='true'
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
            </Grid>
            <Grid item xs={6} md={2}>
              <DatePickerWrapper>
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
            <Grid item xs={6} md={2}>
              <Autocomplete
                disablePortal
                fullWidth
                options={statusGroup}
                getOptionLabel={option => option.statusName}
                value={statusGroup.find((x: any) => x.id === searchData.statusId)}
                onChange={(e, value: any) => {
                  if (value && value.id === searchData.statusId) {
                    handleChangeSearch('statusId', value.id)
                  }
                  handleChangeSearch('statusId', value?.id)
                }}
                renderInput={params => <TextField {...params} label='Trạng thái' />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label='Từ khoá tìm kiếm'
                    autoComplete='off'
                    placeholder='Nhập từ khoá tìm kiếm'
                    value={searchData.keySearch}
                    onChange={e => {
                      handleChangeSearch('keySearch', e.target.value)
                    }}
                  />
                </Grid>
                <Button
                  sx={{ ml: -1, borderRadius: 0 }}
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    handleSearch()
                  }}
                >
                  <Icon icon='bx:search' fontSize={24} />
                </Button>
                <Button
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    clearSearch()
                  }}
                >
                  <Icon icon='bx:revision' fontSize={24} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant='h6' color={'white'}>
                DANH SÁCH ĐƠN THUỐC
              </Typography>
            }
            sx={{ backgroundColor: '#0292B1', height: '10px' }}
          />
          <CardContent sx={{ width: '104%', ml: -6 }}>
            <StyledDataGrid>
              <DataGrid
                columns={COLUMN_DEF}
                rows={data.map((item, index) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                keepNonExistentRowsSelected
                checkboxSelection
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={newRowSelectionModel => {
                  setRowSelectionModel(newRowSelectionModel)
                }}
                rowCount={queryData?.getPrescription?.totalCount ?? 0}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='server'
                loading={loading}
                slots={{
                  noRowsOverlay: () => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '100%'
                      }}
                    >
                      <span>Không có dữ liệu</span>
                    </div>
                  ),
                  noResultsOverlay: () => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        height: '100%'
                      }}
                    >
                      <span>Không tìm thấy dữ liệu</span>
                    </div>
                  )
                }}
                style={{ minHeight: 500, height: '60vh' }}
              />
            </StyledDataGrid>
          </CardContent>
        </Card>
        <PrintsComponent
          printFunctionId='pr10000003'
          printType='p_prescription_id'
          printTypeId={id?.preId}
          clinicId={dataUser.clinicId}
          parentClinicId={dataUser.parentClinicId}
          openPrint={priteOpen}
          setOpenButtonDialog={setPrintOpen}
          titlePrint='In đơn thuốc'
        />
      </Grid>
    </Grid>
  )
}

export default Prescription
