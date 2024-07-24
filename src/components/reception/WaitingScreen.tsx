import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import WaitingScreenLayout from 'src/layouts/WaitingScreenLayout'
import { useQuery } from '@apollo/client'
import { GET_RES_EXAM } from './graphql/query'
import moment from 'moment'
import { getStatusResExamForWaitingScreen } from './utils/helpers'

// *********************************************************************************** //
// ************************************ Helper *************************************** //
// *********************************************************************************** //

const columns = [
  { field: 'index', headerName: 'STT', flex: 1 },
  {
    field: 'name',
    headerName: 'Họ tên',
    flex: 1,
    renderCell: (params: any) => <div>{params.row.patName}</div>
  },
  {
    field: 'dob',
    headerName: 'Ngày sinh',
    flex: 1,
    renderCell: (params: any) => <div>{moment(params.row.dob).format('DD/MM/YYYY')}</div>
  },
  {
    field: 'doctor',
    headerName: 'Bác sĩ',
    flex: 1,
    renderCell: (params: any) => (
      <div>
        {params.row.doctor?.fristName} {params.row.doctor?.lastName}
      </div>
    )
  },
  {
    field: 'department',
    headerName: 'Phòng khám',
    flex: 1,
    renderCell: (params: any) => <div>{params.row.department?.name}</div>
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1,
    renderCell: (params: any) => (
      <div style={{ ...getStatusResExamForWaitingScreen(params.value).styles, textAlign: 'center' }}>
        {getStatusResExamForWaitingScreen(params.value).label}
      </div>
    )
  }
]

// *********************************************************************************** //
// ************************************ Component ************************************ //
// *********************************************************************************** //
const WaitingScreen = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })
  const [searchData, setSearchData] = useState({
    status: null,
    departmentId: null,
    fromDate: null,
    toDate: null,
    skip: 0,
    take: paginationModel.pageSize
  })
  const [queriesResExamCondition, setQueriesResExamCondition] = useState({
    input: {
      status: { in: ['100', '102', '104'] }
    },
    skip: searchData.skip,
    take: searchData.take,
    order: [{ createAt: 'DESC' }]
  })
  const { data: getResExamData, refetch: refetchResExam } = useQuery(GET_RES_EXAM, {
    variables: queriesResExamCondition
  })

  const resExamData: any[] = useMemo(() => getResExamData?.getResExam?.items ?? [], [getResExamData])
  console.log(resExamData)

  useEffect(() => {
    refetchResExam(queriesResExamCondition)
  }, [queriesResExamCondition, refetchResExam])

  useEffect(() => {
    const getDataInterval = setInterval(() => {
      refetchResExam()
    }, 3000)

    return () => clearInterval(getDataInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={2} style={{ width: '100%' }}>
      <Grid item xs={12}>
        <h1 style={{ textAlign: 'center', color: 'white', textTransform: 'uppercase' }}>
          Danh sách bệnh nhân đang chờ khám
        </h1>
      </Grid>
      <Grid item xs={12} style={{ width: '100%' }}>
        <DataGrid
          style={{ color: 'white', fontWeight: 'bold' }}
          rows={resExamData.map((item, index) => ({
            ...item,
            index: index + 1 + paginationModel.page * paginationModel.pageSize
          }))}
          columns={columns}
          autoHeight
          disableColumnMenu
          hideFooter
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'white',
              color: 'black'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '1.5rem'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '1.3rem'
            }
          }}
        />
      </Grid>
    </Grid>
  )
}

WaitingScreen.getLayout = (page: any) => {
  const layoutStyle = {
    backgroundColor: '#171F30',
    height: '100vh',
    width: '100%'
  }

  return <WaitingScreenLayout style={layoutStyle}>{page}</WaitingScreenLayout>
}

export default WaitingScreen
