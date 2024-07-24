import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, CardContent, Paper, Tab } from '@mui/material'
import React, { useState } from 'react'
import Inventory from './Inventory'
import WarehouseCard from './WarehouseCard'
import History from './History'
import AddProduct from './AddProduct'
import { TabListWrapper } from 'src/components/service/components/custom-mui-component'

type Props = {
    data?: any
    // type?: "add" | "update";
    open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onSubmit?: () => void
  }
  
function UpdateProduct(props: Props) {
    const { data, open, onSubmit } = props
    const [tabValue, setTabValue] = useState('1')
  return (
       <CardContent>
            <TabContext value={tabValue}>
              <Box sx={{ display: 'flex', borderBottomLeftRadius: '1px solid #0292B1', gap: '30px' }}>
                <TabListWrapper onChange={(e, newValue) => setTabValue(newValue)}>
                  <Tab value='1' label='Thông Tin Hàng Hoá'/>
                  <Tab value='2' label='Tồn Kho' style={{ padding: 0, backgroundColor: '#D9D9D9' }}/>
                  <Tab value='3' label='Thẻ kho' style={{ backgroundColor: 'gray', marginLeft: '30px'}}/>
                  <Tab value='4' label='Lịch sử tác động' style={{ padding: 0, backgroundColor: 'gray' }}/>
                </TabListWrapper>
              </Box>
              <Paper>
                <TabPanel value='1'  style={{ padding: 0, backgroundColor: '#D9D9D9' }}>
               <AddProduct data={data} open={open}/>
                </TabPanel>
                <TabPanel value='2'>
                  <Inventory />
                </TabPanel>
                <TabPanel value='3'>
                  <WarehouseCard  data= {data}/>
                </TabPanel>
                <TabPanel value='4'>
                  <History />
                </TabPanel>
              </Paper>
            </TabContext>
          </CardContent>
  )
}

export default UpdateProduct
