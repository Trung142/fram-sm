import React, { startTransition, useEffect, useMemo, useState } from 'react'
import {
  TextField,
  CardContent,
  CardHeader,
  Card,
  Grid,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Fade,
  Autocomplete
} from '@mui/material'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// import styles
import styles from './index.module.scss'

// ** GraphQL
import { useMutation, useQuery } from '@apollo/client'
import { GET_COMMODITY, GET_COMMODITY_GROUP, GET_PRODUCT, GET_WAREHOUSE_TYPE, GET_UNIT } from './graphql/query'

import MUIDialog from 'src/@core/components/dialog'

import { signal } from '@preact/signals'
import AddProduct from '../dialog/AddProduct'
import AddProductGroup from '../dialog/AddProductGroup'
import ProductGroup from './table/ProductGroup'
import { ADD_PRODUCT, UPDATE_PRODUCT } from './graphql/mutation'
import { log } from 'console'

type ProductType = {
  productTypeId: string | null
  productGroupId: string | null
  warehouseTypeId: string | null
  keySearch: string
  status: boolean | null
  skip: number
  take: number
}

type ValueOption = {
  id?: string
  label: string
}
export const dialogType = signal<'add' | 'update'>('add')
function ResSystem() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = useState(false)
  const [updateData, setUpdateData] = useState<any>({}) // Dữ liệu cập nhật hàng hóa
  const [updateDataGroup, setUpdateDataGroup] = useState<any>({}) // Dữ liệu cập nhật product group

  // State hiển thị dialog
  const isDialogAdd = useState(false)
  const isDialogAll = useState(false)

  // Tham số tìm kiếm
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  const [searchData, setSearchData] = useState<ProductType>({
    productTypeId: '',
    productGroupId: '',
    warehouseTypeId: '',
    keySearch: '',
    status: null,
    skip: 0,
    take: paginationModel.pageSize
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  const productStatus = [
    {
      id: false,
      label: 'Hoạt động'
    },
    {
      id: true,
      label: 'Tạm dừng'
    }
  ]
  const [keySearch, setKeySearch] = useState('')

  const open1 = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseAll = () => {
    isDialogAll[1](true)
    setAnchorEl(null)
  }

  // Lấy dữ liễu
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: queryVariables
  })

  const {
    loading: commodityGroupLoading,
    error: commodityGroupError,
    data: commodityGroupData,
    fetchMore: fetchMoreCommodityGroup
  } = useQuery(GET_COMMODITY_GROUP, {
    variables: { input: {}, skip: 0, take: 100 }
  })
  const [updateProduct] = useMutation(UPDATE_PRODUCT)

  // Danh sách dữ liệu
  const { data: commodities } = useQuery(GET_COMMODITY)
  const { data: commoditiesGroup } = useQuery(GET_COMMODITY_GROUP)
  const { data: warehouseType } = useQuery(GET_WAREHOUSE_TYPE)
  const { data: product } = useQuery(GET_PRODUCT)
  const { data: unit } = useQuery(GET_UNIT)

  const commoditiesData: any[] = useMemo(() => {
    return commodities?.getCommodity.items ?? []
  }, [commodities])

  const commoditiesDataGroup: any[] = useMemo(() => {
    return commodityGroupData?.getCommodityGroup.items ?? []
  }, [commodityGroupData])

  const warehouseTypeData: any[] = useMemo(() => {
    return warehouseType?.getWarehouseType.items ?? []
  }, [warehouseType])

  const unitData: any[] = useMemo(() => {
    return unit?.getUnit.items ?? []
  }, [unit])

  const productListData: any[] = useMemo(() => {
    return data?.getProduct.items ?? []
  }, [data])

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'STT',
      minWidth: 10,
      renderCell: (params: { row: { index?: number } }) => {
        const { index } = params.row
        return <div>{index}</div>
      }
    },
    {
      field: 'id',
      headerName: 'Mã Hàng',
      minWidth: 200,
      renderCell: params => <span>{params.row.id}</span>
    },
    {
      field: 'productName',
      headerName: 'Tên Hàng Hoá',
      minWidth: 200,
      renderCell: param => {
        return <span>{param.row.productName}</span>
      }
    },
    {
      field: 'commodityGroup',
      headerName: 'Nhóm Hàng Hoá',
      minWidth: 150,
      renderCell: params => (
        <span>{commoditiesDataGroup.find(item => item.id === params.row.commodityGroupId)?.name}</span>
      )
    },
    {
      field: 'unit',
      headerName: 'Đơn Vị',
      minWidth: 100,
      renderCell: params => (
        <div>
          <div>
            <span>{unitData.find(item => item.id === params.row.unitId)?.label}</span>
          </div>
        </div>
      )
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      minWidth: 100,
      renderCell: params => (
        <div>
          <div>
            <span>{params.row.price}</span>
          </div>
        </div>
      )
    },
    { field: 'Tonkho', headerName: 'Tồn kho', width: 80 },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'stopYn',
      headerName: 'Trạng thái',
      renderCell: params => {
        if (params.row.stopYn) {
          return <span className={styles.statusPause}>Tạm Dừng</span>
        } else {
          return <span className={styles.statusActive}>Hoạt Động</span>
        }
      }
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 100,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              handleOpenUpdate(params.row)
            }}
          >
            <Icon icon='bx:pencil' fontSize={20} style={{ marginRight: 5, color: '#6062E8' }} />
          </IconButton>
          <IconButton
            title='Xoá'
            onClick={() => {
              handleDelete(params.row.id)
            }}
          >
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5, color: 'red' }} type='solid' />
          </IconButton>
        </div>
      )
    }
  ]

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  useEffect(() => {
    const updatedQueryVariables = {
      input: {
        commoditiesId: searchData.productTypeId ? { eq: searchData.productTypeId } : undefined,
        commodityGroupId: searchData.productGroupId ? { eq: searchData.productGroupId } : undefined,
        stopYn: searchData.status !== null && searchData.status !== undefined ? { eq: searchData.status } : undefined,
        or: [
          { productName: { contains: searchData.keySearch } },
          { id: { contains: searchData.keySearch } },
          {
            commodityGroup: {
              name: { contains: searchData.keySearch }
            }
          },
          {
            unit: {
              name: { contains: searchData.keySearch }
            }
          }
        ]
      }
    }

    setQueryVariables(updatedQueryVariables)
  }, [searchData, paginationModel])

  useEffect(() => {
    refetch({ variables: queryVariables })
  }, [refetch, queryVariables])

  const handleClearSearch = () => {
    setQueryVariables({
      productTypeId: null,
      productGroupId: null,
      warehouseTypeId: null,
      keySearch: null,
      status: null,
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setSearchData({
      productTypeId: null,
      productGroupId: null,
      warehouseTypeId: null,
      keySearch: '',
      status: null,
      skip: 0,
      take: paginationModel.pageSize
    })
    setKeySearch('')
  }

  const handleOpenAdd = () => {
    setUpdateData(true)
    dialogType.value = 'add'
    open[1](true)
  }

  const handleOpenUpdate = (data: any) => {
    setUpdateData(data)
    dialogType.value = 'update'
    open[1](true)
  }

  const handleOpenAddDataGroup = () => {
    setUpdateDataGroup(true)
    dialogType.value = 'add'
    isDialogAdd[1](true)
    handleClose()
  }

  const handleDelete = async (id: any) => {
    const inputData = {
      id: id,
      stopYn: true
    }

    // Xác nhận xóa
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        // Gọi mutation
        await updateProduct({
          variables: {
            input: JSON.stringify(inputData)
          }
        })
        // Sau khi xóa thành công
        refetch()
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error)
      }
    }
  }

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent>
            <CardHeader
              title='Hàng Hoá'
              action={
                <div>
                  <Button color='primary' variant='contained' onClick={() => handleOpenAdd()}>
                    <Icon icon='bx:bx-plus' fontSize={20} />
                    Thêm Mới
                  </Button>
                  <Button
                    variant='contained'
                    color='success'
                    id='fade-button'
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{ marginLeft: '0.3rem', marginRight: '0.3rem' }}
                  >
                    <Icon icon='bx:bx-chevron-down' fontSize={20} />
                    Nhóm Hàng Hoá
                  </Button>
                  <Menu
                    id='fade-menu'
                    MenuListProps={{
                      'aria-labelledby': 'fade-button'
                    }}
                    anchorEl={anchorEl}
                    open={open1}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                  >
                    <MenuItem
                      onClick={() => {
                        handleOpenAddDataGroup()
                      }}
                    >
                      <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                      Thêm Mới
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseAll()
                      }}
                    >
                      <Icon icon='bx:bx-file' fontSize={20} style={{ marginRight: 5 }} />
                      Danh Sách
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Icon icon='bx:bx-cloud-upload' fontSize={20} style={{ marginRight: 5 }} />
                      Xuất Excel
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Icon icon='bx:bx-cloud-download' fontSize={20} style={{ marginRight: 5 }} />
                      Nhập Excel
                    </MenuItem>
                  </Menu>
                  <Button
                    variant='outlined'
                    sx={{ backgroundColor: 'white', borderTopRightRadius: 0, width: 172, height: 42 }}
                    endIcon={<Icon icon='bx:bx-chevron-down' fontSize={20} style={{ marginRight: 5 }} />}
                  >
                    Tiện ích
                  </Button>
                </div>
              }
            />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={6} md={2}>
                  <Autocomplete
                    fullWidth
                    options={commoditiesData}
                    getOptionLabel={option => option.name}
                    value={
                      commoditiesData.find((productType: any) => productType?.id === searchData.productTypeId) ?? null
                    }
                    onChange={(e, value: ValueOption) => handleChangeSearch('productTypeId', value?.id)}
                    renderInput={params => <TextField {...params} label='Loại Hàng Hóa' />}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <Autocomplete
                    fullWidth
                    options={commoditiesDataGroup}
                    getOptionLabel={option => option.name}
                    value={
                      commoditiesDataGroup.find(
                        (productGroup: any) => productGroup?.id === searchData?.productGroupId
                      ) ?? null
                    }
                    onChange={(e, value: ValueOption) => handleChangeSearch('productGroupId', value?.id)}
                    renderInput={params => <TextField {...params} label='Nhóm Sản Phẩm' />}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    options={warehouseTypeData}
                    getOptionLabel={option => option.name}
                    value={
                      warehouseTypeData.find(
                        (warehouseType: any) => warehouseType.id === searchData?.warehouseTypeId
                      ) ?? null
                    }
                    onChange={(e, value: ValueOption) => handleChangeSearch('warehouseTypeId', value?.id)}
                    renderInput={params => <TextField {...params} label='Kho' />}
                  />
                </Grid>
                <Grid item xs={4} md={2}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    options={productStatus}
                    getOptionLabel={option => option.label}
                    value={productStatus.find((productStatus: any) => productStatus.id === searchData?.status) ?? null}
                    onChange={(e, value: any) => handleChangeSearch('status', value?.id)}
                    renderInput={params => <TextField {...params} label='Chọn trạng thái' />}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label='Từ khoá tìm kiếm'
                        autoComplete='off'
                        placeholder='Nhập từ khoá tìm kiếm'
                        value={keySearch}
                        onChange={(e: any) => {
                          setKeySearch(e.target.value)
                        }}
                        onBlur={(e: any) => handleChangeSearch('keySearch', e.target.value)}
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
                        handleClearSearch()
                      }}
                    >
                      <Icon icon='bx:revision' fontSize={24} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Grid container>
                <Grid item xs={12}>
                  <DataGrid
                    columns={columns}
                    rows={productListData.map((item, rowIndex) => ({
                      ...item,
                      index: rowIndex + 1 + paginationModel.page * paginationModel.pageSize
                    }))}
                    rowCount={data?.getProduct?.totalCount ?? 0}
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
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 2 }
                      }
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    style={{ minHeight: 300, height: '60vh' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* dialog add form */}
      <MUIDialog
        open={open}
        maxWidth={false}
        title={dialogType.value === 'add' ? 'Thêm mới Hàng hóa' : 'Cập nhật thông tin hàng hóa'}
      >
        <AddProduct open={open} data={updateData} />
      </MUIDialog>
      {/* dialog add new group form */}
      <MUIDialog
        open={isDialogAdd}
        title={dialogType.value === 'add' ? 'Thêm mới Nhóm Hàng hóa' : 'Cập nhật thông tin nhóm hàng hóa'}
        maxWidth='xs'
      >
        <AddProductGroup open={isDialogAdd} />
      </MUIDialog>
      {/* dialog display all */}
      <MUIDialog open={isDialogAll} title='Danh sách nhóm hàng hoá' maxWidth='lg'>
        {/*  */}
        <ProductGroup />
      </MUIDialog>
      {/* dialog edit */}
    </Grid>
  )
}

export default ResSystem
