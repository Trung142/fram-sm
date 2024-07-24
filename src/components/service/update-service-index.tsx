import { useCallback, useMemo, useState, useTransition } from 'react'
import Icon from 'src/@core/components/icon'
import MuiDialogContent from './components/diaglogContent'
import { dialogTypeProc } from './update-service'
import styles from './add-new-service.module.scss'
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { TinyButton, StyledRequiredTextField, GreyDataGrid } from './components/custom-mui-component'
import MUIDialog from 'src/@core/components/dialog'
import UpdateComparisonReferenceValue from './update-comparison-reference-value'
import { TabContext, TabPanel } from '@mui/lab'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { GET_INDEX_TYPE, GET_COM_REFER_VALUE, GET_SERVICE_INDEX_PROCS, GET_SERVICE_INDEX } from './graphql/query'
import { useMutation, useQuery } from '@apollo/client'
import MuiSelect from 'src/@core/components/mui/select'
import {
  ADD_SERVICE_INDEX,
  UPDATE_SERVICE_INDEX,
  UPDATE_SERVICE_INDEX_PROC,
  ADD_SERVICE_INDEX_PROC,
  UPDATE_COMREFER_VALUE
} from './graphql/mutation'
import toast from 'react-hot-toast'
import { getLocalstorage } from 'src/utils/localStorageSide'
import { number } from 'yup'
import ActivityTag from './components/activity-tag'

type UpdateServiceIndexProps = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
  data?: any
  dataLenght?: any
}

const dataUs = getLocalstorage('userData')

enum IndexType {
  normalIndex = 'normalIndex',
  parentIndex = 'fatherIndex',
  childIndex = 'subIndex'
}
const UpdateServiceIndex = (props: UpdateServiceIndexProps) => {
  const { data, open, onSubmit, dataLenght } = props
  const openAddComparisonValue = useState(false)
  const [show, setShow] = useMemo(() => open, [open])
  const [childIndexId, setChildIndexId] = useState<any>()
  const [fatherIndexId, setFatherIndexId] = useState<any>()
  const [tab, setTab] = useState('1')
  const [dialogType, setDialogType] = useState('')
  const [dataUpdateComrefer, setDataUpdateComrefer] = useState<any>()
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [input, setInput] = useState({
    ...data,
  })

  const theme = useTheme()
  const [decimalNumber, setDecimalNumber] = useState(0)
  const [chosenIndex, setChosenIndex] = useState<IndexType>(input?.normalIndex ? IndexType.normalIndex : input?.fatherIndex ? IndexType.parentIndex : IndexType.childIndex)

  // ========Lấy data==========
  const { data: IndexTypedata } = useQuery(GET_INDEX_TYPE)
  const indexDataType = useMemo(() => IndexTypedata?.getIndexType?.items ?? [], [IndexTypedata])

  const { data: comReferData, refetch: refetchComrefervalue } = useQuery(GET_COM_REFER_VALUE,{
    variables:{
      input:{
        deleteYn: { eq: false },
        serviceIndexId : {eq:input?.id}
      }
    }
  })
  const comReferValues = useMemo(() => comReferData?.getComReferValue?.items ?? [], [comReferData])
  const { data: indexProcsData } = useQuery(GET_SERVICE_INDEX_PROCS, {
    variables: {
      input: {
        serviceId: { eq: input?.serviceId },
        deleteYn: { eq: false }
      }
    }
  })
  const indexProcValue = useMemo(() => indexProcsData?.getServiceIndexProc?.items ?? [], [indexProcsData])

  const { data: IndexDatas } = useQuery(GET_SERVICE_INDEX, {
    variables: {
      input: {
        serviceId: { eq: input?.serviceId },
        deleteYn: { eq: false },
      }
    }
  })
  const indexDatasValue = useMemo(() => IndexDatas?.getServiceIndex?.items ?? [], [IndexDatas])

  //=========Mutation==========
  const [addServiceIndex, { data: addDataIndex, loading: addIndexLoading, error: addIndexError }] = useMutation(ADD_SERVICE_INDEX)
  const [addServiceIndexProc, { data: addServiceIndexPropData, loading: addServiceIndexPropLoading, error: addServiceIndexPropError }] = useMutation(ADD_SERVICE_INDEX_PROC)

  const [updateServiceIndexProc, { data: updateServiceIndexPropdata, loading: updateServiceIndexPropLoading, error: updateServiceIndexPropError }] = useMutation(UPDATE_SERVICE_INDEX_PROC)
  const [updateServiceIndex, { data: updateDataIndex, loading: updateIndexLoading, error: updateIndexError }] = useMutation(UPDATE_SERVICE_INDEX)
  const [updateComReferValue] = useMutation(UPDATE_COMREFER_VALUE)


  const fatherIndexfilter = indexProcValue.filter((x: any) => x.serviceIndex.fatherIndex === true)
  const arrFatherIndex = []
  for (let i = 0; i < fatherIndexfilter.length; i++) {
    arrFatherIndex.push(fatherIndexfilter[i].id)
  }


  const subIndexfilter = indexProcValue.filter((x: any) => x.serviceIndex.subIndex === true || x.serviceIndex.normalIndex === true && x.serviceIndex.id !== input?.id)


  const handleTogglePopup = (() => {
    openAddComparisonValue[1](true)
    setDialogType("add")
    setDataUpdateComrefer({
      serviceIndexId:input?.id,
      greatestValue: 0,
      smallestValue: 0,
      allAge: true,
      allgender: true
    })
  })

  const handleChangeTypeIndex = (key: any, value: any) => {
    if (key === "normalIndex") {
      setInput({
        ...input,
        [key]: value,
        fatherIndex: null,
        subIndex: null
      })
    }
    if (key === "fatherIndex") {
      setInput({
        ...input,
        [key]: value,
        normalIndex: null,
        subIndex: null
      })
    }
    if (key === "subIndex") {
      setInput({
        ...input,
        [key]: value,
        normalIndex: null,
        fatherIndex: null
      })
    }
  }

  const handleChange = (key: any, value: any) => {
    if (key === "indexTypeId" && value === "ID0000003") {
      setDecimalNumber(decimalNumber)
    } else {
      setDecimalNumber(0)
    }
    setInput({
      ...input,
      [key]: value
    })
  }

  const handleOpenUpdateComFerValue = ((data: any) => {
    setDataUpdateComrefer({
      male: data.male,
      female: data.female,
      allgender: data.gender,
      id: data.id,
      allAge: data.allAge,
      fromAge: data.fromAge,
      toAge: data.toAge,
      greatestValue: data.greatestValue,
      smallestValue: data.smallestValue
    })
    openAddComparisonValue[1](true)
    setDialogType("update")
    setInput({
      ...input,
    })
  })


  const handleDeleteComFerValue = useCallback((data: any) => {
    updateComReferValue({
      variables: {
        input: JSON.stringify({
          id: data.id,
          deleteYn: true
        })
      }
    }).then(refetchComrefervalue)
  }, [updateComReferValue, refetchComrefervalue])

  const COLUMN_DEF_SERVICE_INDEX: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 132,
      field: 'index',
      maxWidth: 150,
      headerName: '#'
    },

    {
      flex: 0.25,
      minWidth: 334,
      field: 'male',
      headerName: 'Giới tính',
      maxWidth: 350,
      renderCell(params) {
        let gender = ""
        if (params.value) {
          gender = "Nam"
        } else {
          if (params.row?.female) {
            gender = "Nữ"
          } else {
            gender = "Tất cả"
          }
        }
        return (
          <span>{gender}</span>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 285,
      field: 'allAge',
      maxWidth: 25,
      headerName: 'Độ tuổi',
      renderCell(params) {
        let isAllage = ""
        if (params.value) {
          isAllage = "Tất cả độ tuổi"
        } else {
          isAllage = "Giới hạn"
        }
        return (
          <span>{isAllage}</span>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 243,
      field: 'smallestValue',
      maxWidth: 245,
      headerName: 'Gt nhỏ nhất'
    },
    {
      flex: 0.15,
      minWidth: 243,
      field: 'greatestValue',
      maxWidth: 245,
      headerName: 'Gt lớn nhất'
      // valueGetter: params => params.row.serviceGroup.label
    },
    {
      flex: 0.1,
      field: '',
      minWidth: 150,
      headerName: 'Thao tác',
      renderCell: (params) => (
        <div className='flex justify-center'>
          <IconButton
            title='Chỉnh sửa'

            onClick={() => {
              handleOpenUpdateComFerValue(params.row);
            }}
          >
            <Icon icon='bx:edit-alt' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
          <IconButton title='Xoá'
            onClick={() => {
              handleDeleteComFerValue(params.row);
            }}>
            <Icon icon='bx:trash' fontSize={20} style={{ marginRight: 5 }} />
          </IconButton>
        </div>
      )
    }
  ]
  const COLUMN_DEF_VICE_SERVICE_INDEX: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'index',
      maxWidth: 100,
      headerName: '#',
    },
    {
      flex: 0.25,
      field: 'service.name',
      headerName: 'Tên chỉ số',
      renderCell: params => <Typography align='center'>{params.row.service.name}</Typography>
    },
    {
      flex: 0.25,
      field: 'serviceIndex.indexType.name',
      headerName: 'Loại chỉ số',
      renderCell(params) {
        if (params?.row?.serviceIndex?.subIndex === true) {
          const subIndexName = "Chỉ Số Con"
          return (
            <ActivityTag
              type='warning'
            >
              {subIndexName}
            </ActivityTag>
          )
        } else {
          const NormalIndexName = "Chỉ Số Thường"
          return (
            <ActivityTag
              type='success'
            >
              {NormalIndexName}
            </ActivityTag>
          )
        }

      },
      valueGetter: params => params.row.serviceIndex.subIndex
    },
    {
      flex: 0.25,
      field: 'serviceIndex.unit',
      headerName: 'Đơn Vị',
      renderCell: params => <Typography align='center'>{params.row.serviceIndex.unit}</Typography>
    }
  ]

  const validateNum = ((checkValue: any) => {
    if (checkValue < 0) {
      return true
    } else {
      return false
    }
  })

  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  const onCompleted = useCallback(() => {
    toast.success('Cập nhật dịch vụ thành công')
    if (onSubmit) onSubmit()
    handleClose()
  }, [handleClose, onSubmit])

  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật dịch vụ')
  }, [])

  const submit = useCallback(() => {
    if (input.name === '' || input.name == null) {
      toast.error("Lỗi cập nhật")
      return
    }
    if (childIndexId && childIndexId === fatherIndexId) {
      toast.error("Nhập lại mã chỉ số ")
      return
    }
    if (!input?.indexTypeId) {
      toast.error("Vui lòng chọn kiểu dữ liệu")
      return
    }
    if (!input?.price || validateNum(input?.price)) {
      toast.error("Vui lòng nhập lại giá bán")
      return
    }
    if (!input?.cost || validateNum(input?.cost)) {
      toast.error("Vui lòng nhập lại giá bán")
      return
    }
    if (dialogTypeProc.value === "addProc") {
      addServiceIndex({
        variables: {
          input: {
            ...input,
            id: childIndexId ? childIndexId : undefined,
          }
        }
      }).then((res: any) => {
        addServiceIndexProc({
          variables: {
            input: {
              serviceId: res?.data?.addServiceIndex.serviceId,
              serviceIndexId: res?.data?.addServiceIndex?.id,
              deleteYn: false,
              clinicId: dataUs.clinicId,
              parentClinicId: dataUs.parentClinicId
            }
          }, onError
          , onCompleted
        })
      })
    } else {
      updateServiceIndex({
        variables: {
          input: JSON.stringify(input)
        }, onError
        , onCompleted
      })
    }

  }, [updateServiceIndex, addServiceIndex, input, onError, onCompleted, addServiceIndexProc, childIndexId, fatherIndexId])

  return (
    <MuiDialogContent
      onClose={handleClose}
      onSubmit={submit}
      dialogActionsStyles={{ justifyContent: 'flex-end' }}
      dialogActionsConfirm={
        <>
          <Icon icon='bx:check' />
          Lưu
        </>
      }
      dialogActionsCancel={
        <>
          <Icon icon='bx:x' />
          Đóng
        </>
      }
    >
      <TabContext value={tab}>
        {/* Tabs */}
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label='Thông tin chỉ số' value='1' />
          {chosenIndex === IndexType.parentIndex && <Tab label='Chỉ số phụ' value='2' />}
        </Tabs>
        {/* End Tabs */}
        <TabPanel value='1'>
          {/* Header */}
          <Grid container marginTop={6} marginBottom={4}>
            <Grid item xs>
              <FormControl>
                <FormLabel id='index-group-label'>Loại chỉ số</FormLabel>
                <RadioGroup
                  onChange={e => {
                    setChosenIndex(e.target.value as IndexType);
                    handleChangeTypeIndex(e.target.value, true)
                  }}
                  id='index-group-label'
                  value={chosenIndex}
                  row
                  name='radio-buttons-group'
                >
                  <Stack direction='row' spacing={4}>
                    <FormControlLabel value={IndexType.normalIndex} control={<Radio />} label='Chỉ số thường' />
                    <FormControlLabel value={IndexType.parentIndex} control={<Radio />} label='Chỉ số cha' />
                    {arrFatherIndex.length !== 0 && (
                      <FormControlLabel value={IndexType.childIndex} control={<Radio />} label='Chỉ số con' />)}

                  </Stack>
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs>
              {chosenIndex === IndexType.childIndex && (
                <Autocomplete
                  fullWidth
                  options={arrFatherIndex}
                  renderInput={params => <StyledRequiredTextField {...params} required label='Chỉ số cha' />}
                  placeholder='Chọn chỉ số cha'
                  onInputChange={(_, newInputValue) => {
                    setFatherIndexId(newInputValue)
                  }}
                />
              )}
            </Grid>
          </Grid>
          {/* End Header */}

          {/* Body service-type + service fields */}
          <Box marginY={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Tên Chỉ Số'
                  disabled={input?.name ? false : true}
                  value={input?.name}
                  onBlur={e => handleChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <MuiSelect
                  fullWidth
                  label='Kiểu Chỉ Số'
                  required
                  data={indexDataType}
                  value={input?.indexTypeId}
                  onChange={(e: any) => {
                    handleChange('indexTypeId', e.target.value)
                  }}
                />
              </Grid>{' '}
              {input?.indexTypeId === "ID0000003" && (
                <Grid item xs={1} display={'flex'} >
                  <TextField
                    className={styles['custom-input']}
                    value={decimalNumber}
                    label='Thập phân'
                    InputProps={{
                      endAdornment: (
                        <Stack style={{ height: '100%' }}>
                          <button
                            onClick={() => setDecimalNumber(prev => ++prev)}
                            style={{ backgroundColor: theme.palette.primary.main }}
                            className={styles['custom-button']}
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              if (decimalNumber === 1) return
                              setDecimalNumber(prev => --prev)
                            }}
                            style={{ backgroundColor: theme.palette.primary.main }}
                            className={styles['custom-button']}
                          >
                            -
                          </button>
                        </Stack>
                      )
                    }}
                    onChange={e => {
                      //handleChangeIndex('unit', e.target.value)
                    }}
                  />
                </Grid>
              )}
              {(chosenIndex !== IndexType.childIndex || input?.subIndex === true) && (
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    disabled={(input?.subIndex && dialogTypeProc.value === "addProc") ? false : true}
                    label='Mã Chỉ Số'
                    defaultValue={input?.id ? input?.id : undefined}
                    inputProps={{ maxLength: 21 }}
                    onBlur={e => setChildIndexId(e.target.value)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
          <Box marginTop={3}>
            <Stack direction='row'>
              <TextField
                label='Giá trị tham chiểu'
                fullWidth
                disabled={chosenIndex === IndexType.parentIndex ? true : false}
                defaultValue={input?.referenceValue}
                onBlur={e=>{handleChange('referenceValue',e.target.value)}}
              />
              <TinyButton onClick={handleTogglePopup} variant='contained' color='primary' size='medium'>
                <Icon icon='bx:plus' fontSize={22} />
              </TinyButton>
            </Stack>
          </Box>
          {/*End Body service-type + service fields */}

          {/* Table */}
          <Box marginTop={4}>
            <GreyDataGrid
              hideFooter
              rows={comReferValues.map((item: any, index: any) => ({ ...item, index: index + 1 }))}
              columns={COLUMN_DEF_SERVICE_INDEX}
              paginationMode='server'
              loading={false}
              slots={{
                noRowsOverlay: () => (
                  <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                )
              }}
              style={{ height: comReferValues.length ? '30vh' : 0, marginTop: '32px' }}

            />
          </Box>
          {/* End Table */}
          <Box marginY={6}>
            <TextField
              label='Giá trị mặc định' sx={{ width: '80%' }}
              defaultValue={input?.defaultValue}
              disabled={chosenIndex === IndexType.parentIndex ? true : false}
              onBlur={e => handleChange("defaultValue", e.target.value)}
            />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <TextField
                fullWidth label='Giá bán'
                defaultValue={input?.price}
                onBlur={e => handleChange("price", parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth label='Giá vốn'
                defaultValue={input?.cost}
                onBlur={e => handleChange("cost", parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth label='Đơn vị'
                defaultValue={input?.unit}
                disabled={chosenIndex === IndexType.parentIndex ? true : false}
                onBlur={e => handleChange("unit", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth label='Máy xét nghiệm'
                defaultValue={input?.testers}
                disabled={chosenIndex === IndexType.parentIndex ? true : false}
                onBlur={e => handleChange("testers", e.target.value)}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value='2'>
          <GreyDataGrid
            rows={subIndexfilter.map((item: any, index: any) => ({
              ...item,
              index: index + 1
            }))}
            hideFooter
            rowCount={10}
            columns={COLUMN_DEF_VICE_SERVICE_INDEX}
            paginationMode='server'
            loading={false}
            style={{ height: subIndexfilter.length ? '30vh' : 0 }}
            slots={{
              noRowsOverlay: () => (
                <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
              )
            }}
          />
        </TabPanel>
        {/* Modal add new comparison value */}
        <MUIDialog
          maxWidth='md'
          open={openAddComparisonValue}
          title={dialogType === "add" ? 'Giá trị tham chiếu so sánh' : 'Cập nhật giá trị tham chiếu so sánh'}
        >
          <UpdateComparisonReferenceValue data={dataUpdateComrefer} open={openAddComparisonValue} onSubmit={refetchComrefervalue} decimal={decimalNumber} dialogType={dialogType} />
        </MUIDialog>
      </TabContext>
    </MuiDialogContent>
  )
}

export default UpdateServiceIndex
