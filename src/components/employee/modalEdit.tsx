import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
// import material UI
import {
  Box,
  Button,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Paper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material'

import MuiSelect from 'src/@core/components/mui/select'
import { useMutation, useQuery } from '@apollo/client'

// import dữ liệu

// import icon
import Icon from 'src/@core/components/icon'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { signal } from '@preact/signals'
import General_Information from './add/general-information/general_information'
//exxport
export const dialogType = signal<'add' | 'update'>('add')
type Props = {
  data?: any
  type?: 'add' | 'update'
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  handleClose?: () => void
}
const ModalEdit = (props: Props) => {
  const { data, type, handleClose } = props
  const [tab, setTab] = useState('1')
  const handleaddUser = (key: string, newvalue: any) => {
    console.log(key, newvalue)
  }
  return (
    <>
      <MuiDialogContent onClose={handleClose}>
        <>
          <CardContent>
            <TabContext value={tab}>
              <Box sx={{ display: 'flex', borderBottomLeftRadius: '1px solid #0292B1' }}>
                <TabList onChange={(e, newValue) => setTab(newValue)}>
                  <Tab value='1' label='Thông Tin Chung' />
                  <Tab value='2' label='Thông Tin Công Việc' />
                  <Tab value='3' label='Thông Tin Tai Chính' />
                  <Tab value='4' label='Thông Tin Khác' />
                </TabList>
              </Box>
              <Paper>
                <TabPanel value='1'>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Typography>Thông tin chung</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={2.4}>
                        <TextField
                          fullWidth
                          label='Họ'
                          placeholder='Nhập Họ'
                          required
                          InputLabelProps={{ shrink: true }}
                          onChange={e => {
                            handleaddUser('lastName', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={2.4}>
                        <TextField
                          fullWidth
                          label='Tên'
                          InputLabelProps={{ shrink: true }}
                          required
                          placeholder='Nhập Tên'
                          onChange={e => handleaddUser('fristName', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={3.2}>
                        <Autocomplete
                          autoHighlight
                          openOnFocus
                          filterSelectedOptions
                          options={['hello']}
                          // onChange={(event, newvalue) => {
                          //   handleaddUser('roleId', DATAROLE?.find((option: any) => option.name === newvalue)?.id)
                          // }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Loại nhân sự'
                              placeholder='Chọn loại nhân sự'
                              required
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>Giới tính</Typography>
                        <RadioGroup row name='controlled' onChange={e => handleaddUser('gender', e.target.value)}>
                          <FormControlLabel value={1} control={<Radio />} label='Nam' />
                          <FormControlLabel value={2} control={<Radio />} label='Nữ' />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>Trạng thái</Typography>
                        <FormControlLabel
                          control={<Switch />}
                          label=''
                          onChange={(e, newvalue) => handleaddUser('status', newvalue)}
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <TextField
                          fullWidth
                          label='Số điện thoại'
                          InputLabelProps={{ shrink: true }}
                          type='number'
                          placeholder='Nhập số điện thoại'
                          onChange={e => handleaddUser('phone', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField
                          fullWidth
                          label='Email'
                          required
                          InputLabelProps={{ shrink: true }}
                          type='email'
                          placeholder='Nhập Email'
                          onChange={e => handleaddUser('email', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <TextField
                          fullWidth
                          type='date'
                          InputLabelProps={{ shrink: true, placeholder: 'Nhập ngày sinh' }}
                          label='Ngày sinh'
                          placeholder='Nhập ngày sinh'
                          // onChange={e => handleaddUser('dateOfBirth', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField
                          fullWidth
                          label='Địa chỉ'
                          placeholder='Nhập địa chỉ'
                          InputLabelProps={{ shrink: true }}
                          onChange={e => handleaddUser('address', e.target.value)}
                        />
                      </Grid>
                      {/*  */}
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Chứng chí hành nghề'
                          onChange={e => handleaddUser('practicingCertificate', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Autocomplete
                          id='country-select-demo'
                          autoHighlight
                          openOnFocus
                          filterSelectedOptions
                          options={['hello']}
                          // options={ExamDefaultType?.map((option: any) => option.name)}
                          // onChange={(event, newvalue) =>
                          //   handleaddUser('examDefaultTypeId', ExamDefaultType?.find((option: any) => option.name === newvalue)?.id)
                          // }
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Khoa'
                              placeholder='Chọn Khoa'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Autocomplete
                          id='country-select-demo'
                          autoHighlight
                          openOnFocus
                          filterSelectedOptions
                          options={['xin chai', 'hello']}
                          onChange={(event, newvalue) => handleaddUser('specialistId', newvalue)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Chuyên Khoa'
                              placeholder='Chọn Chuyên Khoa'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          id='country-select-demo'
                          autoHighlight
                          openOnFocus
                          filterSelectedOptions
                          options={['hello']}
                          // onChange={(e, newvalue) =>
                          //   handleaddUser('clinicId', DATACLinict?.find((item: any) => item?.name === newvalue).id)
                          // }
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Chi nhánh trực thuộc '
                              placeholder='Chi nhánh trực thuộc'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label='Mật khẩu'
                          required
                          placeholder='Số lượng con'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                          onChange={e => handleaddUser('password', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label='Mật khậu nhắc lại'
                          required
                          placeholder='Số lượng con'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value='2'>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Typography>Thông tin công việc</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
                    <Grid container spacing={10}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='CMND hoặc thẻ CCCD'
                          placeholder='CMND hoặc thẻ CCCD'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                          onChange={e => handleaddUser('userCccd', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Nơi cấp CMND/CCCD'
                          placeholder='Nhập nơi cấp CMND/CCCD'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          type='date'
                          InputLabelProps={{ shrink: true, placeholder: 'dd/mm/yyyy' }}
                          label='Ngày cấp CMND/CCCD'
                          placeholder='Nhập ngày cấp CMND/CCCD'
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Hộ khẩu'
                          placeholder='Hộ khẩu '
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Người liên hệ khẩn cấp '
                          placeholder='Người liên hệ khẩn cấp'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Điện thoại khẩn cấp '
                          placeholder='Điện thoại khẩn cấp'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value='3'>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Typography>Thông tin tài chính</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
                    <Grid container spacing={10}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Mã số thuế'
                          placeholder='Mã số thuế'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          type='date'
                          InputLabelProps={{ shrink: true, placeholder: 'dd/mm/yyyy' }}
                          label='Ngày cấp MST'
                          placeholder='Nhập ngày cấp MST'
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Chi cục quản lý thuế'
                          placeholder='Chi cục quản lý thuế'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Số bảo hiểm y tế'
                          placeholder='Nhập bảo hiểm y tế '
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value='4'>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Typography>Thông tin khác</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
                    <Grid container spacing={10}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Trinh độ học vẫn'
                          placeholder='Trinh độ học vẫn'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Chuyên ngành'
                          placeholder='Chuyên ngành'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Autocomplete
                          id='country-select-demo'
                          autoHighlight
                          openOnFocus
                          filterSelectedOptions
                          options={['Độc Thân', 'Đã kết hôn', 'Đã ly hôn']}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Tình trạng hôn nhân '
                              placeholder='Tình trạng hôn nhân'
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Số lượng con'
                          placeholder='Số lượng con'
                          autoFocus
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>
              </Paper>
            </TabContext>
          </CardContent>
        </>
      </MuiDialogContent>
    </>
  )
}

export default ModalEdit
