import { useMutation, useQuery } from '@apollo/client'
import { Button, CardContent, Grid, IconButton, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { GET_COMMODITY_GROUP } from '../graphql/query'
import { dialogType } from '..'
import AddProductGroup from '../../dialog/AddProductGroup'
import MUIDialog from 'src/@core/components/dialog'
import styles from '../index.module.scss'
import { UPDATE_PRODUCT_GROUP } from '../graphql/mutation'

function ProductGroup() {
  const [queryVariables, setQueryVariables] = useState<any>()
  const [showAddProductGroup, setShowAddProductGroup] = useState(false)
  const [updateDataGroup, setUpdateDataGroup] = useState<any>({}) // Dữ liệu cập nhật product group
  const [keySearch, setKeySearch] = useState('')
  const [commoditiesData, setCommoditiesData] = useState({})

  const open = useState(false)

  const { data, loading, error, refetch } = useQuery(GET_COMMODITY_GROUP, { variables: queryVariables })

  const [
    updateDataProductGroup,
    { data: updateProductGroup, loading: updateProductGroupLoading, error: updateProductGroupError }
  ] = useMutation(UPDATE_PRODUCT_GROUP)

  const commoditiesDataGroup: any[] = useMemo(() => {
    return data?.getCommodityGroup?.items ?? []
  }, [data])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  const [searchData, setSearchData] = useState({
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })

  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  const handleClearSearch = () => {
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

  const COLUMN_DEF: GridColDef[] = [
    {
      field: '#',
      headerName: 'STT',
      minWidth: 100,
      renderCell: params => {
        return <div>{params.row.index}</div>
      }
    },
    {
      field: 'name',
      headerName: 'Tên Nhóm',
      minWidth: 350,
      renderCell: params => (
        <div>
          <div>
            <span>{params.row.name}</span>
          </div>
        </div>
      )
    },
    {
      field: 'note',
      headerName: 'Ghi Chú',
      minWidth: 200,
      renderCell: params => (
        <div>
          <div>
            <span>{params.row.note}</span>
          </div>
        </div>
      )
    },
    {
      field: 'deleteYn',
      headerName: 'Trạng Thái',
      minWidth: 200,
      renderCell: params => {
        if (params.row.deleteYn) {
          return <span className={styles.statusPause}>Tạm Dừng</span>
        } else {
          return <span className={styles.statusActive}>Hoạt Động</span>
        }
      }
    },
    {
      field: 'thaotac',
      headerName: 'Thao Tác',
      minWidth: 350,
      renderCell: params => (
        <div>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              handleOpenUpdateDataGroup(params.row)
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

  useEffect(() => {
    const updatedQueryVariables = {
      input: {
        or: [
          { name: { contains: searchData.keySearch } },
          { id: { contains: searchData.keySearch } },
          { note: { contains: searchData.keySearch } }
        ]
      }
    }

    setQueryVariables(updatedQueryVariables)
  }, [searchData, paginationModel])

  useEffect(() => {
    refetch({ variables: queryVariables })
  }, [refetch, queryVariables])

  const handleOpenUpdateDataGroup = (data: any) => {
    setUpdateDataGroup(data)
    setShowAddProductGroup(true)
    dialogType.value = 'update'
    open[1](true)
  }
  const handleCloseAddProductGroup = () => {
    setShowAddProductGroup(false)
  }
  const handleDelete = async (id: any) => {
    const inputData = {
      id: id,
      deleteYn: true
    }

    // Xác nhận xóa
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        // Gọi mutation
        await updateDataProductGroup({
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
    <>
      <CardContent sx={{ display: 'flex', width: '50rem' }}>
        <TextField
          label='Từ khoá tìm kiếm'
          placeholder='Nhập từ khoá tìm kiếm'
          variant='outlined'
          fullWidth
          multiline
          InputLabelProps={{ shrink: true }}
          value={keySearch}
          onChange={(e: any) => {
            setKeySearch(e.target.value)
          }}
          onBlur={(e: any) => handleChangeSearch('keySearch', e.target.value)}
        />
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            style={{ height: '3.5rem', borderRadius: 0 }}
            onClick={() => {
              handleSearch()
            }}
          >
            <Icon icon='bx:search' fontSize={28} />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='secondary'
            style={{ height: '3.5rem', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={() => {
              handleClearSearch()
            }}
          >
            <Icon icon='bx:revision' fontSize={28} />
          </Button>
        </Grid>
      </CardContent>
      <DataGrid
        columns={COLUMN_DEF}
        rows={commoditiesDataGroup.map((item, index) => ({
          ...item,
          index: index + 1 + paginationModel.page * paginationModel.pageSize
        }))}
        rowCount={data?.getCommodityGroup?.totalCount ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode='server'
        loading={loading}
        checkboxSelection
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
        style={{ minHeight: 300, height: '60vh' }}
      />
      {/* Hiển thị AddProductGroup*/}
      <MUIDialog
        open={[showAddProductGroup, setShowAddProductGroup]}
        onClose={handleCloseAddProductGroup}
        maxWidth='xs'
        title={dialogType.value === 'add' ? 'Thêm mới Nhóm Hàng hóa' : 'Cập nhật nhóm hàng hóa'}
      >
        {updateDataGroup && (
          <AddProductGroup data={updateDataGroup} open={[showAddProductGroup, setShowAddProductGroup]} />
        )}
      </MUIDialog>
    </>
  )
}

export default ProductGroup
