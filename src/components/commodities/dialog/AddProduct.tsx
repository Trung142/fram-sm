import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
// import material UI
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  Paper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from '@mui/material'

import MuiSelect from 'src/@core/components/mui/select'
import { useMutation, useQuery } from '@apollo/client'

// import dữ liệu
import { GET_SEARCH_DATA, GET_USE_METHOD } from '../res_system/graphql/query'
import { ADD_PRODUCT, ADD_PRODUCT_UNIT, UPDATE_PRODUCT } from '../res_system/graphql/mutation'

// import icon
import Icon from 'src/@core/components/icon'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import Inventory from './Inventory'
import WarehouseCard from './WarehouseCard'
import History from './History'
import { ProductInput, UnitInput } from '../res_system/graphql/variables'
import { dialogType } from '../res_system'
import { getLocalstorage } from 'src/utils/localStorageSide'

type Props = {
  data?: any
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

function AddProduct(props: Props) {
  const { data, open, onSubmit } = props
  const [switchState, setSwitchState] = useState(false)
  const [unitOpen, setUnitOpen] = useState(false)
  const [show, setShow] = useMemo(() => open, [open])
  const [tabValue, setTabValue] = useState('1')

  const handleSwitchChange = (e: any) => {
    setSwitchState(e.target.checked)
  }
  const handleAddNew = () => {
    setUnitOpen(true)
  }

  const [unitData, setUnitData] = useState<UnitInput>({
    unitExchangeId: '',
    exchange: 1,
    price: 0,
    barid: ''
  })

  // ** State
  const [input, setInput] = useState<ProductInput>({
    ...data,
    index: undefined,
    __typename: undefined
  })

  // Data tìm kiếm
  const { data: searchData, refetch: refetchSearchData } = useQuery(GET_SEARCH_DATA)

  // ** Sử dụng mutation để thêm mới và cập nhật
  const [addProduct, { data: addData, loading: addLoading, error: addError }] = useMutation(ADD_PRODUCT)
  const [updateProduct, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(UPDATE_PRODUCT)
  const [addProductUnit, { data: addDataUnit, loading: addLoadingUnit, error: addErrorUnit }] =
    useMutation(ADD_PRODUCT_UNIT)

  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  // Hàm xử lý sự kiện khi dữ liệu thay đổi
  const handleAddUnit = (key: string, newValue: any) => {
    const newData = { ...unitData, [key]: newValue } // Tạo dữ liệu mới
    setUnitData(newData) // Cập nhật state
  }

  const handleChangeProduct = (key: string, newValue: any) => {
    setInput({
      ...input,
      [key]: newValue
    })
  }

  const onError = useCallback(() => {
    toast.error(
      dialogType.value === 'add' ? 'có lỗi xảy ra khi thêm mới hàng hóa' : 'có lỗi xảy ra khi Cập nhật hàng hóa'
    )
  }, [])

  const onCompleted = useCallback(() => {
    toast.success(dialogType.value === 'add' ? 'Thêm mới hàng hóa thành công' : 'Cập nhật hàng hóa thành công')
    if (onSubmit) onSubmit()
    handleClose()
  }, [handleClose, onSubmit])

  const submit = useCallback(() => {
    let updatedInput = { ...input }
    let addDataUnit = { ...unitData }
    const userLogin = getLocalstorage('userData')
    console.log('userLogin', userLogin)

    if (userLogin) {
      updatedInput = {
        ...updatedInput,
        clinicId: userLogin?.clinicId,
        parentClinicId: userLogin?.parentClinicId
      }
      if (unitOpen) {
        addDataUnit = {
          ...addDataUnit,
          clinicId: userLogin?.clinicId,
          parentClinicId: userLogin?.parentClinicId
        }
      }
    }
    if (dialogType.value === 'add') {
      addProduct({
        variables: {
          input: updatedInput
        },
        onError,
        onCompleted
      })
      if (unitOpen) {
        addProductUnit({
          variables: {
            input: addDataUnit
          }
        })
      }
    } else {
      const inputString = JSON.stringify(updatedInput)
      updateProduct({
        variables: {
          input: inputString
        },
        onError,
        onCompleted
      })
      if (unitOpen) {
        addProductUnit({
          variables: {
            input: addDataUnit
          }
        })
      }
    }
  }, [addProduct, updateProduct, addProductUnit, unitData, input, unitOpen, onError, onCompleted])

  return (
    <MuiDialogContent onClose={handleClose} onSubmit={submit}>
      <>
        <CardContent>
          <TabContext value={tabValue}>
            <Box sx={{ display: 'flex', borderBottomLeftRadius: '1px solid #0292B1' }}>
              <TabList onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab value='1' label='Thông Tin Hàng Hoá' />
                {dialogType.value === 'update' && <Tab value='2' label='Tồn Kho' />}
                {dialogType.value === 'update' && <Tab value='3' label='Thẻ kho' />}
                {dialogType.value === 'update' && <Tab value='4' label='Lịch sử tác động' />}
              </TabList>
            </Box>
            <Paper>
              <TabPanel value='1'>
                <List>
                  <ListItem>
                    <Grid container spacing={3}>
                      <Grid item xs={2} style={{ marginTop: 30 }}>
                        <MuiSelect
                          data={searchData?.commodities?.items ?? []}
                          fullWidth
                          required
                          variant='outlined'
                          shrink
                          value={input?.commoditiesId}
                          label='Loại Hàng Hóa'
                placeholder='Chọn Loại Hàng Hóa'
                          onChange={e => {
                            handleChangeProduct('commoditiesId', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginRight: 30, marginTop: 30 }}>
                        <MuiSelect
                          data={searchData?.commodityGroup?.items ?? []}
                          fullWidth
                          required
                          variant='outlined'
                          shrink
                          value={input?.commodityGroupId}
                          label='Nhóm Sản Phẩm'
                          placeholder='Chọn Nhóm Sản Phẩm'
                          onChange={e => {
                            handleChangeProduct('commodityGroupId', e.target.value)
                          }}
                        />
                      </Grid>
                      <FormGroup style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label='Quản Lý Lô'
                          defaultChecked
                          onChange={(e, checked) => {
                            handleChangeProduct('batchYn', checked)
                          }}
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label='Trạng Thái'
                          onChange={(e, checked) => {
                            handleChangeProduct('status', checked)
                          }}
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label='Liên thông DQG'
                          onChange={(e, checked) => {
                            handleChangeProduct('connectDqg', checked)
                          }}
                        />
                        <FormControlLabel
                          // chưa có table
                          control={
                            <Switch
                              onClick={handleSwitchChange}
                          checked={switchState}
                              onChange={(e, checked) => {
                                handleChangeProduct('bhytYn', checked)
                              }}
                            />
                          }
                          label='BHYT'
                        />
                        <FormControlLabel
                          // chưa có table
                          control={<Switch defaultChecked />}
                          label='Chi Nhánh Hiện Tại'
                          onChange={(e, checked) => {
                            handleChangeProduct('status', checked)
                          }}
                        />
                      </FormGroup>
                      <Grid item xs={2} style={{ marginTop: 30 }}>
                        <TextField
                          label='Mã hàng'
                          placeholder='Nhập mã hàng'
                          variant='outlined'
                          disabled
                          fullWidth
                          multiline
                          defaultValue={input?.id}
                          InputLabelProps={{ shrink: true }}
                          onBlur={e => {
                            handleChangeProduct('id', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={4} style={{ marginTop: 30 }}>
                        <TextField
                          label='Tên hàng hoá'
                          placeholder='Nhập tên hàng hoá'
                          variant='outlined'
                          fullWidth
                          multiline
                          defaultValue={input?.productName}
                          InputLabelProps={{ shrink: true }}
                          onBlur={e => {
                            handleChangeProduct('productName', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{ marginTop: 30 }}>
                        <TextField
                          label='Hãng sản xuất'
                          placeholder='Nhập hãng sản xuất'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.manufacturer}
                          onBlur={e => {
                            handleChangeProduct('manufacturer', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{ marginTop: 30 }}>
                        <TextField
                          label='Nước sản xuất'
                          placeholder='Nhập nước sản xuất'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.manufacturerContry}
                          onBlur={e => {
                            handleChangeProduct('manufacturerContry', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{ marginTop: 30 }}>
                        <TextField
                          label='Mô tả sản phẩm'
                          placeholder='Nhập mô tả'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.describe}
                          onBlur={e => {
                            handleChangeProduct('describe', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: 30 }}>
                        <MuiSelect
                          label='Đơn vị'
                          fullWidth
                          multiline
                          variant='outlined'
                          shrink
                          placeholder='Chọn Đơn vị'
                          data={searchData?.unit?.items ?? []}
                          value={input?.unitId}
                          onChange={e => {
                            handleChangeProduct('unitId', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: 30 }}>
                        <TextField
                          label='Giá bán'
                          placeholder='Nhập giá'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.price}
                          onBlur={e => {
                            handleChangeProduct('price', Number(e.target.value))
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: 30 }}>
                        <TextField
                          label='VAT'
                          placeholder='Nhập VAT'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.vat}
                          onBlur={e => {
                            handleChangeProduct('vat', Number(e.target.value))
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: 30 }}>
                        <TextField
                          label='Mã vạch'
                          placeholder='Nhập mã vạch'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.barId}
                          onBlur={e => {
                            handleChangeProduct('barId', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: 30 }}>
                        <TextField
                          label='Tồn kho tối thiểu'
                          placeholder='Nhập tồn'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.minimumInventory}
                          onBlur={e => {
                            handleChangeProduct('minimumInventory', Number(e.target.value))
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: 30 }}>
                        <TextField
                          label='Tồn kho tối đa'
                          placeholder='Nhập tồn'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.maximumInventory}
                          onBlur={e => {
                            handleChangeProduct('maximumInventory', Number(e.target.value))
                          }}
                        />
                      </Grid>
                      {switchState && (
                        <>
                          <Grid item xs={2} style={{ marginTop: 30 }}>
                            <TextField
                              label='Mã BHYT'
                              placeholder='Nhập mã BHYT'
                              variant='outlined'
                              fullWidth
                              multiline
                              InputLabelProps={{ shrink: true }}
                              defaultValue={input?.bhytId}
                              onBlur={e => {
                                handleChangeProduct('bhytId', e.target.value)
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} style={{ marginTop: 30 }}>
                            <TextField
                              label='Tên BHYT'
                              placeholder='Nhập tên BHYT'
                              variant='outlined'
                              fullWidth
                              multiline
                              InputLabelProps={{ shrink: true }}
                              defaultValue={input?.bhytName}
                              onBlur={e => {
                                handleChangeProduct('bhytName', e.target.value)
                              }}
                            />
                          </Grid>
                          <Grid item xs={3} style={{ marginTop: 30 }}>
                            <TextField
                              label='Tỷ lệ thanh toán BHYT'
                              placeholder='Nhập tỷ lệ thanh toán BHYT'
                              variant='outlined'
                              fullWidth
                              multiline
                              InputLabelProps={{ shrink: true }}
                              defaultValue={input?.insurancePaymentRate}
                              onBlur={e => {
                                handleChangeProduct('insurancePaymentRate', Number(e.target.value))
                              }}
                            />
                          </Grid>
                          <Grid item xs={3} style={{ marginTop: 30 }}>
                            <TextField
                              label='Đơn giá BHYT'
                              placeholder='Nhập đơn giá BHYT'
                              variant='outlined'
                              fullWidth
                              multiline
                              InputLabelProps={{ shrink: true }}
                              defaultValue={input?.bhytPrict}
                              onBlur={e => {
                                handleChangeProduct('bhytPrict', Number(e.target.value))
                              }}
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={2} style={{ marginTop: 30 }}>
                        <TextField
                          label='Đăng ký'
                          placeholder='Nhập số đăng ký'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.resNumber}
                          onBlur={e => {
                            handleChangeProduct('resNumber', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{ marginTop: 30 }}>
                        <TextField
                          label='Hoạt chất'
                          placeholder='Nhập hoạt chất'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.ingredients}
                          onBlur={e => {
                            handleChangeProduct('ingredients', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{ marginTop: 30 }}>
                        <TextField
                          label='Quy cách'
                          placeholder='Nhập quy cách'
                          variant='outlined'
                          fullWidth
                          multiline
                          InputLabelProps={{ shrink: true }}
                          defaultValue={input?.specifications}
                          onBlur={e => {
                            handleChangeProduct('specifications', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: 30 }}>
                        <MuiSelect
                          fullWidth
                          label='Đơn vị'
                          variant='outlined'
                          shrink
                          placeholder='Chọn Đơn vị'
                          data={searchData?.unit?.items ?? []}
                          value={input?.prescribingUnitId}
                          onChange={e => {
                            handleChangeProduct('prescribingUnitId', e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: 30 }}>
                        <MuiSelect
                          fullWidth
                          label='Đường dùng'
                          variant='outlined'
                          shrink
                          placeholder='Chọn Đường dùng'
                          data={searchData?.instructions?.items ?? []}
                          value={input?.instructionsId}
                          onChange={e => {
                            handleChangeProduct('instructionsId', e.target.value)
                          }}
                        />
                      </Grid>
                      <CardContent>
                        <Button variant='contained' color='primary' onClick={handleAddNew}>
                          <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                          Thêm mới
                        </Button>
                      </CardContent>
                      <CardContent>
                        <Button variant='contained' color='primary' sx={{ marginTop: 6 }}>
                          <Icon icon='bx:bx-plus' fontSize={20} style={{ marginRight: 5 }} />
                          Thêm Hình Ảnh
                        </Button>
                      </CardContent>
                      {/* <AddUnit onUnitDataSubmit={handleUnitData} onSubmit = {submit}/> */}
                      {unitOpen && (
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>Đơn Vị Tính</TableCell>
                              <TableCell>Quy Đổi</TableCell>
                              <TableCell>Giá Bán</TableCell>
                              <TableCell>Mã Vạch</TableCell>
                              <TableCell></TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell>
                                {/* <TextField
                    multiline
                    InputLabelProps={{ shrink: true }}
                    defaultValue={input?.unitId}
                    onBlur={(e) => handleAddUnit('productId', e.target.value)}
                  /> */}
                                <MuiSelect
                                  fullWidth
                                  data={searchData?.unit?.items ?? []}
                                  value={unitData?.unitExchangeId}
                                  onChange={e => handleAddUnit('unitExchangeId', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  multiline
                                  InputLabelProps={{ shrink: true }}
                                  defaultValue={unitData?.exchange}
                                  onBlur={e => handleAddUnit('exchange', Number(e.target.value))}
                                />
                                {/* <MuiSelect
                  fullWidth
                  data={searchData?.unit?.items ?? []}
                  value={unitData?.exchange}
                  onChange={(e) => handleAddUnit('exchange', e.target.value)}
                /> */}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  multiline
                                  InputLabelProps={{ shrink: true }}
                                  defaultValue={unitData?.price}
                                  onBlur={e => handleAddUnit('price', Number(e.target.value))}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  multiline
                                  InputLabelProps={{ shrink: true }}
                                  defaultValue={unitData?.barid}
                                  onBlur={e => handleAddUnit('barid', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button>
                                  <Icon icon='bx:bx-trash' fontSize={30} style={{ marginRight: 5 }} color='red' />
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                    </Grid>
                  </ListItem>
                </List>
              </TabPanel>
              <TabPanel value='2'>
                <Inventory data={data} />
              </TabPanel>
              <TabPanel value='3'>
                <WarehouseCard data={data} />
              </TabPanel>
              <TabPanel value='4'>
                <History />
              </TabPanel>
            </Paper>
          </TabContext>
        </CardContent>
      </>
    </MuiDialogContent>
  )
}
AddProduct.defaultProps = {
  type: 'update'
}
export default AddProduct
