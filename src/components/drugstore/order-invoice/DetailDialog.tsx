import { Box, Button, Card, Typography } from '@mui/material'
import { Stack, height, styled } from '@mui/system'
import React, { useState } from 'react'
import MUIDialog from 'src/@core/components/dialog'
import { formatNumber } from 'src/utils/formatMoney'
import styles from './styles.module.scss'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { Icon } from '@iconify/react'
import { UPDATE_ORDER } from './graphql/mutation'
import { useMutation } from '@apollo/client'
import toast from 'react-hot-toast'
import { Order, OrderDt } from './graphql/variables'

type Props = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  data: Order | undefined
  handlePrint: any
}
const StyledDataGrid = styled('div')(({ theme }) => ({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#32475C38'
  }
}))
const DetailDialog = (props: Props) => {
  const [updateOrder] = useMutation(UPDATE_ORDER)
  const choiceDelete = () => {
    toast(
      (t) => (
        <div>
          <Typography fontWeight={500} fontSize={'1.25rem'}>Bạn chắc chắn muốn hủy phiếu?</Typography>
          <br/>
          <span style={{display: 'flex', justifyContent:'space-evenly'}}>
            <Button variant='contained' color='error' sx={{ paddingX: 5 }} startIcon={<Icon icon='bx:trash' />}
              onClick={()=>{handleDelete(props.data?.id || ''); toast.dismiss(t.id)}}>
              hủy
            </Button>
            <Button variant='contained' color='info' sx={{ paddingX: 5 }} startIcon={<Icon icon="lets-icons:back" width="24" height="24" />}
              onClick={() => toast.dismiss(t.id)}>
              quay về
            </Button>
          </span>
        </div>
      )
    )
    
  }
  const handleDelete = (id: string) => {
      updateOrder({
        variables: {
          input: JSON.stringify({
            id: id,
            status: '103'
          })
        },
        onCompleted: () => {
          toast.success(`Hủy phiếu ${id} thành công`)
          props.open[1](false)
        }
      })
    }
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.5,
      minWidth: 100,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 2,
      minWidth: 200,
      field: 'id',
      headerName: 'MÃ',
      renderCell: params => <div>{params.row?.product?.id}</div>
    },
    {
      flex: 2,
      minWidth: 200,
      field: 'productName',
      headerName: 'TÊN',
      renderCell: params => (
        <div>
          <span>{params.row?.product?.productName}</span>
          <br />
          {params.row?.batchId ? (
            <span>
              Số lô: {params.row?.batchId} <br /> HSD: {moment(params.row?.batch?.endDate).format('DD/MM/YYYY')}
            </span>
          ) : (
            ''
          )}
        </div>
      )
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'unit',
      headerName: 'ĐVT',
      renderCell: params => <div>{params.row?.product?.prescribingUnit?.name}</div>
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'quantity',
      headerName: 'S.LG',
      renderCell: params => <div>{params.row?.quantity}</div>
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'price',
      headerName: 'ĐƠN GIÁ',
      renderCell: params => (
        <div>
          <span>{formatNumber(params.row?.product?.price)} VNĐ</span>
          <br />
          <span>VAT: {params.row?.vat}%</span>
        </div>
      )
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'ck',
      headerName: 'CHIẾT KHẤU',
      renderCell: params => <div>{formatNumber(params.row?.discountAmount)} VNĐ</div>
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'totalPrice',
      headerName: 'THÀNH TIỀN',
      renderCell: params => <div>{formatNumber(params.row?.finalPrice)} VNĐ</div>
    },
    {
      flex: 1.5,
      minWidth: 150,
      field: 'bhyt',
      headerName: 'QUỸ BHYT',
      renderCell: params => <div>{formatNumber(params.row?.bhytAmount || 0)} VNĐ</div>
    }
  ]
  const status = () => {
    if (props.data?.status === '102') {
      return <span className={styles.buy_completed}>ĐÃ THANH TOÁN</span>
    } else if (props.data?.status === '103') {
      return <span className={styles.buy_delete}>ĐÃ HỦY</span>
    } else if (props.data?.status === '101') {
      return <span className={styles.buy_waiting}>CHƯA MUA</span>
    }
  }
  return (
    <MUIDialog open={props.open} maxWidth='xl' title='Thông tin đơn thuốc'>
      <>
        <Box p={5}>
          <Card sx={{ borderRadius: 1, p: 5, boxShadow: 4 }}>
            <Stack direction={'row'} display={'flex'} justifyContent={'space-between'}>
              <Stack direction={'column'} gap={2}>
                <Typography variant='h6' color={'#000000'}>
                  Người Thực Hiện: {props.data?.pharmacyManager?.fristName} {props.data?.pharmacyManager?.lastName}
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Mức BHYT: {props.data?.resExam?.benefitLevel?.name?.split(': ')[1] || 'Không có'}
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Quỹ BHYT: {formatNumber(props.data?.bhytAmount || 0)} VNĐ
                </Typography>
              </Stack>
              <Stack direction={'column'} gap={2}>
                <Typography variant='h6' color={'#000000'}>
                  Ngày Bán: {moment(props.data?.createAt).format('DD/MM/YYYY HH:mm')}
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Trạng Thái: {status()}
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Giảm giá: {formatNumber(props.data?.totalDiscount || 0)} VNĐ
                </Typography>
              </Stack>
              <Stack direction={'column'} gap={2}>
                <Typography variant='h6' color={'#000000'}>
                  Mã Hóa Đơn: {props.data?.id}
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Tổng Tiền: {formatNumber(props.data?.totalPrice || 0)}VNĐ
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Thành Tiền: {formatNumber(props.data?.finalPrice || 0)} VNĐ
                </Typography>
              </Stack>
              <Stack direction={'column'} gap={2}>
                <Typography variant='h6' color={'#000000'}>
                  Họ Và Tên: {props.data?.resExam ? props.data?.resExam?.patName : (props.data?.pat?.name?  props.data?.pat?.name : 'Khách lẻ')}
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Tổng VAT: {formatNumber(props.data?.totalVat || 0)} VNĐ
                </Typography>
                <Typography variant='h6' color={'#000000'}>
                  Phương Thức TT: {props.data?.paymentType?.name || 'Không có'}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant='h6' color={'#000000'} mt={2}>
              Ghi Chú: {props.data?.note}
            </Typography>
          </Card>
          <StyledDataGrid >
            <DataGrid
              sx={{ marginTop: 10 }}
              columns={COLUMN_DEF}
              rows={(props.data?.orderDts || []).map((item: OrderDt, index: any) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              rowHeight={80}
              rowCount={props.data?.orderDts?.length ?? 0}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
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
          </StyledDataGrid>
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={4} justifyContent={'end'}>
          <Button variant='contained' color='error' sx={{ paddingX: 10 }} startIcon={<Icon icon='bx:trash' />}
            onClick={()=>choiceDelete()}>
            hủy PHIẾU
          </Button>
          <Button
            variant='contained'
            color='primary'
            sx={{ paddingX: 10 }}
            startIcon={<Icon icon='material-symbols:print' width='24' height='24' />}
            onClick={props.handlePrint}
          >
            IN PHIẾU
          </Button>
          <Button
            variant='contained'
            color='secondary'
            sx={{ paddingX: 10 }}
            startIcon={<Icon icon='material-symbols:close' width='24' height='24' />}
            onClick={() => props.open[1](false)}
          >
            ĐÓNG
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
}

export default DetailDialog
