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

const Profit = () => {


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
            headerName: 'Người Thực Hiện'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Mã Phiếu Khám'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Ngày Khám'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Khách Hàng'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Loại'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPayment',
            headerName: 'Mã'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'income',
            headerName: 'Dịch Vụ'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'quantity',
            headerName: 'Số Lượng'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPrice',
            headerName: 'Tổng Tiền'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'discount',
            headerName: 'Giảm Giá'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finaalpayment',
            headerName: 'Thành Tiền'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Người Thực Hiện/Lợi Nhuận" QueryString={GET_RES_EXAM} QueryProp="getResExam" />
    )
}

export default Profit
