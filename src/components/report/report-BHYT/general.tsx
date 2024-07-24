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
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@apollo/client'
import { GET_PRODUCT,GET_PATIENT } from './graphql/query'
import {COLUMN_DEF_TYPE_19,COLUMN_DEF_TYPE_20,COLUMN_DEF_TYPE_21,COLUMN_DEF_TYPE_79,COLUMN_DEF_TYPE_CHILD,COLUMN_DEF_TYPE_DETAIL} from './generalReportTeamplate'
import {excelButonstyle,gridHeader} from '../utils/styles'


type RequestType = {
  keySearch: string
  skip: number
  take: number
  createFrom: Date
  createTo: Date
  reportTemplateId:string
}

const General = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })


  const [searchData, setSearchData] = useState<RequestType>({
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize,
    createFrom: new Date(new Date().getTime() - 24 * 5 * 3600 * 1000),
    createTo: new Date(new Date().getTime()),
    reportTemplateId:''
  })

  const [keySearch, setKeySearch] = useState('')
  const [reportTemplateState,setReportTemplateState]=useState<GridColDef[]>([])

  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take,
    }) 

  //lấy data
  const { data:dataPatient, loading:dataPatientloading, refetch:dataPatientrefetch } = useQuery(GET_PATIENT, {
    variables: queryVariables
  })
  const dataPatientList = useMemo(() => dataPatient?.getPatient?.items ?? [], [dataPatient])

  const { data:dataProduct, loading:dataProductloading, refetch:dataProductrefetch } = useQuery(GET_PRODUCT, {
    variables: queryVariables
  })
  const dataProductList = useMemo(() => dataProduct?.getProduct?.items ?? [], [dataProduct])

  const ReportTemplate = [
    {
      id: '19',
      name:'Mẫu 19',
      col: COLUMN_DEF_TYPE_19,
      tittle:'Thông kê vật tư Y tế thanh toán BHYT'
    },
    {
      id: '20',
      name:'Mẫu 20',
      col: COLUMN_DEF_TYPE_20,
      tittle:'Thống kê thuốc thanh toán BHYT'
    },
    {
      id: '21',
      name:'Mẫu 21',
      col: COLUMN_DEF_TYPE_21,
      tittle:'Thống kệ Dịch vụ thanh toán BHYT'
    },
    {
      id: '79',
      name:'Mẫu 79',
      col: COLUMN_DEF_TYPE_79,
      tittle:'Thống kê danh sách người bệnh BHYT khám chữa bệnh ngoại trú đề nghị thanh toán'
    },
    {
      id: 'child',
      name:'Mẫu Trẻ em không thẻ',
      col: COLUMN_DEF_TYPE_CHILD,
      tittle:'Thống kế BHYT trẻ em không thẻ'
    },
    {
      id: 'detail',
      name:'Bảng Kê chi tiết',
      col: COLUMN_DEF_TYPE_DETAIL,
      tittle:'Thống kê chi tiết chi phí'
    }
  ]

  const handleChangeSearch = (key: any, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }
  console.log(searchData.reportTemplateId)
  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader
            title='Báo Cáo BHYT/Tổng Hợp'
            action={
              <>
                <Grid>
                  <Button variant='contained' color='primary' sx={excelButonstyle}>
                    <Icon icon='file-icons:microsoft-excel' fontSize={20} style={{ marginRight: 5 }} />
                    Xuất Excel
                  </Button>
                  <Button variant='contained' color='inherit' sx={{ pl: 5, pr: 8 }} style={{ marginLeft: 10 }}>
                    <Icon icon='vscode-icons:file-type-pdf2' fontSize={20} style={{ marginRight: 5 }} />
                    Xuất PDF
                  </Button>
                </Grid>
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
              <Grid item xs={8} md={5.3}>
                <Grid container gap={2}>
                  <Grid item xs={6} display={'flex'} gap={2}>
                    <Autocomplete
                          fullWidth
                          getOptionLabel={option=>option.name}
                          options={ReportTemplate}
                          value={ReportTemplate.find((x: any) => x?.id === searchData.reportTemplateId) || null}
                          onChange={(e, value: any) => {
                              handleChangeSearch('reportTemplateId',value?.id)
                              setReportTemplateState(value?.col)
                          }}
                          renderInput={params => <TextField {...params} label='Chọn Mẫu Báo Cáo' />}
                      />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            {searchData.reportTemplateId  &&(
              <Grid xs={12} sx={gridHeader}>{ReportTemplate.find((x:any)=>x.id===searchData.reportTemplateId)?.tittle}</Grid>
            )}
            {searchData.reportTemplateId === '79' || searchData.reportTemplateId === 'child' ? (
              <DataGrid
              columns={reportTemplateState || []}
              rows={dataPatientList.map((item: any, index: any) => ({
                ...item,
                index: index + 1 + paginationModel.page * paginationModel.pageSize
              }))}
              rowCount={dataPatientList?.getPatient?.totalCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode='server'
              slots={{
                noRowsOverlay: () => (
                  <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                )
              }}
              loading={dataPatientloading}
              style={{ minHeight: 500, height: '60vh' }}
            />
            ):(
              <DataGrid
                columns={reportTemplateState || []}
                rows={dataProductList.map((item: any, index: any) => ({
                  ...item,
                  index: index + 1 + paginationModel.page * paginationModel.pageSize
                }))}
                rowCount={dataProductList?.getProduct?.totalCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode='server'
                slots={{
                  noRowsOverlay: () => (
                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                  )
                }}
                loading={dataProductloading}
                style={{ minHeight: 500, height: '60vh' }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default General
