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

const Debt = () => {


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
            headerName: 'Mã Người Cung Cấp'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:200,
          field: 'name',
          headerName: 'Nhà Cung Cấp'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'debt_start',
          headerName: 'Nợ Đầu Kỳ',
          renderCell: params => {
            return 0
          }
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'finalAmount',
          headerName: 'Tổng Thu',
          renderCell: params => {
            let finalAmount = 0
            params.row.whImportSups.forEach((item:any) => {
              finalAmount+=item.finalAmount
            })
            return formatVND(finalAmount)
          }
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'totalPaid',
          headerName: 'Tổng Chi',
          renderCell: params => {
            let totalPaid = 0
            params.row.whImportSups.forEach((item:any) => {
              totalPaid+=item.totalPaid
            })
            return formatVND(totalPaid)
          }
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'income',
            headerName: 'Nợ Cuối Kỳ',
            renderCell: params => {
              let debt = 0
              params.row.whImportSups.forEach((item:any) => {
                debt+=item.debt
              })
              return formatVND(debt)
            }
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Nhà Cung Cấp / Công Nợ" QueryString={GET_SUPPLIER} QueryProp="getSupplier" IsAdvancedSearch={false}/>
    )
}

export default Debt
