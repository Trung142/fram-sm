import { Autocomplete, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React, { useEffect, useMemo, useState } from "react"
import {  GridColDef } from "@mui/x-data-grid"
import { GET_PATIENT } from './graphql/query'
import moment from "moment"
import InitReport from './compoment/initReport'
import ActivityTag from "src/components/service/components/activity-tag"


const Interconnect = () => {
const COLUMN_DEF_LIENTHONG: GridColDef[] = [
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
      headerName: 'Ngày Tiếp Nhận',
      valueFormatter:params=>moment(params.value).format('DD/MM/YYYY')
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:200,
      field: 'name',
      headerName: 'Tên Bệnh Nhân',
      renderCell:params=>{
        console.log(params)
        return(
          <Grid>
            <Typography>{params.value}</Typography>
            <Typography style={{fontStyle:'italic'}}>Thẻ BHYT:{params?.row?.patBhyt}</Typography>
            <Typography>{moment(params?.row?.createAt).format('DD/MM/YYYY')}</Typography>
          </Grid>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:150,
      field: 'type',
      headerName: 'Tổng Chi Phí'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:150,
      field: 'serviceGroup',
      headerName: 'Cùng Chi Trả'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:150,
      field: 'selfpayment',
      headerName: 'Tự Trả'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:150,
      field: 'BHYTpayment',
      headerName: 'Quỹ BHYT Trả'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:150,
      field: 'checkpayment',
      headerName: 'Xác Nhận Chi Phí'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth:150,
      field: 'status',
      headerName: 'Trạng Thái',
      renderCell: params => {
        return (
          <ActivityTag type={params.value ? 'success' : 'denied'}>
            {params.value ? 'Hoạt động' : 'Tạm dừng'}
          </ActivityTag>
        )
      }
    },
  ]


    return(
        <InitReport GridCol={COLUMN_DEF_LIENTHONG} title="Sổ Xét Nghiệm" QueryString={GET_PATIENT} QueryProp="getPatient" IsExport={false}/>
    )
}

export default Interconnect
