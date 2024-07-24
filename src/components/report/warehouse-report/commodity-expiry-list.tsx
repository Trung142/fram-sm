import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import ReactDatePicker from "react-datepicker"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useQuery } from "@apollo/client"
import { GET_WH_CANCEL } from './graphql/query'
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

const CommodityExpiry = () =>  {


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
          field: 'product.id',
          headerName: 'Mã Hàng Hóa',
          valueGetter:params=>params?.row?.whExpCancelDts?.product?.id
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'product.productName',
            headerName: 'Tên Hàng Hóa',
            valueGetter:params=>params?.row?.whExpCancelDts?.product?.prouctName
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'whExpCancelDts.batchId',
          headerName: 'Số Lô',
          valueGetter:params=>params?.row?.whExpCancelDts?.batchId
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'whExpCancelDts.quantity',
          headerName: 'Số Lượng',
          valueGetter:params=>params?.row?.whExpCancelDts?.quantity
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'duedate',
          headerName: 'Hạn Dùng'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroups',
          headerName: 'Số Ngày Còn Lại'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Kho Hàng/Hàng Cận Date" QueryString={GET_WH_CANCEL} QueryProp="getResExam" IsAdvancedSearch={true}/>
    )
}

export default CommodityExpiry
