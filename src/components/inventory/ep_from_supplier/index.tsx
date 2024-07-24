import React, { useState, useEffect, useMemo } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  
  Autocomplete,
  Card,
  Menu,
  MenuItem
} from '@mui/material'
import { Icon } from '@iconify/react'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'
import { formatVND } from 'src/utils/formatMoney'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PrintIcon from '@mui/icons-material/Print'
import { useMutation, useQuery } from '@apollo/client'
import { signal } from '@preact/signals'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { GET_WH_EP_RETURN_SUPPLIER, GET_WH } from './graphql/query'
import moment from 'moment'
import { ReturnSupInput } from './graphql/variables'
import { UPDATE_RETURN_SUPPLIER } from './graphql/mutation'
import { left } from '@popperjs/core'
import DetailWhReturnDialog from './DetailWhReturnSup';

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  statusId: string | null
  whId: string | null
  keySearch: string
  skip: number
  take: number
}

export const dialogType = signal<'add' | 'update'>('add')
const EpFromSupplier = () => {
  const [UpdateWhReturnSup] = useMutation(UPDATE_RETURN_SUPPLIER)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [keySearch, setKeySearch] = useState('')
  
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
    data: getReturnSup,
    loading,
    error,
    refetch
  } = useQuery(GET_WH_EP_RETURN_SUPPLIER, {
    variables: queryVariables
  })

  const { data: getWhName } = useQuery(GET_WH)

  const whList: any[] = useMemo(() => {
    return getReturnSup?.getWhReturnSup?.items ?? []
  }, [getReturnSup])
  const getWh = useMemo(() => {
    return getWhName?.getWarehouse?.items ?? []
  }, [getWhName])

  const handleOpenLinkEdit = (value: any) => {
    if (value.status === 30) {
      return `/inventory/ep-from-supplier/not-edit/${value.id}`
    } else {
      return `/inventory/ep-from-supplier/edit/${value.id}`
    }
  }

  
  const [openDetailWhReturnDialog, setOpenDetailWhReturnDialog] = useState<boolean>(false)
  const [id, setId] = useState<string>()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChoiceDelete = () => {
    toast(t => (
      <div>
        <Typography fontWeight={500} fontSize={'1.25rem'}>
          Bạn chắc chắn muốn hủy phiếu {id}?
        </Typography>
        <br />
        <span style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button
            variant='contained'
            color='error'
            sx={{ paddingX: 5 }}
            startIcon={<Icon icon='bx:trash' />}
            onClick={() => {
              handleDelete(id)
              toast.dismiss(t.id)
            }}
          >
            hủy
          </Button>
          <Button
            variant='contained'
            color='info'
            sx={{ paddingX: 5 }}
            startIcon={<Icon icon='lets-icons:back' width='24' height='24' />}
            onClick={() => toast.dismiss(t.id)}
          >
            quay về
          </Button>
        </span>
      </div>
    ))
  }

  const [statusId, setStatusId] = useState<string>()
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
  const handleClickOpen = async (value: any) => {
    await setIdDelete(value.id)
    await setDialogData(value)
    await setOpenDelete(true)
  }

  // const handleClose = () => {
  //   setOpenDelete(false)
  //   setDialogData({
  //     id: ''
  //   })
  // }

  const handleDelete = (id: string | undefined) => {
    UpdateWhReturnSup({
      variables: {
        input: JSON.stringify({
          id: id,
          status: '303'
        })
      },
      onCompleted: async () => {
        await refetch()
        toast.success(`Hủy phiếu ${id} thành công`)
      }
    })
  }

  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index1',
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
      flex: 0.45,
      minWidth: 230,
      field: 'supplier',
      headerName: 'Nhà cung cấp',

      renderCell: params => (
        <div>
          {params.row.supplier ? ` ${params.row.supplier.name}` : 'Không có'}
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 160,
      field: 'whName', //truong nay trung voi contain name
      headerName: 'Kho xuất',
      valueGetter: params => {
        return `${params.row?.wh?.name} `
      }
    },
    
    
   
    {
      flex: 0.45,
      minWidth: 200,
      field: 'note',
      headerName: 'Ghi chú',
      valueFormatter: params => (params.value ? params.value : 'Không có ghi chú ')
    },


    {
      flex: 0.15,
      minWidth: 120,
      field: 'finalAmount',
      headerName: 'Thành tiền',
      valueGetter: params => {
        return `${formatVND(params.row.finalAmount)} `
      }
      
    },
    
    {
      flex: 0.15,
      minWidth: 120,
      field: 'totalRefund',
      headerName: 'Thanh toán',
      valueGetter: params => {
        return `${formatVND(params.row.totalRefund)} `
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      field: 'debt',
      headerName: 'Dư nợ',
      // renderCell: params => (
      //   <div>
      //     {params.row.items ? {params.row.items.finalAmount - params.row.items.totalRefund} : 'Không có'}
      //   </div>
      // )

      valueGetter: params => {
        return `${formatVND(params.row.finalAmount - params.row.totalRefund)} `
        
      }
      
      //valueFormatter: params => (params.row.items ?  params.row.items.finalAmount - params.row.items.totalRefund : 'Không có ghi chú ')
    },
    

 

    {
      flex: 0.15,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => (
        <div>
          {params.row.status == '301' ? (
            <Button
              variant='outlined'
              color='primary'
              style={{ width: '102px', fontSize: '13px', borderRadius: '10px' }}
            >
              Lưu nháp
            </Button>
          ) : params.row.status == '303' ? (
            <Button variant='outlined' color='error' style={{ width: '102px', fontSize: '13px', borderRadius: '10px' }}>
              ĐÃ HỦY
            </Button>
          ) : (
            params.row.status == '302' && (
              <Button
                style={{
                  width: '102px',
                  fontSize: '13px',
                  backgroundColor: 'rgba(38, 249, 160, 0.1215686275)',
                  color: '#67C932',
                  borderRadius: '10p',
                  border: '1px solid #67C932'
                }}
                variant='contained'
                color='success'
              >
                Hoàn thành
              </Button>
            )
          )}
        </div>
      )
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 200,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          {/* {params.row.status == '301' && ( */}
          <IconButton 
            title='Xem chi tiết'
            onClick={() => {
              if (params.row?.id) {
                setId(params.row?.id)
                setOpenDetailWhReturnDialog(true)
              }
            }}>
            {/* <Link href={handleOpenLinkEdit(params.row)} style={{ color: 'white', textDecoration: 'none' }}> */}
              <RemoveRedEyeOutlinedIcon  />
            {/* </Link> */}
          </IconButton>
          {/* )} */}
          {/* <IconButton
            title='Xóa'
            onClick={() => {
              handleClickOpen(params.row)
            }}
          >
            <DeleteIcon sx={{ color: 'red' }} />
          </IconButton> */}
                      <IconButton
              title='Thêm'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
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
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem onClick={handleClose}>
                <PrintIcon sx={{ color: '#BF8000', mr: 2 }} /> In phiếu
              </MenuItem>
              <MenuItem disabled={statusId === '302'} onClick={handleChoiceDelete}>
                <Icon icon='bx:trash' width='24' height='24' color='#FF3E1D' style={{ marginRight: 8 }} /> Hủy phiếu
              </MenuItem>
            </Menu>

        </div>
      )
    }
  ]

  const status = [
    { id: '301', name: 'Lưu nháp' },
    { id: '106', name: 'Hoàn thành' },
    { id: '303', name: 'Huỷ phiếu' }
  ]

  return (
    <div>
       <DetailWhReturnDialog open={[openDetailWhReturnDialog, setOpenDetailWhReturnDialog]} id={id} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Xuất trả nhà cung cấp</h2>
            <Box sx={{ display: 'flex', gap: '11px' }}>
              <Link href={'/inventory/ep-from-supplier/add'}>
              <Button
                variant='contained'
                sx={{ pl: 5, pr: 8, backgroundColor: '#0292B1'}}
                // onClick={() => handleOpenAdd()}/inventory/ep-from-supplier/add
                startIcon={<AddIcon />}
              >
                  Thêm mới
              </Button>
              </Link>
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: 'green', color: 'white', pl: 5, pr: 8 }}
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

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <>
            <DataGrid
              columns={COLUMN_DEF}
              rows={whList.map((item: any, index1: any) => ({ ...item, index1 }))}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode='server'
              loading={loading}
              slots={{
                noRowsOverlay: () => (
                  <div 
                      style={{ marginTop: 20, 
                      width: '100%', 
                      textAlign: 'center' 
                      }}>
                        Không có dữ liệu
                  </div>
                )
              }}
              style={{ minHeight: 500, height: '60vh' }}
            />
          </>
        </Card>
      </Grid>
      {/* dialog delete */}
      {/* <Dialog open={openDelete} onClose={handleClose} aria-describedby='alert-dialog-slide-description'>
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
      </Dialog> */}
    </div>
  )
}
export default EpFromSupplier
