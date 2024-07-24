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

const RevenueDetails = () => {


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
          headerName: 'Mã Phiếu Khám'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Khách Hàng'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Doanh Thu'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Thanh Toán'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'endDate',
          headerName: 'Công Nợ'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'reason',
          headerName: 'Hàng Hóa - Dịch Vụ'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 's',
            headerName: 'Thành Tiền'
          },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'k',
            headerName: 'Công Nợ'
          },
          {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'doctor',
            headerName: 'Bác Sĩ Khám'
          },
          {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'executor',
            headerName: 'Người Thực Hiện'
          },
          {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'adviser',
            headerName: 'Người Tư Vấn'
          },
          {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'representer',
            headerName: 'Người Giới Thiệu'
          },

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Khách Hàng/Doanh Thu Chi Tiết" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={false}/>
    )
}
export default RevenueDetails
