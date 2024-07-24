import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  Stack,
  Tab,
  TextField,
  Typography
} from '@mui/material'
import React, { ChangeEvent, useEffect, useMemo, useState, useTransition } from 'react'
import styles from './styles.module.scss'
// ====Icon
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { useRouter } from 'next/router'
// ====GraphQL
import { useQuery } from '@apollo/client'
import { GET_RES_EXAM_SERVICE } from './graphql/query'
import { getGender, statusMapping } from 'src/utils/common'
import { signal } from '@preact/signals'
import { ResExamServiceDtInput } from './graphql/variables'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

type RequestType = {
  resExamServiceDtId: string
  resExamServiceProcId: string
  fromDate: Date | null
  toDate: Date | null
  statusId: boolean | null
  skip: number
  take: number
  keySearch: string
}
type IQueryVariables = {
  skip: number
  take: number
  input: {
    service?: { eq: string }
    resExamServiceDtId?: { eq: string }
    resExamServiceProcId?: { eq: string }
    keySearch?: { eq: string }
    statusId?: { eq: boolean }
  }
}
type IOnChangeValue = {
  id?: string
  label: string
}
export const data = signal<ResExamServiceDtInput>({})
export const dialogType = signal<'add' | 'update'>('add')

const renderPatInfo = (params: any) => {
  const name = params.row?.resExam.patName
  const age = params.row?.resExam.age
  const gender = params.row?.resExam.gender
  const year = params.row?.resExam.year
  return (
    <div className='flex flex-col'>
      <span>{name}</span>
      <div className='text-xs text-gray-500'>
        {year} - {getGender(gender)} - {age} tuổi
      </div>
    </div>
  )
}

const XetNghiem = () => {
  const router = useRouter()
  // =======================Use State===========================
  const [updateData, setUpdateData] = useState<any>({})
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [keySearch, setKeySearch] = useState('')
  const [isPending, startTransition] = useTransition()
  const statusGroup = [
    {
      id: '1000_100',
      statusName: 'Chờ Thực hiện'
    },
    {
      id: '1000_102',
      statusName: 'Đang thực hiện'
    },
    {
      id: '1000_104',
      statusName: 'Hoàn thành'
    },
    {
      id: '1000_106',
      statusName: 'Chờ hoàn thành'
    },
    {
      id: '1000_105',
      statusName: 'Hủy phiếu'
    }
  ]

  const initialSearchData = {
    resExamServiceDtId: '',
    resExamServiceProcId: '',
    fromDate: new Date(),
    toDate: new Date(),
    keySearch: '',
    statusId: null,
    skip: 0,
    take: paginationModel.pageSize
  }
  const [searchData, setSearchData] = useState<RequestType>(initialSearchData)
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

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
  const clearSearch = () => {
    setSearchData(initialSearchData)
    setQueryVariables({
      input: {},
      skip: 0,
      take: paginationModel.pageSize
    })
    setPaginationModel({
      ...paginationModel,
      page: 0
    })
    setKeySearch('')
  }
  //============================Data Search========================
  const {
    data: resExamServiceData,
    loading,
    error,
    refetch
  } = useQuery(GET_RES_EXAM_SERVICE, {
    variables: queryVariables
  })
  // ===========================get Data=====================
  const resExamService = useMemo(() => resExamServiceData?.getResExamServiceDt.items ?? [], [resExamServiceData])

  const COLUMN_DEF: GridColDef[] = [
    {
      flex: 0.01,
      minWidth: 80,
      field: 'index',
      headerName: 'STT'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'id',
      headerName: 'Mã Phiếu',
      renderCell: params => (
        <div className={styles.id}>
          <div>
            <span>{params.value}</span>
          </div>
          <div>
            <span>{moment(params.row?.createAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>
      )
    },
    {
      flex: 0.2,
      minWidth: 255,
      field: 'patName',
      headerName: 'Họ Tên',
      renderCell: renderPatInfo
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'stt',
      headerName: 'Số khám',
      renderCell: (params: any) => {
        const index = params.row?.resExam.id
        return <div>{index}</div>
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'name',
      headerName: 'Dịch vụ',
      renderCell: (params: any) => {
        return (
          <div>
            <span>{params.row?.service.name}</span>
          </div>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'resExamServiceProc.implementerDoctorId',
      headerName: 'Người thực hiện',
      renderCell: (params: any) => {
        return (
          <div>
            <span>
              {params.row?.resExam?.doctor?.fristName} {params.row?.resExam?.doctor?.lastName}
            </span>
          </div>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'status',
      headerName: 'Trạng thái',
      renderCell: (params: any) => {
        if (params.row.status === '1000_100') {
          return <span className={styles.statusWaiting}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '1000_102') {
          return <span className={styles.statusExaming}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '1000_106') {
          return <span className={styles.statusPending}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '1000_104') {
          return <span className={styles.statusComplete}>{params.row.statusNavigation.name}</span>
        } else if (params.row.status === '1000_105') {
          return <span className={styles.statusCancel}>{params.row.statusNavigation.name}</span>
        } else {
          return ''
        }
      }
    },
    {
      flex: 0.02,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: params => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'
            onClick={() => {
              router.push(`/subclinical/disease-test/disease-update/${params.row?.id}`)
            }}
          >
            <Icon icon='bx:edit' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton title='Xoá'>
            <Icon icon='bx:dots-horizontal-rounded' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]
  useEffect(() => {
    setQueryVariables((prev: any) => ({
      ...prev,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        service: { serviceTypeId: { eq: 'SRT00016' } },
        resExamServiceDtId: searchData.resExamServiceDtId ? { eq: searchData.resExamServiceDtId } : undefined,
        resExamServiceProcId: searchData.resExamServiceProcId ? { eq: searchData.resExamServiceProcId } : undefined,
        createAt: {
          gte: searchData.fromDate,
          lte: searchData.toDate
        },
        status:
          searchData.statusId || typeof searchData.statusId === 'boolean'
            ? { eq: Boolean(+searchData.statusId) }
            : undefined
      }
    }))
  }, [searchData, paginationModel])
  // ==============================================

  console.log(queryVariables)

  return (
    <Grid container>
      <Card sx={{ width: '100%', padding: 5 }}>
        <Grid item xs={12} mb={8}>
          <Typography
            variant='h4'
            pl={'48px'}
            sx={{ fontWeight: 500, lineHeight: '40px', color: '#000000', letterSpacing: '0.25px' }}
          >
            XÉT NGHIỆM
          </Typography>
        </Grid>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={2}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <ReactDatePicker
                selected={searchData.fromDate}
                autoComplete='true'
                dateFormat={'dd/MM/yyyy'}
                customInput={
                  <TextField
                    fullWidth
                    label='Từ ngày'
                    placeholder='dd/mm/yyyy'
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton>
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                }
                onChange={(date: Date) => handleChangeSearch('fromDate', date)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={2}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <ReactDatePicker
                selected={searchData.toDate}
                dateFormat={'dd/MM/yyyy'}
                customInput={
                  <TextField
                    fullWidth
                    label='Đến ngày'
                    placeholder='dd/mm/yyyy'
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton>
                            <CalendarTodayIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                }
                onChange={(date: Date) => handleChangeSearch('toDate', date)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              disablePortal
              fullWidth
              options={statusGroup}
              getOptionLabel={option => option.statusName}
              value={statusGroup.find((x: any) => x.id === searchData.statusId)}
              onChange={(e, value: any) => {
                if (value && value.id === searchData.statusId) {
                  handleChangeSearch('statusId', value.id)
                }
                handleChangeSearch('statusId', value?.id)
              }}
              renderInput={params => <TextField {...params} label='Trạng thái' />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{ display: 'flex' }}>
              <TextField
                label='Từ khoá tìm kiếm'
                fullWidth
                value={keySearch}
                placeholder='Nhập từ khoá tìm kiếm'
                autoComplete='off'
                onChange={handleChangeSearchKey}
                onBlur={e => {
                  console.log('BLURRED')
                }}
                sx={{
                  '& fieldset': {
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px'
                  }
                }}
              />
              <Button
                sx={{ borderRadius: 0, width: 56, height: 56 }}
                variant='contained'
                color='primary'
                onClick={() => {
                  handleSearch()
                }}
              >
                <Icon icon='bx:search' fontSize={24} />
              </Button>
              <Button
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 56, height: 56 }}
                variant='contained'
                color='secondary'
                onClick={() => {
                  clearSearch()
                }}
              >
                <Icon icon='bx:revision' fontSize={24} />
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>
      <Grid item xs={12}>
        <Card sx={{ width: '100%', mt: 5 }}>
          <CardContent>
            <DataGrid
              columns={COLUMN_DEF}
              rows={resExamService.map((item: any, index: any) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              rowCount={resExamServiceData?.getResExamServiceDt?.totalCount ?? 0}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode='server'
              loading={loading || isPending}
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
export default XetNghiem
