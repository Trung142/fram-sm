import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import ReactDatePicker from "react-datepicker"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@apollo/client"
import { GET_SERVICE_BY_DOCTOR } from './graphql/query'
import moment from "moment"
import { formatVND } from 'src/utils/formatMoney'
import InitReport from './compoment/initReport'

type RequestType = {
    keySearch: string
    skip: number
    take: number
    createFrom: Date
    createTo: Date
  }

const Revenue = () =>  {


    const COLUMN_DEF: GridColDef[] = [
        {
          flex: 0.1,
          minWidth: 20,
          maxWidth:70,
          field: 'index',
          headerName: '#'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:250,
          field: 'mainDoctor.id',
          headerName: 'Mã Bác Sĩ',
          valueGetter:params=>params?.row?.mainDoctor?.id
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'name',
            headerName: 'Bác Sĩ',
            renderCell:params=>{
              if(params?.row?.mainDoctor){
                return(
                  <Typography>BS {params?.row?.mainDoctor?.fristName} {params?.row?.mainDoctor?.lastName}</Typography>
                )
              }else{
                <></>
              }
            }
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'service.name',
          headerName: 'Dịch Vụ',
          valueGetter:params=>params?.row?.service?.name
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'service.price',
          headerName: 'Tổng Tiền',
          valueGetter:params=>params?.row?.service?.price
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Giảm giá'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Tiền VAT'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPayment',
            headerName: 'Tổng Tiền Trả'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'income',
            headerName: 'Doanh Thu'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Bác Sĩ/Doanh Thu" QueryString={GET_SERVICE_BY_DOCTOR} QueryProp="getServiceIndexProc" IsAdvancedSearch={false}/>
    )
}
export default Revenue
