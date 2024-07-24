import { Grid2Props, Grid, TextField, Typography, Paper, IconButton, Accordion, AccordionSummary, AccordionDetails, Collapse } from "@mui/material";
import { styled } from '@mui/material/styles'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import ReactDatePicker from "react-datepicker";
import Divider from '@mui/material/Divider';

import { useState } from "react";
import { resExamInput } from "./index";

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const MedicineHistory = () => {
  // Tham số tìm kiếm
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });


  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT',
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'id',
      headerName: 'Tên thuốc',
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'patName',
      headerName: 'Liều dùng',
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'totalPrice',
      headerName: 'ĐVT'
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'stt',
      headerName: 'Số lượng'
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'bhyt',
      headerName: 'Mua'
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'price',
      headerName: 'Đơn giá'
    },
  ]

  const handleSearch = () => {
    console.log('handleSearch');
  }

  const handleChangeSearch = (name: string, value: any) => {
    setSearchData({
      ...searchData,
      [name]: value,
    });
  }

  return <>

    <Grid container spacing={3}>

      <Grid item xs={3}>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <ReactDatePicker
                selected={searchData.fromDate}
                dateFormat={'dd/MM/yyyy'}
                customInput={<TextField label='Từ ngày' />}
                onChange={(date: Date) => handleChangeSearch('fromDate', date)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={6}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <ReactDatePicker
                selected={searchData.toDate}
                dateFormat={'dd/MM/yyyy'}
                customInput={<TextField label='Đến ngày' />}
                onChange={(date: Date) => handleChangeSearch('toDate', date)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12}>
          <DataGrid
              rows={[
                { id: 1, date: '27/12/2023 15:00' },
                { id: 2, date: '23/12/2023 15:00' },
              ]}
              columns={[
                { field: 'date', headerName: 'STT', flex: 0.1, minWidth: 80 },
              ]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              hideFooterSelectedRowCount
              style={{ minHeight: 200, height: '20vh' }}
              columnHeaderHeight={0}
            />

          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={9}>

        <Paper>
          <Grid container spacing={3} padding={5}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Typography variant="h4">ĐƠN THUỐC</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="#0292B1">A. THÔNG TIN KHÁCH HÀNG</Typography>
            </Grid>
            <Grid item xs={12} spacing={2}>
              <Grid container paddingLeft={10}>
                <Grid item xs={4}>
                  Họ và tên: <b>HỒ TRỌNG HIẾU</b>
                </Grid>

                <Grid item xs={4}>
                  Tuổi: 25 tuổi
                </Grid>
                <Grid item xs={4}>
                  Giới tính: Nam
                </Grid>
                <Grid item xs={4}>Họ tên người giám hộ: <b>HỒ VĂN HIỀN</b></Grid>
                <Grid item xs={4}>Điện thoại: 123456789</Grid>
                <Grid item xs={4}>Số thẻ BHYT: GD402957124181</Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="#0292B1">B. CHỈ ĐỊNH THUỐC</Typography>
            </Grid>
            <Grid item xs={4}>Tên bác sĩ: BS.CK1. Vũ Anh Kiệt</Grid>
            <Grid item xs={4}>Phòng khám: Phòng khám nội</Grid>
            <Grid item xs={4}></Grid>

            <Grid item xs={12}>
              <DataGrid
                rows={[]}
                columns={COLUMN_DEF}
                hideFooterPagination
                style={{ minHeight: 200, height: '40dvh' }}
              />
            </Grid>

            <Grid item xs={4}>Chuẩn đoán:  [J06.9] Nhiễm trùng</Grid>
            <Grid item xs={4}>Lời dặn: Tái khám</Grid>
            <Grid item xs={4}>Ngày hẹn khám: 01/01/2024 08:000</Grid>

          </Grid>
        </Paper>

      </Grid>
    </Grid>
  </>;
}

export default MedicineHistory;
