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

const XRayReport = () => {


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
          headerName: 'Mã Phiếu'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Bệnh Nhân'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Địa Chỉ'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Chuẩn Đoán'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Tên'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'endDate',
          headerName: 'Kết Quả'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'reason',
          headerName: 'Người Thực Hiện'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'status',
          headerName: 'Trạng Thái'
        },

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Sổ Xét Nghiệm" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={true}/>
    )
}

export default XRayReport