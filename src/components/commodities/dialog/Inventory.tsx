import React, { useMemo, useState } from 'react'

// import material ui
import { Grid, Button, TextField, IconButton } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// import iconS
import Icon from 'src/@core/components/icon'
import { GET_CANSALE, GET_WH_EXISTENCE, GET_WH_EXISTENCEDTS } from '../res_system/graphql/query'
import { useQuery } from '@apollo/client'

type Props = {
  data?: any
  open?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}
function Inventory(props: Props) {
  const { data, open, onSubmit } = props

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [queryVariables, setQueryVariables] = useState<any>({
    input: {},
    skip: 0,
    take: 50
  })
  // lấy dữ liệu
  const {
    data: getWhExistence,
    loading,
    error,
    refetch
  } = useQuery(GET_WH_EXISTENCE, {
    variables: queryVariables
  })


  const warehouseData: any[] = useMemo(() => {
    return getWhExistence?.getWhExistence.items ?? []
  }, [getWhExistence])


  const rowsFilter = warehouseData.filter(item => item.whExistenceDts.some((dt: any) => dt.product.id === data.id));
  console.log('rowsFilter', rowsFilter)

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'STT',
      minWidth: 100,
      renderCell: param => {
        console.log("param",param.row);
        return (
          <span>{param.row.index}</span>
        )
      }
     
    },
    {
      field: 'whName',
      headerName: 'KHO',
      minWidth: 300,
       renderCell: param => <div>{param.row.wh.name}</div>  
    },
    {
      field: 'batchIds',
      headerName: 'Số LÔ',
      minWidth: 200,
      renderCell: param => {
        // Tạo một Set để lưu trữ các batch ID đã xuất hiện, Set sẽ tự động loại bỏ các giá trị trùng lặp
        const uniqueBatchIds = new Set<string>();
      
        // Lặp qua mảng whExistenceDts và thêm các batch ID duy nhất vào Set
        param.row.whExistenceDts.forEach((item: any) => {
          uniqueBatchIds.add(item.batch.id);
        });
      
        // Render các batch ID duy nhất thành các phần tử div
        return (
          <div>
            {[...uniqueBatchIds].map(id => (
              <div key={id}>{id}</div>
            ))}
          </div>
        );
      } 
    },
    {
      field: 'totalQuantity',
      headerName: 'SỐ LƯỢNG',
      minWidth: 200,
      renderCell: param => {
        // Tạo một đối tượng để lưu trữ tổng số lượng cho mỗi batch ID
        const batchQuantities: { [key: string]: number } = {};
      
        // Lặp qua mảng whExistenceDts và tính tổng số lượng cho mỗi batch ID
        param.row.whExistenceDts.forEach((item: any) => {
          const batchId = item.batch.id;
          if (batchQuantities[batchId]) {
            batchQuantities[batchId] += item.quantity;
          } else {
            batchQuantities[batchId] = item.quantity;
          }
        });
      
        // Render các batch ID cùng với tổng số lượng thành các phần tử div
        return (
          <div>
            {Object.keys(batchQuantities).map(batchId => (
              <div key={batchId}>
                {batchQuantities[batchId]}
              </div>
            ))}
          </div>
        );
      }
      
    }
  ]
  return (
    <Grid>
      <Grid item xs={4} style={{ display: 'flex', maxWidth: '40%', marginTop: '30px' }}>
        <TextField
          label='Từ khoá tìm kiếm'
          placeholder='Nhập từ khoá tìm kiếm'
          variant='outlined'
          fullWidth
          multiline
          InputLabelProps={{ shrink: true }}
        />
        <Grid item>
          <Button variant='contained' color='primary' style={{ height: '3.5rem', borderRadius: 0 }}>
            <Icon icon='bx:search' fontSize={28} />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='secondary'
            style={{ height: '3.5rem', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            <Icon icon='bx:revision' fontSize={28} />
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 3 }}>
        <DataGrid
          columns={columns}
          rows={rowsFilter
            // .filter(item => item.whExistenceDts.product?.id === data.id)
            .map((item: any, rowIndex: any) => ({
              ...item,
              index: rowIndex + 1 + paginationModel.page * paginationModel.pageSize
            }))}
          autoHeight={true}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 }
            }
          }}
          pageSizeOptions={[5, 10, 25]}
          style={{ minHeight: 300 }}
        />
      </Grid>
    </Grid>
  )
}

export default Inventory
