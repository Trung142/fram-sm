import { Autocomplete, Box, Button, Grid, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { Icon } from '@iconify/react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import MUIDialog from 'src/@core/components/dialog'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useQuery } from '@apollo/client'
import { GET_PATEINT, GET_PRESCRIPTION } from './graphql/query'
import moment from 'moment'
import styles from './index.module.scss'
import { IPrescription } from './graphql/variables'
import VisibilityIcon from '@mui/icons-material/Visibility'
type handle = {
  openButtonDialog: boolean
  setOpenButtonDialog: any
  totalPrice: number
  data: any
  dataPayment: any
}
type ICk = {
  priceCK: number
  ck: number
  status: string
}
const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Id',
    minWidth: 300,
    editable: true,
    renderCell: params => (
      <div className={styles.id}>
        <div>
          <span>{params.row.id}</span>
        </div>
      </div>
    )
  },
  {
    field: 'patName',
    headerName: 'Tên khách hàng',
    minWidth: 300,
    editable: true,
    renderCell: params => (
      <div className={styles.id}>
        <div>
          <span>{params.row?.name}</span>
        </div>
      </div>
    )
  },
  {
    field: 'phone',
    headerName: 'Số điện thoại',
    minWidth: 150,
    editable: true,
    renderCell: params => (
      <div className={styles.id}>
        <div>
          <span>{params.row?.phone}</span>
        </div>
      </div>
    )
  },
  {
    field: 'cccd',
    headerName: 'CCCD',
    minWidth: 180,
    editable: true,
    renderCell: params => (
      <div className={styles.id}>
        <div>
          <span>{params.row?.patCccd}</span>
        </div>
      </div>
    )
  },
  {
    field: 'email',
    headerName: 'Email',
    minWidth: 200,
    editable: true,
    renderCell: params => (
      <div className={styles.id}>
        <div>
          <span>{params.row?.email}</span>
        </div>
      </div>
    )
  }
]

type RequestType = {
  keySearch: string
  skip: number
  take: number
}

export default function PatientDialog({ openButtonDialog, setOpenButtonDialog, dataPayment, data }: handle) {
  const { handleSubmit, control } = useForm()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [keySearch, setKeySearch] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState<RequestType>({
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  const {
    data: dataPatient,
    refetch,
    loading
  } = useQuery(GET_PATEINT, {
    variables: queryVariables
  })

  const getDataPatient: any[] = useMemo(() => {
    return dataPatient?.getPatient?.items ?? []
  }, [dataPatient])
  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        or: [
          { id: { contains: searchData.keySearch } },
          {
            name: { contains: searchData.keySearch }
          },
          {
            patCccd: { contains: searchData.keySearch }
          },
          {
            phone: { contains: searchData.keySearch }
          },
          {
            email: { contains: searchData.keySearch }
          }
        ]
      }
    }))
  }, [searchData, paginationModel])

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleCheckboxChange = (event: any, item: any) => {
    if (event.target.checked) {
      setSelectedItem(item)
    } else {
      setSelectedItem(null)
    }
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  const clearSearch = () => {
    setQueryVariables({
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setSearchData({
      keySearch: '',
      skip: 0,
      take: paginationModel.pageSize
    })
    setKeySearch('')
  }

  return (
    <MUIDialog maxWidth='lg' open={[openButtonDialog, setOpenButtonDialog]} title='Thông tin khách hàng'>
      <>
        <Box p={5} sx={{ width: '100%', typography: 'body1' }}>
          <Controller
            name='selectedPatient'
            control={control}
            render={({ field }) => (
              <Grid container display='flex' flexDirection='column'>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={6}>
                    <Grid container gap={2}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          label='Từ khoá tìm kiếm'
                          autoComplete='off'
                          placeholder='Nhập từ khoá tìm kiếm'
                          value={keySearch}
                          onChange={e => {
                            setKeySearch(e.target.value)
                          }}
                          onBlur={e => handleChangeSearch('keySearch', e.target.value)}
                        />
                      </Grid>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          handleSearch()
                        }}
                      >
                        <Icon icon='bx:search' fontSize={24} />
                      </Button>
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                          clearSearch()
                        }}
                      >
                        <Icon icon='bx:revision' fontSize={24} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} sx={{ mt: 10 }}>
                  <DataGrid
                    rows={getDataPatient.map((item, index) => ({
                      ...item,
                      index: index + 1 + paginationModel.page * paginationModel.pageSize
                    }))}
                    columns={columns}
                    rowCount={dataPatient?.getPatient.totalCount ?? 0}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode='server'
                    loading={loading}
                    slots={{
                      noRowsOverlay: () => (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            height: '300px'
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
                    style={{ maxHeight: 400, height: '60vh', cursor: 'pointer' }}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection: any) => {
                      if (newSelection.length > 1) {
                        newSelection = newSelection.slice(-1)
                      }
                      setSelectedItem(getDataPatient.filter(item => item.id === newSelection[0]))
                    }}
                    rowSelectionModel={selectedItem?.map((item: any) => item.id)}
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
            onClick={() => {
              if (selectedItem) {
                const { prescription } = dataPayment
                data({
                  prescription,
                  user: selectedItem
                })
                setOpenButtonDialog(false)
              }
            }}
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
}
