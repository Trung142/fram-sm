import {
  Grid,
  Card,
  Typography,
  Menu,
  TextField,
  CardHeader,
  CardContent,
  InputAdornment,
  IconButton,
  Tab,
  Box,
  Button,
  Stack,
  MenuItem
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import RefreshIcon from '@mui/icons-material/Refresh'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import { useMemo, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CreateIcon from '@mui/icons-material/Create'
import { useRouter } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { GET_USER_ROLE, GET_ROLE, GET_USER, GET_CLINIC } from './graphql/query'

const colorActive = {
  backgroundColor: '#025061'
}
const Emploryee = () => {
  //hook
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const handleSetTab = (val: string) => {
    setTab(val)
  }

  //data gridcoder
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'index',
      headerName: '#',
      minWidth: 10,
      renderCell: (params: { row: { index?: any } }) => {
        const { index } = params.row
        return <div>{index}</div>
      }
    },
    {
      flex: 0.25,
      field: 'id',
      headerName: 'MÃ NHÂN VIÊN',
      minWidth: 200,
      renderCell: (params: { row: { id?: string } }) => {
        const { id } = params.row
        return <div>{id}</div>
      }
    },
    {
      flex: 0.25,
      field: 'User',
      headerName: 'TÊN NHÂN VIÊN',
      minWidth: 200,
      renderCell: (params: { row: { fristName?: string; lastName?: string } }) => {
        const item = params.row
        return (
          <div>
            {item?.fristName} {item?.lastName}
          </div>
        )
      }
    },
    {
      flex: 0.25,
      field: 'Role',
      headerName: 'TÀI KHOẢN',
      minWidth: 200,
      renderCell: (params: { row: { id?: string } }) => {
        const item = UserRole.find(item => item.userId === params.row.id)
        return <div>{item?.role?.name}</div>
      }
    },
    {
      flex: 0.25,
      field: 'phone',
      headerName: 'SỐ ĐIỆN THOẠI',
      minWidth: 200,
      renderCell: (params: { row: { phone?: string } }) => {
        const item = params.row
        return <div>{item?.phone}</div>
      }
    },
    {
      flex: 0.25,
      field: 'userTypeId',
      headerName: 'LOẠI',
      minWidth: 200,
      renderCell: (params: { row: { userTypeId?: string } }) => {
        const { userTypeId } = params.row
        return <div>{userTypeId}</div>
      }
    },
    {
      flex: 0.25,
      field: 'Clinic',
      headerName: 'CHI NHÁNH',
      minWidth: 200,
      renderCell: (params: {
        row: {
          clinicId?: string
        }
      }) => {
        const item = ClinicUser.find(item => item.id === params.row.clinicId)
        return <div>{item?.city?.name}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: params => {
        if (params.row.status) {
          return (
            <span style={{ color: 'green', border: '1px solid green', padding: '5px 18px', borderRadius: '3px' }}>
              Hoạt Động
            </span>
          )
        } else {
          return (
            <span style={{ color: 'red', border: '1px solid red', padding: '5px 18px', borderRadius: '3px' }}>
              Tạm Dừng
            </span>
          )
        }
      }
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 200,
      headerName: 'Thao tác',
      renderCell: (params: any) => (
        <div className='flex justify-center'>
          <IconButton onClick={() => handleRowClick(params)}>
            <CreateIcon sx={{ color: '#6062E8' }} />
          </IconButton>
          <IconButton
            title='Xoá'
            onClick={() => {
              handleDelete(params.row.id)
            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5, color: 'red' }} type='solid' />
          </IconButton>
        </div>
      )
    }
  ]

  //row
  const getStatusLabel = (statusCode: any) => {
    const status = 'statusMapping(statusCode, styles)'
    return status ? '<span className={status.className}>{status.label}</span>' : <></>
  }

  const handleRowClick = (params: any) => {
    console.log(params)
  }
  const handleDelete = (id: any) => {
    console.log(id)
  }
  //data User

  const { data: userData, loading, error } = useQuery(GET_USER, { fetchPolicy: 'network-only' })
  const ResUserData: any[] = useMemo(() => {
    return userData?.getUser.items ?? []
  }, [userData])
  const { data: roleData } = useQuery(GET_USER_ROLE)
  const UserRole: any[] = useMemo(() => {
    return roleData?.getUserRole.items ?? []
  }, [roleData])

  //data Clinic
  const { data: ClinicData } = useQuery(GET_CLINIC)
  const ClinicUser: any[] = useMemo(() => {
    return ClinicData?.getClinic.items ?? []
  }, [ClinicData])
  //data Role
  const { data: dataRole } = useQuery(GET_ROLE)

  const RoleData: any[] = useMemo(() => {
    return dataRole?.getRole.items ?? []
  }, [dataRole])
  //add user
  const handleAdd = () => {
    router.push('/system/employee/add')
  }
  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader
              title='Nhân viên'
              action={
                <Box sx={{ display: 'flex' }}>
                  <Box>
                    <Button color='primary' variant='contained' onClick={handleAdd}>
                      <Icon icon='bx:bx-plus' fontSize={20} />
                      Thêm Mới
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      variant='outlined'
                      sx={{ backgroundColor: 'white', borderTopRightRadius: 0, width: 172, height: 42, ml: 2 }}
                      endIcon={<Icon icon='bx:bx-chevron-down' fontSize={20} style={{ marginRight: 5 }} />}
                    >
                      Tiện ích
                    </Button>
                    <MenuItem>
                      <Icon icon='bx:bx-cloud-download' fontSize={20} style={{ marginRight: 5 }} />
                      Nhập Excel
                    </MenuItem>
                  </Box>
                </Box>
              }
            />
            <CardContent>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={5}>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <TextField
                      label='Nhập từ khoá tìm kiếm'
                      placeholder='Nhập từ khoá tìm kiếm'
                      InputLabelProps={{ shrink: true }}
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
                    >
                      <Icon fontSize={20} icon='bx:bx-search' color='white' />
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
              {/* =============================== MAIN DATA ======================================= */}
              {/* =============================== MAIN DATA ======================================= */}
              {/* =============================== MAIN DATA ======================================= */}
              <Grid container sx={{ mt: 6 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <TabContext value={tab}>
                  <TabList
                    sx={{
                      backgroundColor: '#0292B1',
                      width: '100%'
                    }}
                    value={tab}
                    onChange={(e, val) => handleSetTab(val)}
                    aria-label='basic tabs example'
                  >
                    <Tab
                      style={tab === 'all' ? colorActive : {}}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                            DANH SÁCH
                          </Typography>
                          <Typography
                            sx={{
                              color: '#fff',
                              ml: 4,
                              backgroundColor: 'red',
                              borderRadius: '50%',
                              width: '1.5rem',
                              height: '1.5rem'
                            }}
                          >
                            {ResUserData.filter(item => item).length}
                          </Typography>
                        </Box>
                      }
                      value={'all'}
                    />
                    <Tab
                      style={tab === 'waiting_examines' ? colorActive : {}}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            style={tab === 'waiting_examines' ? colorActive : {}}
                            sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}
                          >
                            HOẠT ĐỘNG
                          </Typography>
                          <Typography
                            sx={{
                              color: '#fff',
                              ml: 4,
                              backgroundColor: 'red',
                              borderRadius: '50%',
                              width: '1.5rem',
                              height: '1.5rem'
                            }}
                          >
                            {ResUserData.filter(item => item.status).length}
                          </Typography>
                        </Box>
                      }
                      value={'waiting_examines'}
                    />
                    <Tab
                      style={tab === 'waiting_action' ? colorActive : {}}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                            TẠM DỪNG
                          </Typography>
                          <Typography
                            sx={{
                              color: '#fff',
                              ml: 4,
                              backgroundColor: 'red',
                              borderRadius: '50%',
                              width: '1.5rem',
                              height: '1.5rem'
                            }}
                          >
                            {ResUserData.filter(item => !item.status).length}
                          </Typography>
                        </Box>
                      }
                      value={'waiting_action'}
                    />
                  </TabList>
                  <TabPanel value='all' sx={{ width: '100%', p: 0 }}>
                    <Grid container>
                      <Grid item xs={12}>
                        <DataGrid
                          columns={columns}
                          rows={ResUserData.map((item, index) => ({ ...item, index: index + 1 }))}
                          style={{ minHeight: 700 }}
                          loading={loading}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value='waiting_examines' sx={{ width: '100%', p: 0 }}>
                    <Grid container>
                      <Grid item xs={12}>
                        <DataGrid
                          columns={columns}
                          rows={ResUserData.filter(item => item.status).map((item, index) => ({
                            ...item,
                            index: index + 1
                          }))}
                          loading={loading}
                          style={{ minHeight: 700 }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value='waiting_action' sx={{ width: '100%', p: 0 }}>
                    <Grid container>
                      <Grid item xs={12}>
                        <DataGrid
                          columns={columns}
                          rows={ResUserData.filter(item => !item.status).map((item, index) => ({
                            ...item,
                            patInfo: '',
                            index: index + 1
                          }))}
                          loading={loading}
                          style={{ minHeight: 700 }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </TabContext>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Emploryee
