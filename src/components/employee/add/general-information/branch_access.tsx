import { Grid, Autocomplete, TextField, Typography } from '@mui/material'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { id } from 'date-fns/locale'
// type Props = {
//   DATAROLE: any
//   DATACLinict: any
//   handleaddUser: (key: string, newvalue: any) => void
//   input: any
// }
const Branch_Access = (props: any) => {
  //const { DATAROLE, DATACLinict, handleaddUser, input } = props

  //data gridcoder
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'id',
      headerName: 'TÊN CHI NHÁNH',
      minWidth: 200,
      renderCell: (params: { row: { id?: string } }) => {
        const { id } = params.row
        return <div>{id}</div>
      }
    }
  ]
  const data = [
    {
      id: 'nguyenvana'
    }
  ]
  return (
    <>
      <Grid container sx={{ pt: 10 }}>
        <Grid container>
          <Grid item xs={12}>
            <DataGrid
              columns={columns}
              rows={data}
              // rows={ResUserData.map((item, index) => ({
              //   ...item,
              //   index: index + 1 + paginationModel.page * paginationModel.pageSize
              // }))}
              // rowCount={userData?.getUsers?.totalCount ?? 0}
              // paginationModel={paginationModel}
              // onPaginationModelChange={setPaginationModel}
              // paginationMode='server'
              style={{ minHeight: 700 }}
              // loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 25 }
                }
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
export default Branch_Access
