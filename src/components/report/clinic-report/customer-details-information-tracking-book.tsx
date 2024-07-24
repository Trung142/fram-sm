import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import ReactDatePicker from "react-datepicker"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@apollo/client"
import { GET_RES_EXAM } from './graphql/query'
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

const CustomerDetailInforTB = () => {


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
          field: 'createAt',
          headerName: 'Ngày Tháng',

          
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'id',
            headerName: 'Mã Khách Hàng'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'id',
            headerName: 'Khách Hàng'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'address',
            headerName: 'Địa Chỉ'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'goods',
            headerName: 'Hàng hóa'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'quantity',
            headerName: 'ĐVT'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'SlBan',
            headerName: 'Số Lượng Bán'
        },
        

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Nhà Thuốc/Sổ Theo Dõi Thông Tin Chi Tiết Khách Hàng" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={true}/>
    )
}

export default CustomerDetailInforTB
