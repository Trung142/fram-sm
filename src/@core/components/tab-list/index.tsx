import React from 'react'
import { Box, Typography, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { DataGrid } from '@mui/x-data-grid'

const TabComponent = ({
  currentTab,
  onTabChange,
  tabData,
  columns
}: {
  currentTab: string
  onTabChange: (event: any, value: any) => void
  tabData: Array<any>
  columns: Array<any>
}) => {
  const renderTabs = () =>
    tabData.map(tabItem => (
      <Tab
        key={tabItem.value}
        label={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>{tabItem.label}</Typography>
            <Typography
              sx={{
                color: '#fff',
                ml: 4,
                backgroundColor: 'red',
                borderRadius: '50%',
                width: '1.5rem',
                height: '1.5rem'
              }}
            >
              {tabItem.length}
            </Typography>
          </Box>
        }
        value={tabItem.value}
        style={currentTab === tabItem.value ? { backgroundColor: '#025061' } : {}}
      />
    ))

  const renderTabPanels = () =>
    tabData.map(tabItem => (
      <TabPanel key={tabItem.value} value={tabItem.value} sx={{ width: '100%', p: 0 }}>
        <DataGrid
          rows={tabItem.data}
          columns={columns}
          rowCount={5}
          rowHeight={80}
          pagination
          style={{ minHeight: 700 }}
        />
      </TabPanel>
    ))

  return (
    <TabContext value={currentTab}>
      <TabList sx={{ backgroundColor: '#0292B1' }} onChange={onTabChange} aria-label='basic tabs example'>
        {renderTabs()}
      </TabList>
      {renderTabPanels()}
    </TabContext>
  )
}

export default TabComponent
