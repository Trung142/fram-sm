import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import ReactDatePicker from "react-datepicker"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@apollo/client"
import { GET_RES_EXAM } from './graphql/query'
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
          maxWidth:250,
          field: 'createAt',
          headerName: 'Mã Nhân Viên',

          
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'id',
            headerName: 'Nhân Viên'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Tổng Tiền Hóa Đơn'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Tổng Tiền Khách Trả'
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
          field: 'discount',
          headerName: 'Tiền Giá Vốn'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'vat',
            headerName: 'Lợi Nhuận'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Bác Sĩ/Lợi Nhuận" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={false}/>
    )
}

export default Profit
