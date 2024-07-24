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

const DebtDetailByRepresenter = () => {


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
            headerName: 'Người Giới Thiệu'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Kiểu NGT'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Hàng Hóa'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'ĐVT'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'sell',
            headerName: 'Số Lượng Bán'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'sellpayment',
            headerName: 'Tổng Tiền Bán'   
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Số Lượng Trả'
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
            headerName: 'Tổng Tiền'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Người Giới Thiệu/Hàng Bán Theo Người Giới Thiệu" QueryString={GET_RES_EXAM} QueryProp="getResExam" />
    )
}

export default DebtDetailByRepresenter
