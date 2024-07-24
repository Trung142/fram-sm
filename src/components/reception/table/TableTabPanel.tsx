import { TabPanel } from '@mui/lab'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Grid } from '@mui/material'
import { remapForDataGrid } from '../utils'
import { useState } from 'react'

type PropsType = {
  data: Record<string, any>[]
  columnsOrigin: GridColDef[]
  value: string
}

const TableTabPanel: React.FC<PropsType> = ({ data, columnsOrigin, value }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50
  })
  return (
    <TabPanel key={`panel ${value}`} value={value} sx={{ width: '100%', p: 0 }}>
      <Grid container>
        <Grid item xs={12}>
          <DataGrid
            rows={remapForDataGrid(data, paginationModel)}
            columns={columnsOrigin}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={5}
            rowHeight={80}
            pagination
            style={{ minHeight: 700 }}
          />
        </Grid>
      </Grid>
    </TabPanel>
  )
}

export default TableTabPanel
