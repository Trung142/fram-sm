import { Button, Grid, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useState } from 'react'
import MUIDialog from 'src/@core/components/dialog'
import styles from './index.module.scss'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import moment from 'moment'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatNumber } from 'src/utils/formatMoney'
import Divider from '@mui/material/Divider'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { IPrescription, IPrescriptionDts } from './graphql/variables'

type Props = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  data: IPrescription | undefined
}

const DetailDialog = (props: Props) => {
  const router = useRouter()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const order:any = props.data?.orders
  const getOrder = (productId:string) => {
    let quantity
    let finalPrice
    let discountAmount
    if (order === undefined || order === null || order.length === 0) {quantity=0, finalPrice = 0, discountAmount = 0}
    else {
      order[0].orderDts.forEach((e:any) => {
        if (productId === e.productId) {
          finalPrice = e.finalPrice
          quantity=e.quantity
          discountAmount = e.discountAmount
        }
      })
    }
    return {finalPrice, quantity, discountAmount}
  }
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.05,
      minWidth: 100,
      field: 'index',
      headerName: '#',
      headerClassName: styles.header
    },
    {
      flex: 0.2,
      minWidth: 350,
      field: 'productName',
      headerName: 'TÊN',
      headerClassName: styles.header,
      renderCell: params => (
        <div>
          <div>
            <span>{params.row?.product?.productName}</span>
          </div>
          <div>
            <span>{params.row?.dosage}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'unit',
      headerClassName: styles.header,
      headerName: 'ĐVT',
      renderCell: params => (
        <div>
          <span>{params.row?.product?.prescribingUnit?.name}</span>
        </div>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'quantity',
      headerClassName: styles.header,
      headerName: 'MUA/KÊ',
      renderCell: params => (
        <div>
          <span>
            {getOrder(params.row?.productId).quantity}/{params.value}
          </span>
        </div>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'price',
      headerClassName: styles.header,
      headerName: 'ĐƠN GIÁ',
      renderCell: params => <div>{formatNumber(params.row?.product?.price)} VNĐ</div>
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'ck',
      headerClassName: styles.header,
      headerName: 'CHIẾT KHẤU',
      renderCell: params => <div>{formatNumber(getOrder(params.row?.productId).discountAmount || 0)} VNĐ</div>
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'prescriptionDts',
      headerClassName: styles.header,
      headerName: 'THÀNH TIỀN',
      renderCell: params => <div>{formatNumber(getOrder(params.row?.productId).finalPrice || 0)} VNĐ</div>
    }
  ]
  const age = () => {
    if (!props.data?.resExam?.age || props.data.resExam.age === undefined || props.data.resExam.age === null) {
      return <span>{props.data?.resExam?.monthsOld} tháng tuổi</span>
    } else if (
      !props.data.resExam.monthsOld ||
      props.data.resExam.monthsOld === undefined ||
      props.data.resExam.monthsOld === null
    ) {
      return <span>{props.data.resExam.age} tuổi</span>
    }
  }
  const status = () => {
    if (props.data?.status === null || props.data?.status === undefined || props.data?.status === '113') {
      return <span className={styles.buy_delete}>ĐÃ HỦY</span>
    } else if (props.data?.status === '111') {
      return <span className={styles.buy_waiting}>CHƯA MUA</span>
    } else if (props.data?.status === '112') {
      return <span className={styles.buy_completed}>ĐÃ MUA</span>
    }
  }
  const preDt: any = props.data?.prescriptionDts

  return (
    <MUIDialog open={props.open} maxWidth='xl' title='Đơn thuốc'>
      <Box p={5}>
        <Box border={1}>
          <Box p={5}>
            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
              <Typography variant='h5' fontWeight={'bold'}>
                {props.data?.resExam?.patName} - {props.data?.resExam?.gender == 1 ? 'Nam' : 'Nữ'} - [
                {props.data?.resExam?.year}] - {age()}
              </Typography>
              <Stack direction={'row'} spacing={5} alignItems={'center'}>
                {status()}
                <WatchLaterIcon />
                {moment(props.data?.createAt).format('DD/MM/YYYY HH:mm')}
              </Stack>
            </Stack>
          </Box>
          <Divider sx={{ width: '100%', marginY: 5, backgroundColor: '#000000' }} />
          <DataGrid
            sx={{ width: '100%', padding: 5 }}
            columns={COLUMN_DEF}
            rows={preDt.map((item: IPrescriptionDts, index: number) => ({
              ...item,
              index: index + 1 + paginationModel.page * paginationModel.pageSize
            }))}
            rowCount={preDt.length}
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
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={4} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '180px' }}
            startIcon={<Icon icon='material-symbols:edit' />}
            onClick={() =>
              router.push({
                pathname: `/examination/examination-list/examination-update/${props.data?.resExam?.id}/`,
                query: { tabName: 'Prescription' }
              })
            }
          >
            CHỈNH SỬA (F8)
          </Button>
          <Button
            variant='contained'
            sx={{ width: '180px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            onClick={() => props.open[1](false)}
          >
            Đóng (F10)
          </Button>
        </Stack>
      </Box>
    </MUIDialog>
  )
}

export default DetailDialog
