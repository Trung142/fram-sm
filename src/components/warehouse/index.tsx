import React, { useEffect, useMemo, useState } from 'react'
import Icon from 'src/@core/components/icon'

// ** Import MUI
import { Button, Card, CardContent, CardHeader, Grid, IconButton, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Import Variables
import { RequestType, WareHouseType } from './graphql/variables'

// ** Import Graphql
import { GET_WAREHOUSE } from './graphql/query'
import { UPDATE_WAREHOUSE } from './graphql/mutation'

import { useMutation, useQuery } from '@apollo/client'
import UpdateWareHouse from './updateWareHouse'
import MUIDialog from 'src/@core/components/dialog'
import { getLocalstorage } from 'src/utils/localStorageSide'

const dataUs = getLocalstorage('userData')

const WareHouse = () => {
  const openUpdateWH = useState(false)
  const [dialogType, setDialogType] = useState('')
  const [updateData, setUpdateData] = useState<WareHouseType>({
    name: '',
    warehouseTypeId: '',
    phone: '',
    email: '',
    address: '',
    clinicId: dataUs.clinicId,
    parentClinicId: dataUs.parentClinicId,
    deleteYn: false
  })
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  const initialSearchData = {
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  }
  const [searchData, setSearchData] = useState<RequestType>(initialSearchData)
  const [keySearch, setKeySearch] = useState('')

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  //lấy data
  const {
    data: dataWareHouse,
    loading: loadingWareHouse,
    refetch: refetchWareHouse
  } = useQuery(GET_WAREHOUSE, {
    variables: queryVariables
  })

  //mutation
  const [updateWareHouse] = useMutation(UPDATE_WAREHOUSE)

  const wareHouse = useMemo(() => dataWareHouse?.getWarehouse.items ?? [], [dataWareHouse])

  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        deleteYn: { eq: false },
        or: [{ id: { contains: searchData.keySearch } }, { name: { contains: searchData.keySearch } }]
      }
    }))
  }, [searchData, paginationModel])

  useEffect(() => {
    refetchWareHouse({ variables: queryVariables })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryVariables])

  const COLUMN_WAREHOUSE: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'id',
      headerName: 'Mã Kho'
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'name',
      headerName: 'Tên Kho'
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'clinic.name',
      headerName: 'Chi Nhánh',
      valueGetter: params => params.row.clinic.name
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'warehouseType.name',
      headerName: 'STT',
      valueGetter: params => params.row.warehouseType.name
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 200,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              handleUpdateWareHouse(params.row)
            }}
          >
            <Icon icon='bx:edit' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton
            title='Xoá'
            onClick={() => {
              handleDelete(params.row)
            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]

  const handleOpenAddWareHouse = () => {
    openUpdateWH[1](true)
    setUpdateData({
      email: '',
      name: '',
      phone: '',
      address: '',
      warehouseTypeId: '',
      clinicId: dataUs.clinicId,
      parentClinicId: dataUs.parentClinicId,
      deleteYn: false
    })
    setDialogType('add')
  }

  const handleUpdateWareHouse = (data: any) => {
    openUpdateWH[1](true)
    setUpdateData({
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      address: data.address,
      warehouseTypeId: data.warehouseTypeId,
      clinicId: data.clinicId,
      parentClinicId: data.parentClinicId,
      deleteYn: data.deleteYn
    })
    setDialogType('update')
  }

  const handleChangeSearchKey = (key: any, value: string) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleDelete = (data: any) => {
    updateWareHouse({
      variables: {
        input: JSON.stringify({
          id: data.id,
          deleteYn: true
        })
      }
    }).then(refetchWareHouse)
  }

  const handleSearch = () => {
    refetchWareHouse({ variables: queryVariables })
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
    setKeySearch('')
  }

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader
            title='Kho Hàng'
            action={
              <Button
                variant='contained'
                color='primary'
                sx={{ pl: 5, pr: 8 }}
                onClick={() => handleOpenAddWareHouse()}
              >
                <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                Thêm mới
              </Button>
            }
          />
          <CardContent>
            <Grid container>
              <Grid item xs={12} md={6.5}>
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
                      onBlur={e => handleChangeSearchKey('keySearch', e.target.value)}
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            {
              <DataGrid
                columns={COLUMN_WAREHOUSE}
                rows={wareHouse.map((item: any, index: any) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                rowCount={5}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='server'
                loading={loadingWareHouse}
                slots={{
                  noRowsOverlay: () => (
                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                  )
                }}
                style={{ minHeight: 500, height: '60vh' }}
              />
            }
          </CardContent>
        </Card>
      </Grid>
      <MUIDialog
        maxWidth='lg'
        open={openUpdateWH}
        title={dialogType === 'update' ? 'Cập Nhật Thông Tin Kho' : 'Thêm Mới Kho'}
      >
        <UpdateWareHouse open={openUpdateWH} data={updateData} dialogType={dialogType} onSubmit={handleSearch} />
      </MUIDialog>
    </Grid>
  )
}

export default WareHouse
