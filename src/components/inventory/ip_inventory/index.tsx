import React, { useState, useEffect, useMemo } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Card,
  Menu,
  MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useMutation, useQuery } from '@apollo/client'
import { signal } from '@preact/signals'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import PrintIcon from '@mui/icons-material/Print'
import EditIcon from '@mui/icons-material/Edit'
import { GET_WH_EXISTENCE, GET_WH } from './graphql/query'
import { IWhExistenceInput } from './graphql/variables'
import moment from 'moment'
import { UPDATE_WH_EXISTENCE } from './graphql/mutation'
import toast from 'react-hot-toast'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import { useRouter } from 'next/navigation'
import { getLocalstorage } from 'src/utils/localStorageSide'
import PrintsComponent from 'src/components/prints'
import styles from './index.module.scss'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  whId: string | null
  keySearch: string
  skip: number
  take: number
}
//chuc nang add va thêm
export const dialogType = signal<'add' | 'update'>('add')
const IpInventory = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [printOpen, setPrintOpen] = useState(false)
  const dataUser = getLocalstorage('userData')
  const openPopup = Boolean(anchorEl)
  const [keySearch, setKeySearch] = useState('')
  const [statusId, setStatusId] = useState<string>()
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const [UpdateWhExistence] = useMutation(UPDATE_WH_EXISTENCE)
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
    whId: '',
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  const [updateData, setUpdateData] = useState<any>({})
  const {
    data: getWhEx,
    loading,
    error,
    refetch
  } = useQuery(GET_WH_EXISTENCE, {
    variables: queryVariables
  })

  const { data: getWhName } = useQuery(GET_WH)

  const whList: any[] = useMemo(() => {
    return getWhEx?.getWhExistence?.items ?? []
  }, [getWhEx])

  const getWh = useMemo(() => {
    return getWhName?.getWarehouse?.items ?? []
  }, [getWhName])

  const handleOpenLinkEdit = () => {
    router.push(`/inventory/ip-inventory/edit/${id}`)
  }
  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const clearSearch = () => {
    setQueryVariables({
      fromDate: startOfDay,
      toDate: endOfDay,
      statusId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setSearchData({
      fromDate: startOfDay,
      toDate: endOfDay,
      statusId: '',
      whId: '',
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setKeySearch('')
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        status: searchData.statusId ? { eq: searchData.statusId } : undefined,
        whId: searchData.whId ? { eq: searchData.whId } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        deleteYn: { eq: false },
        or: [
          { id: { contains: searchData.keySearch } },
          { wh: { name: { contains: searchData.keySearch } } },
          {
            whPersion: { fristName: { contains: searchData.keySearch } } || {
              lastName: { contains: searchData.keySearch }
            }
          },
          { whId: { contains: searchData.keySearch } }
        ]
      }
    }))
  }, [searchData, paginationModel])

  const [IdDelete, setIdDelete] = useState() // Dữ liệu cập nhật
  const [openDelete, setOpenDelete] = useState(false)
  const [dialogData, setDialogData] = useState({
    id: ''
  })
  const handleClickOpen = (value: any) => {
    setIdDelete(value.id)
    setDialogData(value)
    setOpenDelete(true)
  }

  const handleClose = () => {
    setOpenDelete(false)
    setAnchorEl(null)
    setDialogData({
      id: ''
    })
  }

  const handleDelete = () => {
    setIdDelete(undefined)
    setOpenDelete(false)
    UpdateWhExistence({
      variables: {
        input: JSON.stringify({
          id: IdDelete,
          deleteYn: true
        })
      },
      onCompleted: async () => {
        toast.success('Bạn đã xoá phiếu kho thành công')
        await refetch()
      }
    })
  }

  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'id',
      headerName: 'Mã phiếu',
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
      minWidth: 160,
      field: 'whName',
      headerName: 'Kho nhập',
      valueGetter: params => {
        return `${params.row?.wh?.name} `
      }
    },
    {
      flex: 0.45,
      minWidth: 230,
      field: 'whPersion',
      headerName: 'Người nhập',

      renderCell: params => (
        <div>
          {params.row?.whPersion
            ? ` ${params.row?.whPersion?.fristName} ${params.row?.whPersion?.lastName}`
            : 'Không có'}
        </div>
      )
    },
    {
      flex: 0.45,
      minWidth: 230,
      field: 'note',
      headerName: 'Ghi chú',
      valueFormatter: params => (params.value ? params.value : 'Không có ghi chú ')
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'finalAmount',
      headerName: 'Thành tiền'
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => (
        <div>
          {params.row.status == '301' ? (
            <span className={styles.statusExaming}>Lưu nháp</span>
          ) : params.row?.status == '303' ? (
            <span className={styles.statusCancel}>ĐÃ HỦY</span>
          ) : (
            params.row.status == '302' && <span className={styles.statusComplete}>Hoàn thành</span>
          )}
        </div>
      )
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 200,
      headerName: 'Thao tác',
      // renderCell: params => (
      //   <div className='flex justify-center'>
      //     {/* {params.row.status == '301' && ( */}
      //     <IconButton title='Chỉnh sửa'>
      //       <Link href={handleOpenLinkEdit(params.row)} style={{ color: 'white', textDecoration: 'none' }}>
      //         <CreateIcon sx={{ color: '#6062E8' }} />
      //       </Link>
      //     </IconButton>
      //     {/* )} */}
      //     <IconButton
      //       title='Xóa'
      //       onClick={() => {
      //         handleClickOpen(params.row)
      //       }}
      //     >
      //       <DeleteIcon sx={{ color: 'red' }} />
      //     </IconButton>
      //   </div>
      // )
      renderCell: params => {
        return (
          <div className='flex justify-center'>
            <IconButton
              title='Xem chi tiết'
              onClick={() => {
                if (params.row?.id) {
                  setId(params.row?.id)
                  // setOpenDetailDialog(true)
                }
              }}
            >
              <RemoveRedEyeOutlinedIcon />
            </IconButton>
            <IconButton
              title='Thêm'
              aria-controls={openPopup ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openPopup ? 'true' : undefined}
              onClick={event => {
                handleClick(event)
                setId(params.row?.id)
                setStatusId(params.row?.status)
              }}
            >
              <Icon icon='icon-park-outline:more-two' />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openPopup}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem onClick={handleOpenLinkEdit}>
                <EditIcon sx={{ color: '#6062E8', mr: 2 }} /> Chỉnh sửa
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setPrintOpen(true)
                  handleClose()
                }}
              >
                <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In phiếu
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClickOpen(params.row)
                  handleClose()
                }}
              >
                <DeleteIcon sx={{ color: 'red', mr: 2 }} /> Xoá
              </MenuItem>
            </Menu>
          </div>
        )
      }
    }
  ]

  const status = [
    { id: '301', name: 'Lưu nháp' },
    { id: '302', name: 'Hoàn thành' },
    { id: '303 ', name: 'Huỷ phiếu' }
  ]
  console.log(id)

  return (
    <div>
      <Card>
        <Grid container spacing={2} sx={{ padding: 5 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>NHẬP HÀNG TỒN KHO ĐẦU VÀO </h2>
              <Box sx={{ display: 'flex', gap: '11px' }}>
                <Button
                  variant='contained'
                  sx={{ pl: 5, pr: 8, backgroundColor: '#0292B1', width: 245, height: 42 }}
                  href='/inventory/ip-inventory/add'
                  startIcon={<AddIcon />}
                >
                  Thêm mới
                </Button>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant='contained'
                    sx={{ backgroundColor: 'green', color: 'white', borderTopRightRadius: 0, width: 172, height: 42 }}
                    startIcon={<DownloadIcon />}
                  >
                    Xuất EXCEL
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={2} sm={2}>
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
            </Grid>
            <Grid item xs={12} sm={2}>
              <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
                <ReactDatePicker
                  selected={searchData.toDate}
                  dateFormat={'dd/MM/yyyy'}
                  customInput={
                    <TextField
                      fullWidth
                      label='Đến ngày '
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
            <Grid item xs={2}>
              <Autocomplete
                id='free-solo-2-demo'
                options={getWh}
                // options={patType}
                value={getWh.find((x: any) => x.id === searchData.whId) ?? ''}
                onChange={(e, value: any) => handleChangeSearch('whId', value?.id)}
                placeholder='Thông tin kho'
                renderInput={params => (
                  <TextField {...params} label='Thông tin kho' placeholder='Kho' InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                id='free-solo-2-demo'
                options={status}
                placeholder='Trạng thái phiếu nhập'
                getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Trạng thái phiếu nhập'
                    placeholder='Trạng thái'
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                onChange={(e, value: any) => {
                  if (value && value.id === searchData.statusId) {
                    handleChangeSearch('statusId', value.id)
                  }
                  handleChangeSearch('statusId', value?.id)
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <div style={{ display: 'flex' }}>
                <TextField
                  label='Nhập từ khoá tìm kiếm'
                  placeholder='Nhập từ khoá tìm kiếm'
                  InputLabelProps={{ shrink: true }}
                  value={keySearch}
                  onChange={e => {
                    setKeySearch(e.target.value)
                  }}
                  onBlur={e => handleChangeSearch('keySearch', e.target.value)}
                  // variant='outlined'
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
                  onClick={() => {
                    handleSearch()
                  }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  variant='contained'
                  style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
                  onClick={() => {
                    clearSearch()
                  }}
                >
                  <RefreshIcon />
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <>
            <DataGrid
              columns={COLUMN_DEF}
              rows={whList.map((item: any, index1: number) => ({
                ...item,
                index: index1 + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode='server'
              loading={loading}
              slots={{
                noRowsOverlay: () => (
                  <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
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
          </>
        </Card>
      </Grid>
      <PrintsComponent
        printFunctionId='pr10000006'
        printType='p_wh_existence_id'
        printTypeId={id}
        clinicId={dataUser.clinicId}
        parentClinicId={dataUser.parentClinicId}
        openPrint={printOpen}
        setOpenButtonDialog={setPrintOpen}
        titlePrint='Phiéu nhập tồn'
      />
      {/* dialog delete */}
      <Dialog open={openDelete} onClose={handleClose} aria-describedby='alert-dialog-slide-description'>
        <DialogTitle>{`Bạn có dám chắc muốn xóa mã phiếu ${dialogData.id} ?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            Nếu bạn xóa thì sẽ không thể sửa dữ liệu.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete}>Agree</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default IpInventory
