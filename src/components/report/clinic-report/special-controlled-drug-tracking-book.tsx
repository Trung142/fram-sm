import React from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { GET_RES_EXAM } from './graphql/query'
import InitReport from './compoment/initReport'

type RequestType = {
    keySearch: string
    skip: number
    take: number
    createFrom: Date
    createTo: Date
  }

const SpecialControlledDrugTB = () => {


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
          headerName: 'Mã Hàng Hóa',

          
        },
        {
            flex: 0.1,
            minWidth: 50,
            maxWidth:200,
            field: 'id',
            headerName: 'Tên Hàng Hóa'
          },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'name',
          headerName: 'Nhóm Hàng Hóa'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'type',
          headerName: 'Đơn Vị'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'serviceGroup',
          headerName: 'Trạng Thái'
        },
        {
          flex: 0.1,
          minWidth: 50,
          maxWidth:150,
          field: 'startDate',
          headerName: 'Thao Tác'
        }

    ]
    return(
        <InitReport GridCol={COLUMN_DEF} title="Báo Cáo Nhà Thuốc/Sổ Theo Dõi Xuất Nhập Thuốc Kiểm Soát Đặc Biệt" QueryString={GET_RES_EXAM} QueryProp="getResExam" IsAdvancedSearch={true}/>
    )
}

export default SpecialControlledDrugTB
