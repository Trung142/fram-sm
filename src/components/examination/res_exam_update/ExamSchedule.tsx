import { Grid2Props, Grid, TextField, Typography, Paper, IconButton, Divider, Collapse } from "@mui/material";
import { styled } from '@mui/material/styles'

import { resExamInput } from "./index";
import { Box, padding } from "@mui/system";
import MuiSelect from "src/@core/components/mui/select";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import ReactDatePicker from "react-datepicker";
import { useState } from "react";


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from "@mui/x-data-grid";

const ExamSchedule = () => {
  // Tham số tìm kiếm
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });

  const [clickedRow, setClickedRow] = useState<any>(-1);
  const gridOption = [
    { id: 1, label: 'Thông tin khám' },
    { id: 2, label: 'Khám nội' },
    { id: 3, label: 'Ghi điện tim cấp cứu tại giường' },
    { id: 4, label: 'Siêu âm ổ bụng (gan mật, tụy, lách, thận, bàng quang)' },
    { id: 5, label: 'Chụp XQuang ngực thẳng' },
    { id: 6, label: 'Xét nghiệm' },
    { id: 7, label: 'Đơn thuốc' },
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
              density="compact"
              rows={[
                { id: 1, date: '27/12/2023 15:00' },
                { id: 2, date: '23/12/2023 15:00' },
                { id: 3, date: '23/12/2023 15:00' },
                { id: 4, date: '23/12/2023 15:00' },
                { id: 5, date: '23/12/2023 15:00' },
                { id: 6, date: '23/12/2023 15:00' },
                { id: 7, date: '23/12/2023 15:00' },
                { id: 8, date: '23/12/2023 15:00' },
                { id: 9, date: '23/12/2023 15:00' },
                { id: 10, date: '23/12/2023 15:00' },
              ]}
              // autoHeight
              getRowHeight={() => 'auto'}
              sx={{ '& .MuiDataGrid-cell': { paddingLeft: "0px !important", paddingRight: "0px !important", padding: "0px !important" } }}
              columns={[
                {
                  field: 'date', headerName: 'STT', flex: 0.1, minWidth: 80,
                  renderCell: (params) => (
                    <div style={{ width: '100%' }}>
                      <div style={{
                        backgroundColor: clickedRow === params.id ? '#0292B1' : '#fff',
                        color: clickedRow === params.id ? '#fff' : '#000',
                        padding: '5px 5px 5px 15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                        onClick={() => { setClickedRow(params.id === clickedRow ? -1 : params.id) }}>
                        {params.value}
                        <IconButton title='Chỉnh sửa'>
                          <Icon icon='bx:chevron-down' color={clickedRow === params.id ? '#fff' : '#000'} />
                        </IconButton>
                      </div>

                      <Collapse in={clickedRow === params.id}>
                        <div style={{ padding: 10 }}>
                          <Paper style={{ padding: '10px 15px' }}>
                            <Grid container>
                              {
                                gridOption.map((item, index) => (
                                  <>
                                    <Grid item xs={12} paddingBottom={1} paddingTop={1} display='flex' justifyContent='space-between' alignItems='center'>
                                      <Typography fontSize={14}>{item.label}</Typography>
                                      <IconButton title='In' onClick={() => {
                                        // handleOpenUpdate(params.row);
                                      }}>
                                        <Icon icon='bx:printer' fontSize={20} style={{ marginRight: 5 }} color="#BF8000" />
                                      </IconButton>
                                    </Grid>
                                    <Divider style={{ width: '100%' }} />
                                  </>
                                ))
                              }
                            </Grid>
                          </Paper>
                        </div>

                      </Collapse>
                    </div>
                  ),
                },
              ]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              paginationMode='server'
              hideFooterSelectedRowCount
              columnHeaderHeight={0}
              style={{ minHeight: 200, height: '30dvh' }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <Paper>
          <Grid container spacing={3} padding={5}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Typography variant="h4">THÔNG TIN KHÁM BỆNH</Typography>
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

            <Grid item xs={12} spacing={2}>
              <Grid container paddingLeft={10}>
                <Grid item xs={3}>Mạch(lần/phút):</Grid>
                <Grid item xs={3}>Nhịp thở(lần/phút):</Grid>
                <Grid item xs={3}>Huyết áp(mmHg): /</Grid>
                <Grid item xs={3}>BMI:</Grid>

                <Grid item xs={3}>Nhiệt độ(°C):</Grid>
                <Grid item xs={3}>Chiều cao(cm):</Grid>
                <Grid item xs={3}>Cân nặng(kg): 18.5</Grid>
                <Grid item xs={3}></Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              1. Lý do khám bệnh:
            </Grid>
            <Grid item xs={12}>
              2. Bệnh sử: vết thương 2cm phần đầu, sạch,nông,sau té không yếu liệt,không sốt
            </Grid>

            <Grid item xs={12}>
              3. Tiền sử:
            </Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>Tiền sử bản thân: không</span></Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>Tiền sử dị ứng: không</span></Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>Tiền sử gia đình: không</span></Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>Vấn đề khác (nếu có): không</span></Grid>

            <Grid item xs={12}>4. Khám lâm sàng:</Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>Tim đều, phổi trong, bụng mềm</span></Grid>

            <Grid item xs={12}>5. Chẩn đoán:</Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>[S01] Vết thương hở ở đầu</span></Grid>

            <Grid item xs={12}>6. Lời dặn:</Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>tái khám</span></Grid>

            <Grid item xs={12}>7. Ngày hẹn tái khám:</Grid>
            <Grid item xs={12}><span style={{ marginLeft: 35 }}>03/01/2024 08:00</span></Grid>

          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </>;
}

export default ExamSchedule;
