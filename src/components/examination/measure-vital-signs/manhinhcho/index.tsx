import React from 'react'
import { Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import WaitingScreenLayout from 'src/layouts/WaitingScreenLayout'

const examplePatientList = [
  {
    id: 1,
    stt: 1,
    hoten: 'Nguyễn Văn A',
    ngaysinh: '01/01/1990',
    bacsi: 'BS. Nguyễn Văn B',
    phong: 'Phòng khám 1',
    trangthai: 'Chờ khám'
  },
  {
    id: 2,
    stt: 2,
    hoten: 'Nguyễn Văn A',
    ngaysinh: '01/01/1990',
    bacsi: 'BS. Nguyễn Văn B',
    phong: 'Phòng khám 1',
    trangthai: 'Chờ thực hiện'
  },
  {
    id: 3,
    stt: 3,
    hoten: 'Nguyễn Văn A',
    ngaysinh: '01/01/1990',
    bacsi: 'BS. Nguyễn Văn B',
    phong: 'Phòng khám 1',
    trangthai: 'Đang khám'
  }
]

const ManHinhCho = () => {
  const getgetColorForStatus = (status: string) => {
    switch (status) {
      case 'Chờ khám':
        return '#8082FF'
      case 'Đang khám':
        return '#0292B1'
      case 'Chờ thực hiện':
        return '#FFAB00'
      default:
        return 'white'
    }
  }

  return (
    <Grid container spacing={2} style={{ width: '100%' }}>
      <Grid item xs={12}>
        <h1 style={{ textAlign: 'center', color: 'white', textTransform: 'uppercase' }}>
          Danh sách bệnh nhân đang chờ khám
        </h1>
      </Grid>
      <Grid item xs={12} style={{ width: '100%' }}>
        <DataGrid
          style={{ color: 'white', fontWeight: 'bold' }}
          rows={examplePatientList}
          columns={[
            { field: 'stt', headerName: 'STT', flex: 1 },
            { field: 'hoten', headerName: 'Họ tên', flex: 1 },
            { field: 'ngaysinh', headerName: 'Ngày sinh', flex: 1 },
            { field: 'bacsi', headerName: 'Bác sĩ', flex: 1 },
            { field: 'phong', headerName: 'Phòng khám', flex: 1 },
            {
              field: 'trangthai',
              headerName: 'Trạng thái',
              flex: 1,
              renderCell: params => (
                <div
                  style={{
                    color: getgetColorForStatus(params.value as string)
                  }}
                >
                  {params.value}
                </div>
              )
            }
          ]}
          autoHeight
          disableColumnMenu
          hideFooter
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'white',
              color: 'black'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '1.5rem'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '1.3rem'
            }
          }}
        />
      </Grid>
    </Grid>
  )
}

ManHinhCho.getLayout = (page: any) => {
  const layoutStyle = {
    backgroundColor: '#171F30',
    height: '100vh',
    width: '100%'
  }

  return <WaitingScreenLayout style={layoutStyle}>{page}</WaitingScreenLayout>
}

export default ManHinhCho
