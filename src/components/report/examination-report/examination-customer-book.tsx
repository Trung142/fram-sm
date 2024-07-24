import {  Typography } from "@mui/material"
import React from "react"
import { GridColDef } from "@mui/x-data-grid"
import { GET_PATIENT } from './graphql/query'
import InitReport from './compoment/initReport'
import moment from "moment"
import ActivityTag from "src/components/service/components/activity-tag"


const ExaminationCustomerCard = () => {

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
          maxWidth:150,
          field: 'id',
          headerName: 'Mã Khách hàng'
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
          field: 'patType.name',
          headerName: 'Kiểu Khách Hàng',
          valueGetter:params=>params?.row?.patType?.name      
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'patGroup.name',
          headerName: 'Nhóm Khách Hàng',
          valueGetter:params=>params?.row?.patGroup?.name
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Ngày Bắt Đầu',
          renderCell:params=>{
            const date=moment(params.value).format('DD/MM/YYYY')
            return(
              <Typography>{date}</Typography>
            )
          }
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'endDate',
          headerName: 'Ngày Kết Thúc',
          renderCell:params=>{
            const date=moment(params.value).format('DD/MM/YYYY')
            return(
              <Typography>{date}</Typography>
            )
          }
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'reasonExam',
          headerName: 'Nguyên Nhân',
          
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
        <InitReport title="Sổ Theo Dõi Khách Hàng PrEP" GridCol={COLUMN_DEF} QueryString={GET_PATIENT} QueryProp="getPatient" IsAdvancedSearch={false} />
    )
}

export default ExaminationCustomerCard