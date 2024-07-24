import { useMutation, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  tableCellClasses
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GET_RES_EXAM_SERVICE,
  GET_SERVICE_INDEX,
  GET_SERVICE_INDEX_PROC_DT
} from 'src/components/subclinical/disease-test/service_index_proc/graphql/query'
import {
  UPDATE_SERVICE_INDEX,
  UPDATE_SERVICE_INDEX_PROC
} from 'src/components/subclinical/disease-test/service_index_proc/graphql/mutation'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import { ServiceIndexProcs, ServiceIndices } from './graphql/variables'

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[100],
    '&:hover, &.Mui-hovered': {
      backgroundColor: 'transparent',
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    }
  }
}))
type Props = {
  data?: any
}
interface ServiceIndexProcInput {
  note: string
}

const Results = (props: any) => {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const [updateServiceIndex] = useMutation(UPDATE_SERVICE_INDEX)
  const [updateServiceIndexProc] = useMutation(UPDATE_SERVICE_INDEX_PROC)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  const {
    data: queryData,
    loading,
    error,
    refetch
  } = useQuery(GET_SERVICE_INDEX_PROC_DT, {
    variables: { input: { resExamServiceDtId: props.data?.id ? { eq: props.data?.id } : undefined } }
  })

  const GetServiceIndexProc = useMemo(() => {
    return queryData?.getServiceIndexProc?.items ?? []
  }, [queryData])

  const selectedServiceIndices = props.data?.service?.serviceIndices || []
  const [input, setInput] = useState<ServiceIndices>({
    ...selectedServiceIndices
  })
  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật xét nghiệm')
  }, [])

  const onCompleted = useCallback(() => {
    toast.success('Cập nhập phiếu xét nghiệm thành công')
  }, [])

  const handleChange = (key: string, newValue: any) => {
    setInput({
      ...input,
      [key]: newValue
    })
  }
  const Submit = async () => {
    const items = selectedServiceIndices

    await items.map((item: ServiceIndices) => {
      const dataUpdate = {
        id: item.id,
        name: item.name,
        defaultValue: item.defaultValue,
        referenceValue: item.referenceValue,
        testers: item.testers
      }
      updateServiceIndex({
        variables: {
          input: JSON.stringify(dataUpdate)
        },
        onError,
        onCompleted
      })
    })
  }
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 250,
      field: 'name',
      headerName: 'Chỉ số',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => {
        // console.log('check row: ', params.row)

        return <div>Định lượng {params.row?.serviceIndex.name}</div>
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      headerName: 'IN ĐẬM',
      field: 'checkbox', // ...GRID_CHECKBOX_SELECTION_COL_DEF
      renderCell: (param: any) => {
        return <Checkbox {...label} />
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'defaultValue',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'super-app-theme--header',
      headerName: 'Kết quả',
      renderCell: (params: any) => {
        return (
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            defaultValue={params.row?.serviceIndex.defaultValue ?? ''}
            onChange={e => handleChange('defaultValue', e.target.value)}
            sx={{
              maxHeight: '32px',
              '& .MuiInputBase-root': {
                maxHeight: '36px',
                fontSize: '14px'
              }
            }}
            variant='outlined'
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'referenceValue',
      headerClassName: 'super-app-theme--header',
      headerName: 'Giá trị tham chiếu',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => {
        return <div>{params.row?.serviceIndex.referenceValue}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'unit',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Đơn vị',
      renderCell: (params: any) => {
        return <div>{params.row?.serviceIndex.unit}</div>
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'serviceIndexProcs.note',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'super-app-theme--header',
      headerName: 'Ghi chú',
      renderCell: (params: any) => {
        return (
          <TextField
            required
            defaultValue={params.row?.note ?? ''}
            onChange={e => handleChange('serviceIndexProcs.note', e.target.value)}
            sx={{
              maxHeight: '32px',
              '& .MuiInputBase-root': {
                maxHeight: '36px',
                fontSize: '14px'
              }
            }}
            variant='outlined'
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'testers',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Máy XN',
      renderCell: (params: any) => {
        return (
          <TextField
            required
            defaultValue={params.row?.testers ?? ''}
            onChange={e => handleChange('testers', e.target.value)}
            sx={{
              maxHeight: '32px',
              '& .MuiInputBase-root': {
                maxHeight: '36px'
              }
            }}
            variant='outlined'
          />
        )
      }
    }
  ]
  return (
    <Grid container>
      <Grid item xs={12}>
        <StripedDataGrid
          sx={{
            width: '100%',
            minHeight: 700,
            '& .super-app-theme--header': {
              backgroundColor: 'rgba(217, 217, 217, 1)'
            },
            '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
              border: 'none !important'
            }
          }}
          columns={COLUMN_DEF}
          rows={GetServiceIndexProc.map((item: any, index: any) => ({
            ...item,
            patInfo: '',
            index: index + 1 + paginationModel.page * paginationModel.pageSize
          }))}
          rowCount={queryData?.getServiceIndexProc?.totalCount ?? 0}
          onRowClick={params => {
            setSelectedPatient(params.row)
          }}
          hideFooterSelectedRowCount
          hideFooterPagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        />
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 650,
              mt: 5,
              overflow: 'hidden',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              border: '2px solid #e0e0e0'
            }}
            aria-label='simple table'
          >
            <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
              <TableRow>
                <TableCell>Chỉ số</TableCell>
                <TableCell>In đậm</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell>Giá trị tham chiếu</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Máy XN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {GetServiceIndexProc.map((items: ServiceIndexProcs, index: number) => (
                <TableRow key={items.id}>
                  <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                  <TableCell style={{ width: '10%' }}>
                    <Checkbox {...label} />
                  </TableCell>
                  <TableCell style={{ width: '25%' }}>
                    <Typography style={{ width: '100%' }}>{items.serviceIndex?.name || ''} </Typography>
                  </TableCell>
                  <TableCell style={{ width: '40%' }}>
                    <TextField sx={{ width: '100%' }} defaultValue={items.serviceIndex?.defaultValue} />
                  </TableCell>
                  <TableCell style={{ width: '25%' }}>
                    <Typography style={{ width: '100%' }}>{items.serviceIndex?.referenceValue || ''} </Typography>
                  </TableCell>
                  <TableCell style={{ width: '25%' }}>
                    <Typography style={{ width: '100%' }}>{items.serviceIndex?.unit || ''} </Typography>
                  </TableCell>
                  <TableCell style={{ width: '20%' }}>
                    <TextField
                      type='number'
                      fullWidth
                      sx={{ width: '70px' }}
                      inputProps={{ min: 0 }}
                      defaultValue={items.note}
                    />
                  </TableCell>
                  <TableCell style={{ width: '200px' }}>
                    <TextField value={items.serviceIndex?.testers} fullWidth sx={{ width: '200px' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Stack
          sx={{ padding: '16px', backgroundColor: '#D9D9D9' }}
          direction={'row'}
          spacing={10}
          justifyContent={'end'}
        >
          <Button
            variant='contained'
            sx={{ width: '160px', backgroundColor: '#FDB528' }}
            startIcon={<Icon icon='bxs-printer' />}
            // onClick={(event: any, index: any) => handleSubmit(event, index)}
          >
            In giấy hẹn
          </Button>
          <Button
            variant='contained'
            sx={{ width: '160px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={Submit}
          >
            Lưu
          </Button>
          <Button
            variant='outlined'
            sx={{ width: '160px', color: '#fff', backgroundColor: '#8592A3' }}
            startIcon={<Icon icon='eva:close-fill' />}
            // onClick={() => setOpenDetailsModal(false)}
          >
            Đóng
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Results
