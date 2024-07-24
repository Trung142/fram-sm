import { useMutation, useQuery } from '@apollo/client'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Card, Grid, Tab, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import toast from 'react-hot-toast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GET_RES_EXAM_SERVICE } from 'src/components/subclinical/disease-test/service_index_proc/graphql/query'
import { ResExamServiceDtInput, ServiceIndices } from './graphql/variables'
import { effect, signal } from '@preact/signals'
import { Icon } from '@iconify/react'
import Results from './Results'
import Images from 'src/components/subclinical/disease-test/service_index_proc/Images'
import { useSearchParams } from 'next/navigation'

type Props = {
  data?: any
  id?: string | undefined
  onSubmit?: () => void
}
export const resExamServiceDtInput = signal<ResExamServiceDtInput>({})

const XetNghiemProc = (props: Props) => {
  const params = useSearchParams()
  const id = params.get('id')
  const [resExamServiceDt, setResExamServiceDt] = useState<any>()
  const [input, setInput] = useState<ResExamServiceDtInput>({})
  const { data: queryData, loading, error, refetch } = useQuery(GET_RES_EXAM_SERVICE)

  const resExamService = useMemo(
    () => queryData?.getResExamServiceDt.items.find((item: any) => item.id === id) ?? [],
    [queryData, id]
  )
  useEffect(() => {
    if (resExamService) {
      resExamServiceDtInput.value = resExamService
      console.log('=======================')
      setResExamServiceDt(resExamService)
      console.log('data before', resExamService)
    }
  }, [resExamService, id])
  useEffect(() => {
    resExamServiceDtInput.subscribe(value => {
      setInput(value)
    })
  }, [])
  const [tab, setTab] = useState('results')

  const handleSetTab = (val: string) => setTab(val)

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          variant='h4'
          pl={'48px'}
          sx={{ fontWeight: 500, lineHeight: '40px', color: '#000000', letterSpacing: '0.25px' }}
        >
          XÉT NGHIỆM
        </Typography>
      </Grid>
      <Grid item xs={12} mt={6}>
        <Card sx={{ width: '100%' }}>
          <TabContext value={tab}>
            <TabList
              sx={{
                width: '100%',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#55A629'
                },
                '& .MuiTab-textColorPrimary.Mui-selected': {
                  color: '#55A629'
                }
              }}
              value={tab}
              onChange={(e, val) => handleSetTab(val)}
              aria-label='basic tabs example'
            >
              <Tab
                style={{ borderRadius: '8px' }}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 0,
                      gap: 2
                    }}
                  >
                    <Icon icon='ph:file-plus-fill' fontSize={'20px'} />
                    Kết quả
                  </Box>
                }
                value={'results'}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Icon icon='ph:file-plus-fill' fontSize={'20px'} />
                    Hình ảnh
                  </Box>
                }
                value={'images'}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Icon icon='solar:file-send-bold' fontSize={'20px'} />
                    Tệp đính kèm
                  </Box>
                }
                value={'files'}
              />
            </TabList>
            <TabPanel value='results' sx={{ width: '100%', p: 0, mt: 2 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Results data={resExamServiceDt} />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value='images' sx={{ width: '100%', p: 0, mt: 2 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Images />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value='files' sx={{ width: '100%', p: 0, mt: 2 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Box p={4} display='flex' alignItems={'center'}>
                    <Typography fontSize={'20px'}>Tệp đính kèm</Typography>
                    <Button sx={{ ml: 4 }} color='success' variant='outlined'>
                      Tải file
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

export default XetNghiemProc
