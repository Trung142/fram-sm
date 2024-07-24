import MuiDialogContent from './components/diaglogContent'
import Icon from 'src/@core/components/icon'
import { Box, Button, TextField, Stack, IconButton } from '@mui/material'
import { GreyDataGrid } from './components/custom-mui-component'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState, ChangeEvent } from 'react'
import { GET_SERVICE_QUERY } from './graphql/query'
import { useMutation, useQuery } from '@apollo/client'
import MUIDialog from 'src/@core/components/dialog'
import UpdateServiceGroup from './update-service-group'
import { UPDATE_SERVICE_GROUP } from './graphql/mutation'
import toast from 'react-hot-toast'

type ServiceGroupProps = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

type RequestType = {
  skip: number
  take: number
  serviceTypeId: string
  serviceGroupId: string
  keySearch: string
}

const ServiceGroup = (props: ServiceGroupProps) => {
  const { onSubmit, open } = props
  const [show, setShow] = useMemo(() => open, [open])
  const [dialogType, setDialogType] = useState<any>()
  const openSG = useState(false)
  const [SGdata, setSGdata] = useState<any>()

  const handleOpenUpdate = (data: any) => {
    openSG[1](true)
    setSGdata(data)
    setDialogType('update')
  }

  const handleOpenAddSG = () => {
    openSG[1](true)
    setDialogType('add')
    setSGdata({})
  }

  const [searchData, setSearchData] = useState<RequestType>({
    skip: 0,
    take: 0,
    serviceTypeId: '',
    serviceGroupId: '',
    keySearch: ''
  })

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  //lấy data
  const { data, loading, error, refetch } = useQuery(GET_SERVICE_QUERY, {
    variables: queryVariables
  })

  //mutation
  const [updateServiceGroup] = useMutation(UPDATE_SERVICE_GROUP)

  const serviceGroupValue = useMemo(() => data?.getService?.items ?? [], [data])

  const [keySearch, setKeySearch] = useState('')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  //function
  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  const handleChangeSearchKey = (e: ChangeEvent<HTMLInputElement>) => {
    setKeySearch(e.target.value)
  }

  const handleSearch = () => {
    refetch({ variables: queryVariables })
  }

  const handleClose = () => {
    setShow(false)
  }

  const handleDeleteServiceGroup = (data: any) => {
    updateServiceGroup({
      variables: {
        input: JSON.stringify({
          id: data?.serviceGroup?.id,
          deleteYn: true
        })
      },
      onError: () => toast.error('Lỗi Khi Xóa'),
      onCompleted: async () => {
        toast.success('Xóa Thành Công')
        await refetch({ variables: queryVariables })
      }
    })
  }

  const submit = useCallback(() => {
    setShow(false)
  }, [setShow])

  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        /*serviceTypeId: searchData.serviceTypeId ? { eq: searchData.serviceTypeId } : undefined,
        serviceGroupId: searchData.serviceGroupId ? { eq: searchData.serviceGroupId } : undefined,*/
        serviceGroup: { deleteYn: { eq: false } },
        or: [
          { serviceType: { name: { contains: searchData.keySearch } } },
          { serviceGroup: { name: { contains: searchData.keySearch } } }
        ]
      }
    }))
  }, [searchData, paginationModel])
  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 105,
      field: 'index',
      headerName: '#',
      maxWidth: 110
    },

    {
      flex: 0.25,
      minWidth: 306,
      field: 'serviceGroup.name',
      headerName: 'Tên nhóm',
      maxWidth: 310,
      valueGetter: params => params?.row?.serviceGroup?.name
    },
    {
      flex: 0.25,
      minWidth: 415,
      field: 'serviceType.label',
      headerName: 'Loại dịch vụ',
      valueGetter: params => params?.row?.serviceType?.label
    },
    {
      flex: 0.25,
      minWidth: 324,
      field: 'note',
      headerName: 'Ghi chú',
      maxWidth: 330
    },
    {
      flex: 0.15,
      minWidth: 181,
      field: '',
      headerName: 'Thao tác',
      maxWidth: 190,
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              handleOpenUpdate(params.row)
            }}
          >
            <Icon icon='bx:edit-alt' color='blue' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton
            title='Xoá'
            onClick={() => {
              handleDeleteServiceGroup(params.row)
            }}
          >
            <Icon icon='bx:trash' color='red' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]
  return (
    <MuiDialogContent onClose={handleClose} onSubmit={submit}>
      <>
        <Stack alignItems='flex-end'>
          <Button variant='contained' startIcon={<Icon icon='bx:plus' />} onClick={handleOpenAddSG}>
            Thêm mới
          </Button>
        </Stack>
        <Stack direction='row'>
          <TextField
            label='Từ khoá tìm kiếm'
            autoComplete='off'
            placeholder='Nhập từ khoá tìm kiếm'
            value={keySearch}
            onChange={handleChangeSearchKey}
            onBlur={e => handleChangeSearch('keySearch', e.target.value)}
          />
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
              // clearSearch()
            }}
          >
            <Icon icon='bx:revision' fontSize={24} />
          </Button>
        </Stack>
        <Box marginTop={6}>
          <GreyDataGrid
            columns={COLUMN_DEF}
            style={{ minHeight: 500, height: '60vh' }}
            paginationMode='server'
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={serviceGroupValue.map((item: any, index: any) => ({
              ...item,
              index: index + 1 + paginationModel.page * paginationModel.pageSize
            }))}
            rowCount={data?.getService?.totalCount ?? 0}
            loading={loading}
            slots={{
              noRowsOverlay: () => (
                <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
              )
            }}
          />
        </Box>
        <MUIDialog
          maxWidth='sm'
          open={openSG}
          title={dialogType === 'add' ? 'Thêm mới nhóm dịch vụ' : 'Cập nhật dịch vụ'}
        >
          <UpdateServiceGroup open={openSG} onSubmit={handleSearch} dialogType={dialogType} data={SGdata} />
        </MUIDialog>
      </>
    </MuiDialogContent>
  )
}

export default ServiceGroup
