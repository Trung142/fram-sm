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
  CardContent,
  Box,
  Paper,
  Autocomplete
} from '@mui/material'
// Material-UI icons
import SearchIcon from '@mui/icons-material/Search'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SERVICE, GET_SERVICE_GROUP } from '../graphql/query'
import { Service, ServiceGroup } from '../graphql/types'
import ServiceRow from './service-card/ServiceRow'
import CardTemplate from './CardTemplate'
import InputServiceSearch from 'src/components/inputSearch/InputServiceSearch'

type ServiceCardPropsType = {
  selectedServices: ServiceGroup[]
  departmentDataTypePK: any[]
  handleSelectService: (service: Service) => void
  handleRemoveService: (groupId: string, serviceId: string) => void
  handleServiceListModalOpen: () => void
  handleUpdateService: (service: Service) => void
  exploreObjectsId: any
}

const ServiceCard: React.FC<ServiceCardPropsType> = ({
  selectedServices,
  handleSelectService,
  handleRemoveService,
  departmentDataTypePK,
  handleServiceListModalOpen,
  handleUpdateService,
  exploreObjectsId
}) => {
  const [autoComplete, setAutoComplete] = useState<boolean>(false)
  const { data: getServiceData } = useQuery(GET_SERVICE)
  const servicesData: Service[] = useMemo(() => {
    return getServiceData?.getService?.items ?? []
  }, [getServiceData])

  const { data: getServiceGroup } = useQuery(GET_SERVICE_GROUP)
  const serviceGroupData: ServiceGroup[] = useMemo(() => {
    return getServiceGroup?.getServiceGroup?.items ?? []
  }, [getServiceGroup])

  return (
    <CardTemplate title='Dịch vụ'>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <div style={{ display: 'flex' }}>
              <InputServiceSearch
                placeholder='Nhập mã, tên dịch vụ'
                onClick={(option: any) => {
                  handleSelectService(option)
                  setAutoComplete(false)
                }}
              />
              <Button
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                variant='contained'
                style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
                onClick={handleServiceListModalOpen}
              >
                <SearchIcon />
              </Button>
            </div>
          </Grid>
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
                    <TableCell style={{ width: '10%' }}>DỊCH VỤ</TableCell>
                    <TableCell style={{ width: '40%' }}>PHÒNG BAN</TableCell>
                    <TableCell style={{ width: '15%' }}>ĐƠN GIÁ</TableCell>
                    <TableCell style={{ width: '15%' }}>SL</TableCell>
                    <TableCell style={{ width: '10%' }}>XOÁ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedServices.map(({ serviceGroupId, services }, groupIndex) => (
                    <Fragment key={serviceGroupId}>
                      <TableRow>
                        <TableCell component='th' scope='row' colSpan={6} style={{ backgroundColor: '#f0f0f0' }}>
                          {serviceGroupData.find(item => item.serviceGroupId === serviceGroupId)?.name}
                        </TableCell>
                      </TableRow>
                      {services &&
                        services.map((service, serviceIndex) => (
                          <ServiceRow
                            handleUpdateService={handleUpdateService}
                            exploreObjectsId={exploreObjectsId}
                            departmentDataTypePK={departmentDataTypePK}
                            key={exploreObjectsId}
                            service={service}
                            groupId={groupIndex}
                            serviceId={serviceIndex}
                            handleRemove={() => serviceGroupId && handleRemoveService(serviceGroupId, service.id || '')}
                          />
                        ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </CardTemplate>
  )
}

export default ServiceCard
