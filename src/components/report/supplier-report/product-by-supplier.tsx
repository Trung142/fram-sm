import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import ReactDatePicker from "react-datepicker"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@apollo/client"
import { GET_SUPPLIER } from './graphql/query'
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

const ProductBySupplier = () => {


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
            maxWidth:200,
            field: 'id',
            headerName: 'Nhà Cung Cấp'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Hàng Hóa'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Số Lô'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'HSD'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'ĐVT'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPayment',
            headerName: 'Giá Vốn'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'income',
            headerName: 'SL Nhập'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'giatrinhap',
            headerName: 'Giá Trị Nhập'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'sltralai',
            headerName: 'SL Trả Lại'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'giatritralai',
            headerName: 'Giá Trị Trả Lại'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'totaltienhap',
            headerName: 'Tổng Tiền Nhập'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Nhà Cung Cấp / Hàng Nhập Theo Nhà Cung Cấp" QueryString={GET_SUPPLIER} QueryProp="getSupplier" IsAdvancedSearch={false}/>
    )
}

export default ProductBySupplier
