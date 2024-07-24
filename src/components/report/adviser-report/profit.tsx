import React from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { GET_RES_EXAM } from './graphql/query'
import InitReport from './compoment/initReport'



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
            maxWidth:200,
            field: 'id',
            headerName: 'Người Tư Vấn'
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
          headerName: 'Ngày Khám'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Khách Hàng'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Loại'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'finalPayment',
            headerName: 'Mã'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'income',
            headerName: 'Dịch Vụ'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'count',
            headerName: 'Số Lượng'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'tongtien',
            headerName: 'Tổng Tiền'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'discount',
            headerName: 'Giảm Giá'
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:150,
            field: 'paymentsss',
            headerName: 'Thành Tiền'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Người Tư Vấn/Doanh Thu Chi Tiết" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={false}/>
    )
}

export default Profit
