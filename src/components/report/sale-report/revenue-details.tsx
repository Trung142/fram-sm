import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import ReactDatePicker from "react-datepicker"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@apollo/client"
import { GET_RES_EXAM } from "./graphql/query"
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

const RevenueDetails = () => {


    const COLUMN_DEF: GridColDef[] = [
        {
          flex: 0.1,
          minWidth: 20,
          maxWidth:70,
          field: 'index',
          headerName: 'STT'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:200,
          field: 'createAt',
          headerName: 'Ngày Giao Dịch'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'id',
            headerName: 'Mã Phiếu'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Khách Hàng'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Hàng Hóa - Dịch Vụ'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Tổng Tiền'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Giảm Giá'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'endDate',
          headerName: 'Tiền VAT'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'reason',
          headerName: 'Tổng Tiền Trả'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'status',
          headerName: 'Thành Tiền'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPayment',
            headerName: 'BHYT Trả'
          },
          {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPrice',
            headerName: 'Tự Trả'
          },

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Bán Hàng/Doanh Thu Chi Tiết" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={true}/>
    )
}

export default RevenueDetails