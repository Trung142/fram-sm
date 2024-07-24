import { useState, useMemo, useEffect, useTransition, ChangeEvent, useRef } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Divider,
  Popover,
  CardContent,
  TextField,
  Autocomplete,
  Paper,
  Tab,
  IconButton,
  Typography,
  List,
  ListItemButton,
  Stack
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import MUIDialog from 'src/@core/components/dialog'
import { useQuery } from '@apollo/client'
import { GET_SERVICE_GROUP, GET_SERVICE_QUERY, GET_SERVICE_TYPE } from './graphql/query'
import ActivityTag from './components/activity-tag'
import UpdateServiceGroup from './update-service-group'
import UpdateService from './update-service'
import ServiceGroup from './service-group'
import { ListPopOverWrapper } from './components/custom-mui-component'
import ImportServiceGroupExcel from './import-service-group-excel'
import { signal } from '@preact/signals'
import ConfirmDialog from '../dialog/confirm/confirm'

type RequestType = {
  serviceTypeId: string
  serviceGroupId: string
  keySearch: string
  status: boolean | null
  skip: number
  take: number
}
type IQueryVariables = {
  skip: number
  take: number
  input: {
    serviceTypeId?: { eq: string }
    serviceGroupId?: { eq: string }
    keySearch?: { eq: string }
    status?: { eq: boolean }
  }
}
type IOnChangeValue = {
  id?: string
  label: string
}
type IService = {
  id: string
  serviceCode: string
  serviceName: string
  serviceType: string
  serviceGroup: string
  price: number
  bhytPrice: number
  status: 'active' | 'suspended'
}

export const dialogType = signal<'add' | 'update'>('add')

const Service = () => {
  const openUpdateService = useState(false)
  const [updateData, setUpdateData] = useState<any>({})
  const open  = useState(false)
  const openconfirm = useState(false)
  const openAddSG = useState(false)
  const SGdata=useState()
  const openServiceGroup = useState(false)
  const openImportExcel=useState(false)
  const [openAddServiceGroup, setOpenAddServiceGroup] = useState(false)
  const [openImportServiceGroupExcel, setOpenImportServiceGroupExcel] = useState(false)
  const [openExportServiceGroupExcel, setOpenExportServiceGroupExcel] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const initialSearchData = {
    serviceTypeId: '',
    serviceGroupId: '',
    keySearch: '',
    status: null,
    skip: 0,
    take: paginationModel.pageSize
  }
  const [searchData, setSearchData] = useState<RequestType>(initialSearchData)
  const [keySearch, setKeySearch] = useState('')
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })
  const [tabValue, setTabValue] = useState('1')
  const { data: serviceTypeData } = useQuery(GET_SERVICE_TYPE)
  const { data: serviceGroupData } = useQuery(GET_SERVICE_GROUP)
  const {
    data: servicesData,
    loading,
    error,
    refetch
  } = useQuery(GET_SERVICE_QUERY, {
    variables: queryVariables
  })
  const serviceStatus = [
    {
      id: true,
      label: 'Hoạt động'
    },
    {
      id: false,
      label: 'Tạm dừng'
    }
  ]
  const serviceTypes = useMemo(() => serviceTypeData?.getServiceType.items ?? [], [serviceTypeData])

  const serviceGroups = useMemo(() => serviceGroupData?.getServiceGroup.items ?? [], [serviceGroupData])

  const services = useMemo(() => servicesData?.getService.items ?? [], [servicesData])
  const theme = useTheme()
  //  hover service group
  const [anchorElSerViceGroup, setAnchorElServiceGroup] = useState<HTMLButtonElement | null>(null)
  const popoverOpenButtonServiceGroup = useRef<HTMLButtonElement | null>(null)
  const handleOpenPopoverGroupService = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event.currentTaget?.style.zIndex="999999"
    popoverOpenButtonServiceGroup?.current && (popoverOpenButtonServiceGroup.current.style.zIndex = '99999')
    setAnchorElServiceGroup(event.currentTarget)
  }

  const handleCloseGroupServicePopover = () => {
    if (anchorElSerViceGroup) {
      popoverOpenButtonServiceGroup.current && (popoverOpenButtonServiceGroup.current.style.zIndex = '1')
    }
    setAnchorElServiceGroup(null)
  }
  //
  const [anchorElUtilities, setAnchorElUtilities] = useState<HTMLButtonElement | null>(null)
  const popoverOpenButtonUtilities = useRef<HTMLButtonElement | null>(null)
  const handleOpenPopoverUtilities = (event: React.MouseEvent<HTMLButtonElement>) => {
    popoverOpenButtonUtilities?.current && (popoverOpenButtonUtilities.current.style.zIndex = '99999')

    setAnchorElUtilities(event.currentTarget)
  }
  const handleCloseUtilitiesPopover = () => {
    if (anchorElUtilities) {
      popoverOpenButtonUtilities.current && (popoverOpenButtonUtilities.current.style.zIndex = '1')
    }
    setAnchorElUtilities(null)
  }
  const openServiceGroupOptions = Boolean(anchorElSerViceGroup)
  const openUtilitiesOptions = Boolean(anchorElUtilities)
  const id = open ? 'simple-popover' : undefined

  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: '#'
    },
    {
      flex: 0.25,
      minWidth: 240,
      field: 'id',
      headerName: 'Mã dịch vụ',
      maxWidth: 250
    },
    {
      flex: 0.25,
      minWidth: 400,
      field: 'name',
      headerName: 'Tên dịch vụ',
      maxWidth: 420
    },
    {
      flex: 0.15,
      minWidth: 260,
      field: 'serviceType.label',
      headerName: 'Loại dịch vụ',
      valueGetter: params => params?.row?.serviceType?.label
    },
    {
      flex: 0.15,
      minWidth: 170,
      field: 'serviceGroup.name',
      headerName: 'Nhóm dịch vụ',
      valueGetter: params => params?.row?.serviceGroup?.name
    },
    {
      flex: 0.45,
      minWidth: 100,
      field: 'price',
      headerName: 'Giá bán',
      maxWidth: 150
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'bhytPrice',
      headerName: 'Giá BHYT',
      maxWidth: 150,
      align: 'center',
      renderCell: params => <Typography align='center'>{!params.value ? 0 : params.value}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 170,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => {
        return (
          <ActivityTag type={params.value ? 'success' : 'denied'}>
            {params.value ? 'Hoạt động' : 'Tạm dừng'}
          </ActivityTag>
        )
      }
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 100,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              {
                handleOpenUpdate(params.row)
              }
            }}
          >
            <Icon icon='bx:edit-alt' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton
            title='Xoá'
            disabled={!params.row.status}
            onClick={() => {
              handleDisable(params.row)
            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]
  const handleOpenUpdate = (data: any) => {
    setUpdateData(data)
    openUpdateService[1](true)
    dialogType.value = 'update'
  }
  const handleOpenAdd = () => {
    setUpdateData({
      gender: 1,
      status: true
    })
    openUpdateService[1](true)
    dialogType.value = 'add'
  }

  const handleDisable = (data: any) => {
    setUpdateData({
      id: data.id,
      status: !data.status
    })
    openconfirm[1](true)
  }
  const handleChangeTag = (val: string) => {
    setTabValue(val)
    setSearchData({
      ...searchData,
      skip: 0,
      take: paginationModel.pageSize,

      status: val === '1' ? null : val === '2' ? true : false
    })
  }

  const handleOpenAddSG=()=>{
    openAddSG[1](true)
  }

  const handleToggleOpenServiceGroup = () => {
    openServiceGroup[1](true)
  }

  const handleToggleAddServiceGroup = () => {
    setOpenAddServiceGroup(prev => !prev)
  }
  const handleToggleImportServiceGroup = () => {
    setOpenImportServiceGroupExcel(prev => !prev)
  }

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleChangeSearchKey = (e: ChangeEvent<HTMLInputElement>) => {
    setKeySearch(e.target.value)
  }
  useEffect(() => {
    startTransition(() => {
      setQueryVariables((x: any) => ({
        ...x,
        skip: paginationModel.page * paginationModel.pageSize,
        take: paginationModel.pageSize,
        input: {
          serviceGroupId: searchData.serviceGroupId ? { eq: searchData.serviceGroupId } : undefined,
          serviceTypeId: searchData.serviceTypeId ? { eq: searchData.serviceTypeId } : undefined,
          status: searchData.status !== null && searchData.status !== undefined ? { eq: searchData.status } : undefined,
          or: [{ name: { contains: searchData.keySearch } }, { id: { contains: searchData.keySearch } }],
          createAt: { neq : null}    
        }
      }))
    })
  }, [searchData, paginationModel])

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }
  useEffect(()=>{
    refetch({ variables: queryVariables });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[queryVariables])

  const clearSearch = () => {
    setQueryVariables({
      patTypeId: null,
      patGroupId: null,
      keySearch: '',
      status: null,
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setKeySearch('')
  }
  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader
            title='Dịch vụ'
            action={
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button variant='contained' color='primary' sx={{ pl: 5, pr: 8 }} onClick={handleOpenAdd}>
                  <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                  Thêm mới
                </Button>
                <Box>
                  <Button
                    variant='contained'
                    color='success'
                    ref={popoverOpenButtonServiceGroup}
                    onMouseEnter={handleOpenPopoverGroupService}
                    // onClick={handleOpenPopoverGroupService}
                    sx={{ pl: 5, pr: 8 }}
                  >
                    <Icon icon='bx:chevron-down' fontSize={20} style={{ marginRight: 5 }} />
                    Nhóm dịch vụ
                  </Button>
                  <Popover
                    id={id}
                    open={openServiceGroupOptions}
                    anchorEl={anchorElSerViceGroup}
                    onClose={handleCloseGroupServicePopover}
                    PaperProps={{
                      style: {
                        width: popoverOpenButtonServiceGroup?.current
                          ? window.getComputedStyle(popoverOpenButtonServiceGroup?.current).width
                          : 'auto'
                      }
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <Paper elevation={12}>
                      <ListPopOverWrapper onMouseLeave={handleCloseGroupServicePopover} style={{ width: '100%' }}>
                        <ListItemButton
                          onClick={() => {
                            handleOpenAddSG()
                            handleCloseGroupServicePopover()
                          }}
                        >
                          <Stack direction='row' spacing={4}>
                            <Icon icon='bx:plus' />
                            <Typography>Thêm mới</Typography>
                          </Stack>
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            handleToggleOpenServiceGroup()
                            handleCloseGroupServicePopover()
                          }}
                        >
                          <Stack direction='row' spacing={4}>
                            <Icon icon='bx:list-ul' />
                            <Typography>Danh sách</Typography>
                          </Stack>
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            handleToggleImportServiceGroup()
                            handleCloseGroupServicePopover()
                          }}
                        >
                          <Stack direction='row' spacing={4}>
                            <Icon icon='bx:cloud-upload' />
                            <Typography>Nhập Excel</Typography>
                          </Stack>
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            handleToggleOpenServiceGroup()
                            handleCloseGroupServicePopover()
                          }}
                        >
                          <Stack direction='row' spacing={4}>
                            <Icon icon='bx:export' />
                            <Typography>Xuất Excel</Typography>
                          </Stack>
                        </ListItemButton>
                      </ListPopOverWrapper>
                    </Paper>
                  </Popover>
                </Box>
                <Box>
                  <Button
                    onMouseEnter={handleOpenPopoverUtilities}
                    ref={popoverOpenButtonUtilities}
                    onClick={handleOpenPopoverUtilities}
                    sx={{ p: 0 }}
                    variant='outlined'
                    color='secondary'
                  >
                    <Typography sx={{ py: 1, px: 8.25 }}>Tiện ích</Typography>
                    <Divider orientation='vertical' />
                    <Box
                      sx={{
                        py: 0.75,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Icon icon='bx:chevron-down' fontSize={20} style={{ marginRight: 5 }} />
                    </Box>
                  </Button>
                  <Popover
                    id={id}
                    open={openUtilitiesOptions}
                    anchorEl={anchorElUtilities}
                    onClose={handleCloseUtilitiesPopover}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    PaperProps={{
                      style: {
                        width: popoverOpenButtonUtilities?.current
                          ? window.getComputedStyle(popoverOpenButtonUtilities?.current).width
                          : 'auto'
                      }
                    }}
                  >
                    <Paper elevation={12}>
                      <ListPopOverWrapper onMouseLeave={handleCloseUtilitiesPopover} style={{ width: '100%' }}>
                        <ListItemButton
                          onClick={() => {
                            handleToggleImportServiceGroup()
                            handleCloseGroupServicePopover()
                          }}
                        >
                          <Stack direction='row' spacing={4}>
                            <Icon icon='bx:cloud-upload' />
                            <Typography>Nhập Excel</Typography>
                          </Stack>
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            handleCloseGroupServicePopover()
                          }}
                        >
                          <Stack direction='row' spacing={4}>
                            <Icon icon='bx:export' />
                            <Typography>Xuất Excel</Typography>
                          </Stack>
                        </ListItemButton>
                      </ListPopOverWrapper>
                    </Paper>
                  </Popover>
                </Box>
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={6} md={2}>
                <Autocomplete
                  freeSolo
                  disablePortal
                  fullWidth
                  options={serviceTypes}
                  value={serviceTypes.find((serviceType: any) => serviceType?.id === searchData.serviceTypeId) || null}
                  onChange={(e, value: IOnChangeValue) => {
                    handleChangeSearch('serviceTypeId', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Chọn loại dịch vụ' />}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Autocomplete
                  freeSolo
                  fullWidth
                  options={serviceGroups}
                  value={
                    serviceGroups.find((serviceGroup: any) => serviceGroup?.id === searchData.serviceGroupId) || null
                  }
                  onChange={(e, value: any) => {
                    handleChangeSearch('serviceGroupId', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Chọn nhóm dịch vụ' />}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Autocomplete
                  fullWidth
                  options={serviceStatus}
                  value={serviceStatus.find((serviceStatus: any) => serviceStatus?.id === searchData.status) || null}
                  onChange={(e, value: any) => {
                    handleChangeSearch('status', value?.id)
                  }}
                  renderInput={params => <TextField {...params} label='Chọn trạng thái' />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container gap={2}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      label='Từ khoá tìm kiếm'
                      autoComplete='off'
                      placeholder='Nhập từ khoá tìm kiếm'
                      value={keySearch}
                      onChange={handleChangeSearchKey}
                      onBlur={e => handleChangeSearch('keySearch', e.target.value)}
                    />
                  </Grid>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      handleSearch()
                    }}
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                  <Button
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <TabContext value={tabValue}>
              <TabList
                onChange={(e, val) => handleChangeTag(val)}
                color='red'
                centered={false}
                variant='scrollable'
                sx={{ width: '100%' }}
              >
                <Tab value='1' label='Danh sách' />
              </TabList>
            </TabContext>
            <DataGrid
              columns={COLUMN_DEF}
              paginationMode='server'
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={servicesData?.getService.totalCount ?? 0}
              loading={loading || isPending}
              rows={services.map((item: any, index: any) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              slots={{
                noRowsOverlay: () => (
                  <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                )
              }}
              style={{ minHeight: 500, height: '60vh' }}
            />
          </CardContent>
        </Card>
      </Grid>
      <MUIDialog
        maxWidth='sm'
        open={openImportExcel}
        title='Nhập danh mục nhóm dịch vụ từ file excel'
      >
        <ImportServiceGroupExcel open={openImportExcel} />
      </MUIDialog>
      <MUIDialog
        maxWidth='xl'
        open={openUpdateService}
        title={dialogType.value === 'add' ? 'Thêm mới dịch vụ' : 'Cập nhật thông tin dịch vụ'}
      >
        <UpdateService open={openUpdateService} data={updateData} onSubmit={handleSearch} />
      </MUIDialog>
      <MUIDialog open={openconfirm} title={'Cảnh Báo'}>
        <ConfirmDialog open={openconfirm} data={updateData} onSubmit={handleSearch} />
      </MUIDialog>
      <MUIDialog maxWidth='sm' open={openAddSG} title='Thêm mới nhóm dịch vụ'>
          <UpdateServiceGroup open={openAddSG} onSubmit={handleSearch} dialogType='add' data={SGdata}/>
      </MUIDialog>
      <MUIDialog maxWidth='xl' open={openServiceGroup} title='Danh sách nhóm dịch vụ'>
          <ServiceGroup open={openServiceGroup} onSubmit={handleSearch}/>
      </MUIDialog>
    </Grid>
  )
}

export default Service
