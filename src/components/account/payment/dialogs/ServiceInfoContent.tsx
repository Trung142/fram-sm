import {
  Grid,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Box,
  Paper,
  Autocomplete,
  IconButton
} from '@mui/material'
// Material-UI icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Fragment, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_DEPARTMENT, GET_SERVICE_GROUP } from '../graphql/query'
import { ServiceGroup } from '../graphql/types'
import { Icon } from '@iconify/react'

const ServiceInfoContent: React.FC = () => {
  const selectedServices = []

  const { data: getServiceGroup } = useQuery(GET_SERVICE_GROUP)
  const serviceGroupData: ServiceGroup[] = useMemo(() => {
    return getServiceGroup?.getServiceGroup?.items ?? []
  }, [getServiceGroup])

  const { data: getDepartmentData } = useQuery(GET_DEPARTMENT, {})
  const departmentData: any[] = useMemo(() => {
    return getDepartmentData?.getDepartment?.items ?? []
  }, [getDepartmentData])

  const departmentDataTypePK = useMemo(
    () => departmentData.filter(department => department.id.split('_')[0] === 'PK'),
    [departmentData]
  )
  return (
    <Grid container>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 650,
              mt: 5,
              overflow: 'hidden',
              borderTopRadius: '12px',
              border: '2px solid #e0e0e0'
            }}
            aria-label='simple table'
          >
            <TableHead sx={{ backgroundColor: '#D9D9D9', borderBottomColor: '#32475C61' }}>
              <TableRow>
                <TableCell style={{ width: '10%' }}>STT</TableCell>
                <TableCell style={{ width: '32%' }}>DỊCH VỤ</TableCell>
                <TableCell style={{ width: '8%' }}>ĐVT</TableCell>
                <TableCell style={{ width: '8%' }}>ĐƠN GIÁ</TableCell>
                <TableCell style={{ width: '8%' }}>SỐ LƯỢNG</TableCell>
                <TableCell style={{ width: '8%' }}>Thành tiền</TableCell>
                <TableCell style={{ width: '8%' }}>BH</TableCell>
                <TableCell style={{ width: '8%' }}>MP</TableCell>
                <TableCell style={{ width: '10%' }}>TT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {selectedServices.map(({ serviceGroupId, services }, groupIndex) => (
                <Fragment key={serviceGroupId}>
                  <TableRow>
                    <TableCell
                      component='th'
                      scope='row'
                      colSpan={9}
                      style={{ backgroundColor: '#f0f0f0', color: 'green' }}
                    >
                      <IconButton>
                        <ArrowDropDownIcon />
                      </IconButton>
                      {serviceGroupData.find(item => item.serviceGroupId === serviceGroupId)?.name}
                    </TableCell>
                  </TableRow>
                  {services.map((service, serviceIndex) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.id}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{service.cost}</TableCell>
                      <TableCell>{service.quantity}</TableCell>
                      <TableCell>{(service.cost || 0) * (service.quantity || 0)}</TableCell>
                      <TableCell>{service.bhytPrice}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <IconButton>
                          <AttachMoneyIcon />
                        </IconButton>
                        <IconButton>
                          <Icon icon='bx:bx-dots-horizontal-rounded' fontSize={24} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default ServiceInfoContent
