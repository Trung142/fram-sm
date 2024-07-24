import { Checkbox, Box, Button, Grid, IconButton, Menu, Stack, TextField, Typography, Card } from '@mui/material'
import React, { useMemo, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import styles from './styles.module.scss'
import FilterDropdown from 'src/@core/components/filter-dropdown'
import { dropdownOptions } from 'src/@core/components/filter-dropdown/constant'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  keySearch: string
  skip: number
  take: number
}
const ROW_DEF = [
  {
    id: 1,
    maHoaDon: {
      value: 'PK20231101000001',
      date: ''
    },
    khachHang: {
      name: 'Nguyễn Thị Huê',
      value: '(PK: PK24011109)'
    },
    checkBox: '',
    thanhTien: '142,583.70',
    CK: '5,000',
    thanhToan: '137,583.70',
    noted: '',
    statusDon: '50',
    statusXuatHoaDon: '00'
  },
  {
    id: 2,
    maHoaDon: {
      value: 'PK20231101000001',
      date: ''
    },
    khachHang: {
      name: 'Nguyễn Thị Huê',
      value: '(PK: PK24011109)'
    },
    checkBox: '',
    thanhTien: '142,583.70',
    CK: '5,000',
    thanhToan: '137,583.70',
    noted: '',
    statusDon: '50',
    statusXuatHoaDon: '00'
  },
  {
    id: 3,
    maHoaDon: {
      value: 'PK20231101000001',
      date: ''
    },
    khachHang: {
      name: 'Nguyễn Thị Huê',
      value: '(PK: PK24011109)'
    },
    checkBox: '',
    thanhTien: '142,583.70',
    CK: '5,000',
    thanhToan: '137,583.70',
    noted: '',
    statusDon: '50',
    statusXuatHoaDon: '00'
  },
  {
    id: 4,
    maHoaDon: {
      value: 'PK20231101000001',
      date: ''
    },
    khachHang: {
      name: 'Nguyễn Thị Huê',
      value: '(PK: PK24011109)'
    },
    checkBox: '',
    thanhTien: '142,583.70',
    CK: '5,000',
    thanhToan: '137,583.70',
    noted: '',
    statusDon: '40',
    statusXuatHoaDon: '10'
  }
]
const DonHang = () => {
  const router = useRouter()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openFilter = Boolean(anchorEl)
  const handleCloseFilter = () => {
    setAnchorEl(null)
  }
  // ======================TABLIST========================
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'id',
      headerName: 'STT'
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'maHoaDon',
      headerName: 'Mã Hóa Đơn',
      renderCell: (params: any) => (
        <div className={styles.id}>
          <div>
            <span>{params.value.value}</span>
          </div>
          <div>
            <span>{moment(params.row.createdAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 140,
      field: 'khachHang',
      headerName: 'Khách hàng',
      renderCell: (param: any) => {
        return (
          <Stack spacing={2}>
            <div>{param.value.name}</div>
            <div>{`${param.value.value}`}</div>
          </Stack>
        )
      }
    },
    {
      flex: 0.05,
      minWidth: 100,
      field: 'checkBox',
      headerName: `${(<Checkbox {...label} />)}`,
      renderCell: (param: any) => {
        return <Checkbox {...label} />
      }
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'thanhTien',
      headerName: 'Thành Tiền'
    },
    {
      flex: 0.1,
      minWidth: 160,
      field: 'CK',
      headerName: 'Chiết khấu'
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'thanhToan',
      headerName: 'Thanh toán'
    },
    {
      flex: 0.25,
      minWidth: 140,
      field: 'noted',
      headerName: 'Ghi chú'
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'statusDon',
      headerName: 'Trạng thái Đơn',
      renderCell: params => {
        if (params.value === '00') {
          return <span className={styles.statusWaiting}>Chờ khám</span>
        } else if (params.value === '10') {
          return <span className={styles.statusExaming}>Đang khám</span>
        } else if (params.value === '20') {
          return <span className={styles.statusPending}>Chờ thực hiện</span>
        } else if (params.value === '30') {
          return <span className={styles.statusDone}>Đã thực hiện</span>
        } else if (params.value === '40') {
          return <span className={styles.statusComplete}>Hoàn thành</span>
        } else if (params.value === '50') {
          return <span className={styles.statusCancel}>Hủy khám</span>
        } else {
          return ''
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'statusXuatHoaDon',
      headerName: 'Trạng thái xuất HĐ',
      renderCell: params => {
        if (params.value === '00') {
          return <span className={styles.statusComplete}>Đã xuất HĐ</span>
        } else if (params.value === '10') {
          return <span className={styles.statusWaiting}>Chưa xuất HĐ</span>
        } else {
          return ''
        }
      }
    },
    {
      flex: 0.05,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton>
            <RemoveRedEyeIcon />
          </IconButton>
          <IconButton title='Xoá'>
            <Icon icon='bx:dots-horizontal-rounded' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]
  return (
    <Grid container>
      <Card sx={{ width: '100%', padding: 5 }}>
        <Grid item xs={12} mb={8}>
          <Typography
            variant='h4'
            pl={'48px'}
            sx={{ fontWeight: 500, lineHeight: '40px', color: '#000000', letterSpacing: '0.25px' }}
          >
            ĐƠN HÀNG
          </Typography>
        </Grid>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <TextField
                label='Từ ngày'
                placeholder='dd/mm/yyyy'
                InputLabelProps={{ shrink: true }}
                fullWidth
                type='date'
              />
              <Menu anchorEl={anchorEl} open={openFilter} onClose={handleCloseFilter}>
                <FilterDropdown options={dropdownOptions} onClick={handleCloseFilter} />
              </Menu>
            </Box>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label='Đến ngày'
              InputLabelProps={{ shrink: true }}
              placeholder='dd/mm/yyyy'
              fullWidth
              type='date'
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label='Trạng thái phiếu'
              select
              InputLabelProps={{ shrink: true }}
              placeholder='Trạng thái phiếu cận lâm sàn'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{ display: 'flex' }}>
              <TextField
                label='Từ khoá tìm kiếm'
                fullWidth
                placeholder='Nhập từ khoá tìm kiếm'
                InputLabelProps={{ shrink: true }}
                variant='outlined'
                sx={{
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
      </Card>
      <Card sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <DataGrid
            columns={COLUMN_DEF}
            rows={ROW_DEF.map((item, index) => ({
              ...item,
              index: index + 1 + paginationModel.page * paginationModel.pageSize
            }))}
            // rowCount={queryData?.getDiagnostic?.totalCount ?? 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode='server'
            sx={{
              '& .MuiDataGrid-root .MuiDataGrid-headerColumn': {
                backgroundColor: 'lightblue' // Replace with your desired color
              }
            }}
            // loading={loading}
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
        </Grid>
      </Card>
    </Grid>
  )
}

export default DonHang
