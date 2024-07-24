import React, { useMemo, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Grid, TextField, Button, MenuItem, InputAdornment, IconButton, Box, Autocomplete } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useQuery } from '@apollo/client'
import {
  GET_CLINIC,
  GET_PRODUCT_WAREHOUSE,
} from '../res_system/graphql/query'
import moment from 'moment'
import styles from '././index.module.scss'

type RequestType = {
  fromDate: Date | null
  toDate: Date | null
  keySearch: string
  skip: number
  take: number
}

type Props = {
  data: any,
  open?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

function WarehouseCard(prop: Props) {
  const { data, open, onSubmit } = prop
  console.log('data', data)

  // Tham số tìm kiếm
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState<RequestType>({
    fromDate: new Date(),
    toDate: new Date(),
    keySearch: '',
    skip: 0,
    take: paginationModel.pageSize
  })
  const [keySearch, setKeySearch] = useState('')
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: searchData.skip,
    take: searchData.take
  })

  // lấy dữ liệu
  const { data: productData } = useQuery(GET_PRODUCT_WAREHOUSE)

  // Danh sách dữ liệu
  const { data: clinic } = useQuery(GET_CLINIC)

  const clinicData: any[] = useMemo(() => {
    return clinic?.getClinic?.items ?? []
  }, [clinic])
  const whExistenceData: any[] = useMemo(() => {
    return productData?.getProduct?.items ?? []
  }, [productData])

  const subItemIds: string[] = []
  whExistenceData.map((item: any) => {
    if (item.id === data.id)
      subItemIds.push(
        ...item.whCustReturnDts.map((subItem: any) => subItem),
        ...item.whExistenceDts.map((subItem: any) => subItem),
        ...item.whExpCancelDts.map((subItem: any) => subItem),
        ...item.whImportSupDts.map((subItem: any) => subItem),
        ...item.whOtherExpDts.map((subItem: any) => subItem),
        ...item.whReturnSupDts.map((subItem: any) => subItem),
        ...item.whTransferDts.map((subItem: any) => subItem)
      )
  })

  console.log('subItemIds', subItemIds)

  const columns: GridColDef[] = [
    {
      field: 'Phieu',
      headerName: 'Phiếu',
      minWidth: 200,
      renderCell: param => {
        // Log the param.row
        console.log("param.row", param.row);
    
        // Return the ReactNode
        return (
          <div>
            <div>{param.row.id}</div>
            <div>{moment(param?.row?.createAt)?.format('DD/MM/YYYY HH:mm')}</div>
            {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
          </div>
        );
      }
    },
    {
      field: 'Doituong',
      headerName: 'Đối tượng',
      minWidth: 200,
      renderCell: param => {
        // Log the param.row
        console.log("param.row", param.row);

    // Helper function to get the warehouse name
    const getWarehouseName = (row: any )=> {
      return (
        (row.whCustReturn && row.whCustReturn.wh && row.whCustReturn.wh.name) ||
        // (row.whExistence && row.whExistence.wh && row.whExistence.wh.name) ||
        (row.whImportSup && row.whImportSup.wh && row.whImportSup.wh.name) ||
        (row.whOtherExp && row.whOtherExp.wh && row.whOtherExp.wh.name) ||
        (row.whReturnSup && row.whReturnSup.wh && row.whReturnSup.wh.name) ||
        (row.whExpCancel && row.whExpCancel.wh && row.whExpCancel.wh.name) 
      );
    };

    // Return the ReactNode
    return (
      <div>
        {getWarehouseName(param.row)}
        {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
      </div>
    );
      }
    },
    {
      field: 'Solo',
      headerName: 'Số Lô',
      minWidth: 190,
      renderCell: param => {
        // Log the param.row
        console.log("param.row", param.row);
    
        // Return the ReactNode
        return (
          <div>
            <div>{param.row.batchId}</div>
            {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
          </div>
        );
      }
    },
    {
      field: 'Tongtien',
      headerName: 'Tổng Tiền',
      minWidth: 150,
      renderCell: param => {
        // Log the param.row
        console.log("param.row", param.row);
    
        // Return the ReactNode
        return (
          <div>
            <div>{param.row.importPrice * param.row.quantity }</div>
            {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
          </div>
        );
      }
    },
    { field: 'Tienvon', headerName: 'Tiền vốn', minWidth: 130,
    renderCell: param => {
      // Log the param.row
      console.log("param.row", param.row);
  
      // Return the ReactNode
      return (
        <div>
          <div>{param.row.totalVatAmount }</div>
          {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
        </div>
      );
    } 
  },
    { field: 'Giavon', headerName: 'Giá vốn', minWidth: 150,
    renderCell: param => {
      // Log the param.row
      console.log("param.row", param.row);
  
      // Return the ReactNode
      return (
        <div>
          <div>{param.row.importPrice }</div>
          {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
        </div>
      );
    }  },
    {
      field: 'lech',
      headerName: 'Lệch',
      minWidth: 100,
      renderCell: param => {
        // Log the param.row for debugging
        console.log("param.row", param.row);
    
        // Determine the sign based on the __typename
        let sign = '';
        const typeName = param.row.__typename;
    
        // Check for different types and assign sign
        if (typeName === "WhReturnSupDt" || typeName === "WhOtherExpDt" || typeName === "WhExpCancelDt" || typeName === "WhCustReturnDt") {
          sign = '-';
        } else if (typeName === "WhImportSupDt") {
          sign = '+';
        }
    
        // Ensure quantity is defined and valid
        const quantity = param.row.quantity !== undefined && param.row.quantity !== null ? param.row.quantity : 0;
        let signColor = '';
        if (sign === '+') {
          signColor = 'green';
        } else if (sign === '-') {
          signColor = 'red';
        }
    
        // Return the ReactNode
        return (
          <div>
            <div style={{ color: signColor }}>
              <span >{sign} </span>{quantity}
            </div>
            {/* <div>{subItemIds.map((item: any) => item.id)}</div> */}
          </div>
        );
      }
    }
    ,
    { field: 'Toncuoi', headerName: 'Tồn cuối', minWidth: 150,
    renderCell: param => {
      return(
      <div>{param.row.totalRemaining}</div>
      )
    }  
     }
  ]
  //  Tạo các dòng dữ liệu với index được tính toán và thêm vào
  const rows = subItemIds.map((item: any, rowIndex: number) => ({
    ...item,
    index: rowIndex + 1 + paginationModel.page * paginationModel.pageSize
  }))
  console.log("rows",rows);
  

  // // Thêm dữ liệu từ whReturnSupDts
  // data.whReturnSupDts.forEach((item: any, rowIndex: number) => {
  //   rows.push({
  //     ...item,
  //     index: rowIndex + 1 + paginationModel.page * paginationModel.pageSize
  //   })
  // })

  // // Thêm dữ liệu từ whExpCancelDts
  // data.whExpCancelDts.forEach((item: any, rowIndex: number) => {
  //   rows.push({
  //     ...item,
  //     index: rowIndex + 1 + paginationModel.page * paginationModel.pageSize
  //   })
  // })

  // // Thêm dữ liệu từ whTransferDts
  // data.whTransferDts.forEach((item: any, rowIndex: number) => {
  //   rows.push({
  //     ...item,
  //     index: rowIndex + 1 + paginationModel.page * paginationModel.pageSize
  //   })
  // })
  const handleChangeSearch = (key: string, value: any) => {
    setSearchData({
      ...searchData,
      [key]: value
    })
  }

  const handleSearch = () => {
    // refetch({ variables: queryVariables });
  }

  const clearSearch = () => {
    setQueryVariables({
      fromDate: null,
      toDate: null,
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
    <>
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Button
              variant='text'
              sx={{
                backgroundColor: '#D9D9D9',
                color: '#fff',
                mr: 2,
                '&:hover': {
                  backgroundColor: '#D9D9D9'
                }
              }}
            >
              <FilterAltIcon sx={{ width: '2rem', height: '2rem' }} />
            </Button>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' }, width: '100%' }}>
              <ReactDatePicker
                selected={searchData.fromDate}
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
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
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
        <Grid item xs={2} md={2}>
          <Autocomplete
            fullWidth
            options={clinicData}
            getOptionLabel={option => option.name}
            renderInput={params => <TextField {...params} label='Phòng Khám' />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <div style={{ display: 'flex', width: '85%' }}>
            <TextField
              label='Nhập từ khoá tìm kiếm'
              placeholder='Nhập từ khoá tìm kiếm'
              InputLabelProps={{ shrink: true }}
              variant='outlined'
              sx={{
                '& label': { paddingLeft: theme => theme.spacing(2) },
                '& input': { paddingLeft: theme => theme.spacing(3.5) },
                width: '100%',
                '& fieldset': {
                  paddingLeft: theme => theme.spacing(2.5),
                  maxWidth: 600,
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px'
                }
              }}
            />
            <Button
              sx={{ borderRadius: 0 }}
              variant='contained'
              style={{ width: 56, height: 56 }}
              onClick={() => handleSearch()}
            >
              <Icon fontSize={20} icon='bx:bx-search' color='white' />
            </Button>
            <Button
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              variant='contained'
              style={{ backgroundColor: '#AEB4AB', width: 56, height: 56 }}
              onClick={() => clearSearch()}
            >
              {/* <RefreshIcon /> */}
              <Icon icon='bx:revision' fontSize={24} />
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <DataGrid
            columns={columns}
            rows={rows}
            autoHeight={true}
            // rowHeight={200}
            style={{ minHeight: 300 }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 }
              }
            }}
            pageSizeOptions={[5, 10]}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default WarehouseCard
