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

const Revenue = () => {
    const [importAmount, setImportAmount] = useState<number>(0)
    const [returnAmount, setReturnAmount] = useState<number>(0)

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
            headerName: 'Mã Nhà Cung Cấp'
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
          field: 'import_quantity',
          headerName: 'Số Lượng Nhập',
          renderCell: params =>  {
            let import_quantity = 0;
            params.row.whImportSups.forEach((item:any) => {
              item.whImportSupDts.forEach((i:any) => {
                import_quantity += i.quantity
              })
            })
            return import_quantity
          }
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'import_final_amount',
          headerName: 'Giá Trị Nhập',
          renderCell: params =>  {
            let import_final_amount = 0;
            params.row.whImportSups.forEach((item:any) => {
                import_final_amount += item.finalAmount
            })
            setImportAmount(import_final_amount)
            return formatVND(import_final_amount)
          }
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'return_quantity',
          headerName: 'Số Lượng Trả',
          renderCell: params =>  {
            let return_quantity = 0;
            params.row.whReturnSups.forEach((item:any) => {
              item.whReturnSupDts.forEach((i:any) => {
                return_quantity += i.quantity
              })
            })
            return return_quantity 
          }
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'return_final_amount',
            headerName: 'Giá Trị Trả lại',
            renderCell: params =>  {
              let return_final_amount = 0;
              params.row.whReturnSups.forEach((item:any) => {
                return_final_amount += item.finalAmount
              })
              setReturnAmount(return_final_amount)
              return formatVND(return_final_amount)
            }
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'income',
            headerName: 'Doanh Thu',
            renderCell: params => {
              return formatVND(importAmount - returnAmount)
            }
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Nhà Cung Cấp / Doanh Thu" QueryString={GET_SUPPLIER} QueryProp="getSupplier" IsAdvancedSearch={false}/>
    )
}
export default Revenue
