import { Avatar, Box, Button, CircularProgress, Grid, Tab, Typography, styled } from '@mui/material'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import MUIDialog from 'src/@core/components/dialog'
import moment from 'moment'
import { formatVND } from 'src/utils/formatMoney'
import { useQuery } from '@apollo/client'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import ListAltIcon from '@mui/icons-material/ListAlt'
import RestoreIcon from '@mui/icons-material/Restore'
import { Stack } from '@mui/system'
import PrintIcon from '@mui/icons-material/Print'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { GET_WH_CUST_RETURN_DT } from 'src/components/inventory/ip_from_supplier/graphql/query'

type Props = {
  open: [boolean, React.Dispatch<SetStateAction<boolean>>]
  id: string | undefined
}
const StyledDataGrid = styled('div')(({ theme }) => ({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#32475C38'
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: '#32475C0A'
  }
}))
const TabListWrapper = styled(TabList)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    gap: 10
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-labelIcon': {
    color: '#32475CDE',
    border: '1px solid #32475C38',
    borderRadius: '10px 10px 0 0',
    height: 50,
    minWidth: 200,
    '&:hover': {
      color: '#0292B1',
      border: '2px solid #0292B1'
    },
    '&.Mui-selected': {
      color: '#0292B1',
      border: 'solid #0292B1',
      borderBottom: '0'
    }
  }
}))
const DetailDialog = (props: Props) => {
  const [value, setValue] = React.useState('1')
  const route = useRouter()
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const {
    data: GetWhCustReturnDt,
    loading,
    refetch
  } = useQuery(GET_WH_CUST_RETURN_DT, {
    variables: {
      input: {
        whCustReturnId: { eq: props.id }
      },
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize
    }
  })
  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open])

  const data = GetWhCustReturnDt?.getWhCustReturnDt?.items ?? []
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'productId',
      headerName: 'Mã HH',
      renderCell: params => <span>{params.value}</span>
    },
    {
      flex: 0.45,
      minWidth: 200,
      field: 'product',
      headerName: 'Hàng hóa',
      renderCell: params => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{params.row?.product?.productName}</span>
          <span>Số lô: {params.row?.batchId}</span>
          <span>HSD: {moment(params.row?.dueDate).format('DD/MM/YYYY')}</span>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'unit',
      headerName: 'Đơn vị tính',
      renderCell: params => {
        return `${params.row?.unit?.name} `
      }
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'quantity',
      headerName: 'Số lượng',
      renderCell: params => {
        return `${params.value} `
      }
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'importPrice',
      headerName: 'Giá nhập',
      renderCell: params => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{formatVND(params.value)}</span>
          </div>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'ck',
      headerName: 'Chiết khấu',
      renderCell: params => {
        return <span>{formatVND(params?.row?.discountAmount || 0)}</span>
      }
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'vat',
      headerName: 'VAT%',
      renderCell: params => {
        return <span>{params.value}</span>
      }
    },
    {
      flex: 0.3,
      minWidth: 100,
      field: 'finalAmount',
      headerName: 'Thành tiền',
      renderCell: params => <div>{formatVND(params.value)}</div>
    }
  ]
  console.log('data', data)

  return (
    <MUIDialog open={props.open} maxWidth='xl' title='Thông tin thuốc khách trả'>
      <>
        <Grid container direction={'row'} p={5} spacing={5}>
          <Grid item md={8}>
            <StyledDataGrid>
              <DataGrid
                sx={{ width: '100%' }}
                columns={COLUMN_DEF}
                rowHeight={80}
                getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                rows={data.map((item: any, index: number) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                rowCount={GetWhCustReturnDt?.getWhCustReturnDt?.totalCount ?? 0}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='server'
                slots={{
                  noRowsOverlay: () => (
                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                  )
                }}
                style={{ minHeight: 500, height: '60vh' }}
              />
            </StyledDataGrid>
          </Grid>
          <Grid item md={4}>
            <TabContext value={value}>
              <TabListWrapper onChange={handleChange}>
                <Tab label='Thông tin' icon={<ListAltIcon />} iconPosition='start' value='1' />
              </TabListWrapper>
              <TabPanel sx={{ boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px ', borderRadius: '10px' }} value='1'>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Stack direction={'column'} gap={2}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography display={'flex'} alignItems={'center'}>
                        <PersonOutlineOutlinedIcon /> {data[0]?.whCustReturn?.whPersion.fristName}{' '}
                        {data[0]?.whCustReturn?.whPersion.lastName}
                      </Typography>
                      <Typography>{moment(data[0]?.whCustReturn?.createAt).format('DD/MM/YYYY HH:mm')}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Mã phiếu</Typography>
                      <Typography>{data[0]?.whCustReturnId}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Kho nhập</Typography>
                      <Typography>{data[0]?.whCustReturn?.wh?.name}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Nhà cung cấp</Typography>
                      <Typography>{data[0]?.whCustReturn?.supplier?.name}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Trạng thái</Typography>
                      {data[0]?.whCustReturn?.status === '301' ? (
                        <Button
                          variant='outlined'
                          color='primary'
                          style={{ width: '102px', fontSize: '13px', borderRadius: '10px', paddingInline: 0 }}
                        >
                          Lưu nháp
                        </Button>
                      ) : data[0]?.whCustReturn?.status === '302' ? (
                        <Button
                          style={{
                            width: '102px',
                            paddingInline: 0,
                            fontSize: '13px',
                            backgroundColor: 'rgba(38, 249, 160, 0.1215686275)',
                            color: '#67C932',
                            borderRadius: '10p',
                            border: '1px solid #67C932'
                          }}
                          variant='contained'
                          color='success'
                        >
                          Hoàn thành
                        </Button>
                      ) : (
                        <Button
                          variant='outlined'
                          color='error'
                          style={{ width: '102px', fontSize: '13px', borderRadius: '10px', paddingInline: 0 }}
                        >
                          ĐÃ HỦY
                        </Button>
                      )}
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography fontWeight={'bold'}>Tổng tiền</Typography>
                      <Typography fontWeight={'bold'}>{formatVND(data[0]?.whCustReturn?.totalAmount)}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Giảm giá</Typography>
                      <Typography>{formatVND(data[0]?.whCustReturn?.totalDiscount)}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Tổng VAT</Typography>
                      <Typography>{formatVND(data[0]?.whCustReturn?.totalVatAmount)}</Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography fontWeight={'bold'}>Thành tiền</Typography>
                      <Typography fontWeight={'bold'}>{formatVND(data[0]?.whCustReturn?.finalAmount)}</Typography>
                    </Box>

                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Typography>Ghi chú</Typography>
                      <Typography>{data[0]?.whCustReturn?.note}</Typography>
                    </Box>
                  </Stack>
                )}
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
        <Stack direction={'row'} sx={{ backgroundColor: '#8EAFB7' }} spacing={2} justifyContent={'flex-end'} p={5}>
          <Button variant='contained' sx={{ backgroundColor: '#FDB528' }}>
            <PrintIcon sx={{ mr: 2 }} /> In phiếu
          </Button>

          <Button variant='contained' color='secondary' onClick={() => props.open[1](false)}>
            <CloseIcon sx={{ mr: 2 }} /> đóng
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
}

export default DetailDialog
