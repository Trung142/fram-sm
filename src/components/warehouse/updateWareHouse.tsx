import { TabContext } from '@mui/lab'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Checkbox, Grid, IconButton, Tab, TextField, Typography, styled, useTheme } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import MuiDialogContent from './components/diaglogContent'
import { TabListWrapper } from '../service/components/custom-mui-component'
import Icon from 'src/@core/components/icon'
import { useMutation, useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { WareHouseType } from './graphql/variables'

//** Graphql */
import { GET_WAREHOUSE_TYPE, GET_USER } from './graphql/query'
import { UPDATE_WAREHOUSE, ADD_WAREHOUSE } from './graphql/mutation'


import MuiSelect from 'src/@core/components/mui/select'
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from '@mui/x-data-grid'

type UpdateWareHouseProp = {
    open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onSubmit?: () => void
    data?: any
    dialogType?: string
}

const StyledDataGrid = styled('div')(({ theme }) => ({
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#32475C38'
    }
}))

const UpdateWareHouse = ((props: UpdateWareHouseProp) => {
    const { data, onSubmit, open, dialogType } = props

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

    //query
    const { data: dataWareHouseType, refetch: refetchWHT } = useQuery(GET_WAREHOUSE_TYPE)
    const dataWHType = useMemo(() => dataWareHouseType?.getWarehouseType.items ?? [], [dataWareHouseType])

    const { data: dataUser, refetch: refetchUser, loading } = useQuery(GET_USER)
    const userList = useMemo(() => dataUser?.getUser.items ?? [], [dataUser])
    console.log(userList)
    //mutation 
    const [addWarehouse] = useMutation(ADD_WAREHOUSE)

    const [updateWareHouse] = useMutation(UPDATE_WAREHOUSE)

    const theme = useTheme()
    const [tab, setTab] = useState('1')
    const [input, setInput] = useState<WareHouseType>({
        ...data,
        index: undefined,
        __typename: undefined
    })
    const [show, setShow] = useMemo(() => open, [open])
    const handleChange = ((key: any, value: any) => {
        setInput({
            ...input,
            [key]: value
        })
    })

    const handleClose = (() => {
        setShow(false)
    })

    const onError = useCallback(() => {
        toast.error('Có lỗi xảy ra khi cập nhật dịch vụ')
    }, [])

    const onCompleted = useCallback(() => {
        toast.success('Cập nhật dịch vụ thành công')
        if (onSubmit) onSubmit()
        handleClose()
    }, [handleClose, onSubmit])

    const submit = (() => {
        if (input?.name === '') {
            toast.error('Tên Kho Không Được Trống')
            return
        }
        if (input?.warehouseTypeId === '') {
            toast.error('Vui Lòng Chọn Loại Kho')
            return
        }
        if (dialogType === 'add') {
            addWarehouse({
                variables: {
                    input: input
                }, onError
                , onCompleted
            })
        } else {
            updateWareHouse({
                variables: {
                    input: JSON.stringify(input)
                }, onError
                , onCompleted
            })
        }
    })

    const COLUMN_EMLOYEE: GridColDef[] = [
        {
            flex: 0.1,
            minWidth: 80,
            field: 'id',
            headerName: 'Mã Nhân Viên'
        },
        {
            flex: 0.1,
            minWidth: 80,
            field: 'fristName',
            headerName: 'Tên Nhân Viên',
            renderCell: params => (
                <Typography>{params.row.fristName} {params.row.lastName}</Typography>
            )
        },
    ]

    return (
        <MuiDialogContent
            onClose={handleClose}
            onSubmit={submit}
            dialogActionsStyles={{ justifyContent: 'flex-end' }}
            dialogActionsConfirm={
                <>
                    <Icon icon='bx:save' />
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
            <>
                <TabContext value={tab}>
                    <Box>
                        {/* Tab Header */}
                        <Box sx={{ width: '90%', borderBottom: `2px solid ${theme.palette.primary.main}` }}>
                            <TabListWrapper onChange={(e, newValue) => setTab(newValue)}>
                                <Tab key='1' label='Thông Tin Kho' value='1' />
                                <Tab key='2' label='Cấu Hình' value='2' />
                            </TabListWrapper>
                        </Box>
                        {/* End Tab Header */}
                        <TabPanel value='1'>
                            <Box sx={{ display: 'flex', pr: 10, pt: 10 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label='Tên Kho'
                                            value={input?.name}
                                            onChange={e => { handleChange('name', e.target.value) }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <MuiSelect
                                            notched={input?.warehouseTypeId ? true : false}
                                            fullWidth
                                            label='Nhóm khách hàng'
                                            required
                                            data={dataWHType}
                                            value={input?.warehouseTypeId}
                                            onChange={e => {
                                                handleChange('warehouseTypeId', e.target.value)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box sx={{ display: 'flex', pr: 10, pt: 10 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={3.5}>
                                        <TextField
                                            fullWidth
                                            label='Số Điện Thoại'
                                            value={input?.phone}
                                            onChange={e => { handleChange('phone', e.target.value) }}
                                        />
                                    </Grid>
                                    <Grid item xs={3.5}>
                                        <TextField
                                            fullWidth
                                            label='Email'
                                            value={input?.email}
                                            onChange={e => { handleChange('email', e.target.value) }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label='Địa Chỉ'
                                            value={input?.address}
                                            onChange={e => { handleChange('address', e.target.value) }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </TabPanel>
                        <TabPanel value='2'>
                            <Box>
                                {
                                    <StyledDataGrid>
                                        <DataGrid
                                            columns={COLUMN_EMLOYEE}
                                            rows={userList.map((item: any, index: any) => ({
                                                ...item,
                                                index: index + 1
                                            }))}
                                            rowCount={5}
                                            checkboxSelection
                                            paginationMode='server'
                                            loading={loading}
                                            slots={{
                                                noRowsOverlay: () => (
                                                    <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                                                )
                                            }}
                                            style={{ minHeight: 500, height: '60vh' }}
                                        />
                                    </StyledDataGrid>

                                }
                            </Box>
                        </TabPanel>
                    </Box>
                </TabContext>
            </>
        </MuiDialogContent>
    )
})

export default UpdateWareHouse