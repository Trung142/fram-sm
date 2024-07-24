import React, { useState } from 'react'
import styles from 'src/components/drugstore/pharmacy/styles.module.scss'
import MUIDialog from 'src/@core/components/dialog'
import { Controller, useForm } from 'react-hook-form'
import { Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import NoteIcon from '@mui/icons-material/Note'
import InfoIcon from '@mui/icons-material/Info'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import QrCodeIcon from '@mui/icons-material/QrCode'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import PaymentIcon from '@mui/icons-material/Payment'
import BackspaceIcon from '@mui/icons-material/Backspace'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { min } from 'date-fns'

interface ButtonItem {
  title: string
  dialogContent: JSX.Element
}
const DrugStoreButtonDialog = () => {
  const { handleSubmit, control } = useForm()
  const [openButtonDialog, setOpenButtonDialog] = useState(false)
  const [activatingCardID, setActivatingCardID] = useState()
  const COLUMN_DEF_PRESCRIPTION: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.4,
      minWidth: 160,
      field: 'name',
      headerName: 'TÊN MẪU'
    },
    {
      flex: 0.4,
      minWidth: 160,
      field: 'detail',
      headerName: 'CHI TIẾT'
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'note',
      headerName: 'GHI CHÚ'
    }
  ]
  const COLUMN_DEF_SALE_PROGRAM: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.4,
      minWidth: 160,
      field: 'program_type',
      headerName: 'LOẠI CHƯƠNG TRÌNH'
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'program_detail',
      headerName: 'CHI TIẾT CHƯƠNG TRÌNH'
    }
  ]
  const Noted = () => (
    <MUIDialog maxWidth='sm' open={[openButtonDialog, setOpenButtonDialog]} title='Ghi chú khách hàng'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='notedClient'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                rows={10}
                multiline
                label='Ghi chú khách hàng'
                placeholder={'Nhập ghi chú khách hàng'}
                InputLabelProps={{ shrink: true }}
                variant='outlined'
                InputProps={{
                  style: { padding: '0px, 12px, 0px, 12px' }
                }}
              />
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const Info = () => (
    <Controller
      name='drugInfo'
      control={control}
      render={({ field }) => (
        <Grid container>
          <TextField {...field} fullWidth rows={12}></TextField>
          <TextField
            {...field}
            fullWidth
            rows={10}
            label='Ghi chú khách hàng'
            placeholder={'Nhập ghi chú khách hàng'}
            InputLabelProps={{ shrink: true }}
            variant='outlined'
            // InputProps={{
            //   style: { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            // }}
          />
        </Grid>
      )}
    />
  )
  const SelectPrescription = () => (
    <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Đơn thuốc mẫu'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='selectedPrescription'
            control={control}
            render={({ field }) => (
              <Grid container display='flex' flexDirection='column'>
                <Grid item lg={10}>
                  <div style={{ display: 'flex' }}>
                    <TextField
                      {...field}
                      label='Từ khoá tìm kiếm'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      placeholder={'Nhập từ khoá tìm kiếm'}
                      variant='outlined'
                    />
                    <Button sx={{ borderRadius: 0, width: 56, height: 56, ml: -1 }} variant='contained' color='primary'>
                      <Icon icon='bx:search' fontSize={24} />
                    </Button>
                    <Button
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 56, height: 56 }}
                      variant='contained'
                      color='secondary'
                    >
                      <Icon icon='bx:revision' fontSize={24} />
                    </Button>
                  </div>
                </Grid>
                <Grid item lg={12} sx={{ mt: 10 }}>
                  <DataGrid
                    columns={COLUMN_DEF_PRESCRIPTION}
                    rows={[]}
                    paginationMode='server'
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
              </Grid>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={4} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '180px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Chọn
          </Button>
          <Button
            variant='contained'
            sx={{ width: '180px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const CK = () => (
    <MUIDialog open={[openButtonDialog, setOpenButtonDialog]} maxWidth='sm' title='Chiết khấu toàn bộ'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='ck'
            control={control}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  fullWidth
                  type='number'
                  value={0}
                  label='Chiết khấu tiền mặt'
                  placeholder={'Nhập ghi chú khách hàng'}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
                <TextField
                  sx={{ mt: 10 }}
                  {...field}
                  fullWidth
                  type='number'
                  label='Chiết khấu phần trăm'
                  placeholder={'%'}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              </>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const Discount = () => (
    <MUIDialog open={[openButtonDialog, setOpenButtonDialog]} maxWidth='sm' title='Mã giảm giá'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='discount'
            control={control}
            render={({ field }) => (
              <>
                <Card sx={{ width: '100%', padding: '10px' }} variant='elevation'>
                  <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography fontWeight={'bold'}>Mã giảm giá:</Typography>
                    <Typography fontWeight={'bold'}>Hạn dùng:</Typography>
                    <Typography fontWeight={'bold'}>Trạng thái mã:</Typography>
                    <Typography fontWeight={'bold'}>Số tiền giảm giá:</Typography>
                    <Typography fontWeight={'bold'}>% Giảm giá:</Typography>
                    <Typography fontWeight={'bold'}>Loại mã áp dụng: </Typography>
                  </Box>
                </Card>
                <Stack direction={'row'} sx={{ mt: 10 }}>
                  <TextField
                    {...field}
                    sx={{ width: '90%' }}
                    label='Mã giảm giá'
                    placeholder='Nhập mã giảm giá'
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '10%', height: 56, ml: -1 }}
                    variant='contained'
                    color='primary'
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                </Stack>
              </>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const SaleProgram = () => (
    <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Chương trình khuyến mãi'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='saleProggtram'
            control={control}
            render={({ field }) => (
              <>
                <Stack direction={'row'}>
                  <TextField
                    {...field}
                    sx={{ width: '90%' }}
                    label='Tìm chương trình khuyến mãi'
                    placeholder='Nhập thông tin cần tìm kiếm của chương trình khuyến mãi'
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '10%', height: 56, ml: -1 }}
                    variant='contained'
                    color='primary'
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                </Stack>
                <DataGrid
                  sx={{ mt: 10 }}
                  columns={COLUMN_DEF_SALE_PROGRAM}
                  rows={[]}
                  paginationMode='server'
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
              </>
            )}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={2} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '100px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '100px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => setOpenButtonDialog(false)}
          >
            Đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
  const button_leftSide = [
    {
      id: 1,
      name: 'Ghi chú khách hàng',
      icon: <NoteIcon />,
      dialog: <Noted />
    },
    {
      id: 2,
      name: 'Thông tin thuốc',
      icon: <InfoIcon />,
      dialog: <Info />
    },
    {
      id: 3,
      name: 'Chọn đơn thuốc đã lên',
      icon: <MedicationOutlinedIcon />,
      dialog: <SelectPrescription />
    },
    {
      id: 4,
      name: 'Chiết khấu',
      icon: <LocalOfferIcon />,
      dialog: <CK />
    },
    {
      id: 5,
      name: 'Mã giảm giá',
      icon: <QrCodeIcon />,
      dialog: <Discount />
    },
    {
      id: 6,
      name: 'Chương trình khuyến mãi',
      icon: <StarBorderOutlinedIcon />,
      dialog: <SaleProgram />
    }
  ]
  const buttonItems: ButtonItem[] = [
    {
      title: 'Ghi chú khách hàng',
      dialogContent: <Noted />
    },
    {
      title: 'Thông tin thuốc',
      dialogContent: <Info />
    },
    {
      title: 'Chọn đơn thuốc đã lên',
      dialogContent: <SelectPrescription />
    },
    {
      title: 'Chiết khấu sản phẩm',
      dialogContent: <CK />
    },
    {
      title: 'Mã giảm giá',
      dialogContent: <Discount />
    },
    {
      title: 'Chương trình khuyến mãi',
      dialogContent: <Noted />
    }
  ]
  const handleDialogOpen = (character: any) => {
    setOpenButtonDialog(true)
    setActivatingCardID(character.id)
  }
  const dialogContent = () => {
    return (
      <>
        {button_leftSide &&
          button_leftSide.length > 0 &&
          button_leftSide.map((item: any) => {
            return <div key={item.id}>{activatingCardID === item.id ? item.dialog : null}</div>
          })}
      </>
    )
  }
  return (
    <>
      {openButtonDialog ? dialogContent() : null}
      {button_leftSide.map((item, index) => (
        <Grid key={index} item xs={2} sm={4} md={4}>
          <Button
            className={styles.buttonItem}
            fullWidth
            onClick={() => handleDialogOpen(item)}
            startIcon={item.icon}
            style={{
              borderRadius: 0,
              color: 'rgba(0, 0, 0, 1)',
              boxShadow:
                '0px 1px 4px 2px rgba(50, 71, 92, 0.02), 0px 2px 6px 1px rgba(50, 71, 92, 0.04), 0px 1px 6px 2px rgba(50, 71, 92, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              background: `linear-gradient(0deg, #FFFFFF, #FFFFFF),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`
            }}
          >
            <Typography className={styles.buttonTitle}>{item.name}</Typography>
          </Button>
        </Grid>
      ))}
    </>
  )
}
export default DrugStoreButtonDialog
