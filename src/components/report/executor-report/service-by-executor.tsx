import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { GET_RES_EXAM } from './graphql/query'
import InitReport from './compoment/initReport'



const ServiceByExecutor = () => {


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
          headerName: 'Mã'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Dịch Vụ'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Số Lượng'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Tổng Tiền'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPayment',
            headerName: 'Thành Tiền'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Người Thực Hiện/Dịch Vụ Theo Người Thực Hiện" QueryString={GET_RES_EXAM} QueryProp="getResExam" />
    )
}

export default ServiceByExecutor
