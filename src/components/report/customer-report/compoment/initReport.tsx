import { Icon } from '@iconify/react'
import {
    Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DocumentNode, OperationVariables, TypedDocumentNode, useQuery } from '@apollo/client'
import { excelButonstyle } from '../../utils/styles'

type Props = {
  GridCol: GridColDef[]
  title: string
  QueryString: DocumentNode | TypedDocumentNode<any, OperationVariables>
  QueryProp: string
  IsAdvancedSearch: boolean
  SearchType?:string
}

type RequestType = {
  keySearch: string
  skip: number
  take: number
  createFrom: Date
  createTo: Date
  status:number
  transactionId:string
}

const InitReport = (props: Props) => {
  const { GridCol, title, QueryString, QueryProp, IsAdvancedSearch,SearchType } = props

  const [IsOpenAdvancedSearch, setIsOpenAdvancedSearch] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })


  const transaction=[
    {
      id:'01',
      name:'All'
    },
    {
      id:'02',
      name:'Nợ trong kỳ'
    }
  ]
      

  

  const [searchData, setSearchData] = useState<RequestType>({
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize,
    createFrom: new Date(new Date().getTime() - 24 * 5 * 3600 * 1000),
    createTo: new Date(new Date().getTime()),
    status:0,
    transactionId:''
  })

  const [keySearch, setKeySearch] = useState('')

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  //lấy data
  const { data, loading, refetch } = useQuery(QueryString, {
    variables: queryVariables
  })

  const dataList = useMemo(() => data?.[QueryProp]?.items ?? [], [data, QueryProp])

  useEffect(() => {
    setQueryVariables((x: any) => ({
      ...x,
      skip: paginationModel.page * paginationModel.pageSize,
      take: paginationModel.pageSize,
      input: {
        and: [
          { createAt: searchData.createFrom ? { gte: searchData.createFrom } : undefined },
          { createAt: searchData.createTo ? { lte: searchData.createTo } : undefined }
        ]
      }
    }))
  }, [searchData, paginationModel])

  const handleChangeSearch = (key: any, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleOpenAS = () => {
    setIsOpenAdvancedSearch(!IsOpenAdvancedSearch)
  }

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader
            title={title}
            action={
              <>
                {IsAdvancedSearch ? (
                  <Grid>
                    <Button variant='contained' color='primary' sx={excelButonstyle}>
                      <Icon icon='file-icons:microsoft-excel' fontSize={20} style={{ marginRight: 5 }} />
                      Xuất Excel
                    </Button>
                  </Grid>
                ) : (
                  <Button variant='contained' color='primary' sx={excelButonstyle}>
                    <Icon icon='file-icons:microsoft-excel' fontSize={20} style={{ marginRight: 5 }} />
                    Xuất Excel
                  </Button>
                )}
              </>
            }
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={3} md={1.5}>
                <DatePickerWrapper>
                  <ReactDatePicker
                    selected={searchData.createFrom}
                    dateFormat={'dd/MM/yyyy'}
                    showMonthDropdown
                    showYearDropdown
                    customInput={
                      <TextField
                        fullWidth
                        label='Từ Ngày'
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
                    onChange={(date: Date) => handleChangeSearch('createFrom', date)}
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={3} md={1.5}>
                <DatePickerWrapper>
                  <ReactDatePicker
                    selected={searchData.createTo}
                    dateFormat={'dd/MM/yyyy'}
                    showMonthDropdown
                    showYearDropdown
                    customInput={
                      <TextField
                        fullWidth
                        label='Đến Ngày'
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
                    onChange={(date: Date) => handleChangeSearch('createTo', date)}
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={8} md={8}>
                {IsAdvancedSearch ? (
                  <Grid container gap={2} display={'flex'} > 
                  <Grid item xs={3}>
                    <Autocomplete
                              fullWidth
                              getOptionLabel={option=>option.name}
                              options={transaction}
                              value={transaction.find((x: any) => x?.id === searchData.transactionId) || null}
                              onChange={(e, value: any) => {
                                  handleChangeSearch('transactionId',value?.id)
                              }}
                              renderInput={params => <TextField {...params} label='Chọn Giao Dịch' />}
                      />
                  </Grid>
                  <Grid item xs={6}>
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
                      console.log(1)
                    }}
                  >
                    <Icon icon='bx:search' fontSize={24} />
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      console.log(1)
                    }}
                  >
                    <Icon icon='bx:revision' fontSize={24} />
                  </Button>
                </Grid>
                ):(
                  <Grid container gap={2}>
                      <Grid item xs={7}>
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
                          console.log(1)
                        }}
                      >
                        <Icon icon='bx:search' fontSize={24} />
                      </Button>
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                          console.log(1)
                        }}
                      >
                        <Icon icon='bx:revision' fontSize={24} />
                      </Button>
                  </Grid>
                )}
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
                columns={GridCol}
                rows={dataList.map((item: any, index: any) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                rowCount={data?.[QueryProp]?.totalCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='server'
                slots={{
                  noRowsOverlay: () => (
                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                  )
                }}
                loading={loading}
                style={{ minHeight: 500, height: '60vh' }}
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 200}
                sx={{
                  [`& .MuiDataGrid-cell`]: {
                    paddingTop: 1.5,
                    paddingBottom: 1.5,
                    lineHeight: 'unset !important',
                    maxHeight: 'none !important',
                    whiteSpace: 'normal',
                  },
                  [`& .MuiDataGrid-columnHeader`]: {
                    maxHeight: 'none !important',
                    height: 'auto !important',
                    whiteSpace: 'inherit !important',
                    overflow: 'inherit !important',
                    lineHeight: '24px !important'
                  },
                  [`& .MuiDataGrid-columnHeaderTitle`]: {
                    whiteSpace: 'normal !important',
                  }
                }}
              />
            }
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InitReport
