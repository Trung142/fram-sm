import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import React from "react"
import {  GridColDef } from "@mui/x-data-grid"
import { GET_RES_EXAM } from './graphql/query'
import moment from "moment"
import InitReport from './compoment/initReport'
import { getStatusResExam, getStatusPrescriptionsResExam,getStatusDtqgResExam } from '../utils/helper'


const ExaminationCard = () => {

    const formatBirthDay=((birthday:Date)=>{
        return moment(birthday).format('yyyy') || 2000
    })

    
    const calculateResService=((data:any[])=>{
        if(data.length>0){
            let price=0
            for(let i=0;i<data.length;i++){
                price=price+data[i]?.totalPrice
            }
            return price 
        }else{
            return 0
        }
    })

    const calculateResPrescription=((data:any[])=>{
        if(data.length>0){
            let price = 0
            for(let i=0;i<data.length;i++){
                if(data[i].prescriptionDts.length>0){
                    for(let y=0;y<data[i].prescriptionDts.length;y++){
                        price=price+data[i].prescriptionDts[y].totalPrice
                    }
                }else{
                    return 0
                }
            }
            return price
        }else{
            return 0
        }
    })

    const COLUMN_DEF: GridColDef[] = [
        {
          flex: 0.1,
          minWidth: 20,
          maxWidth:70,
          field: 'index',
          headerName: '#'
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:150,
            field:'id' ,
            headerName: 'Mã Phiếu',
        },
        {   
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'pat.name',
            headerName: 'Bệnh Nhân',
            valueGetter:params=>params?.row?.pat?.name,
            renderCell:params=>{
                const patient=params?.row?.pat
                return(
                    <Grid>
                        <Typography>{patient?.name}</Typography>
                        <Typography>{patient?.gender === 1 ? 'Nam' : 'Nữ'} - {formatBirthDay(patient?.birthday)} - {patient?.age}</Typography>
                        <Typography>SĐT: {patient?.phone}</Typography>
                        <Typography fontStyle={"italic"}>{patient?.patGroup?.id === 'pg000001' ? 'Khách Hàng Quay Lại' : 'Khách Mới'}</Typography>
                    </Grid>
                )
            }
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'exploreObjects.id',
            headerName: 'Đối Tượng',
            renderCell:params=>{
                if(params.value === 'EO0000001'){
                    return(
                        <Typography>BHYT</Typography>
                    )
                }else{
                    if(params.value === 'EO0000002'){
                        return(
                            <Typography>Thu Phí</Typography>
                        )
                    }else{
                        return(
                            <Typography>Miễn Phí</Typography>
                        )
                    }
                }
            }
            
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'symptom',
            headerName: 'Triệu Chứng',
            
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'diagnostic',
            headerName: 'Chuẩn Đoán',
            
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'treatments',
            headerName: 'Phương Pháp Điều Trị',
            
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'doctor',
            headerName: 'Bác Sĩ',
            valueGetter:params=>params?.row?.doctor,
            renderCell:params=>{
                return(
                    <Typography>{params.value?.fristName} {params.value?.lastName}</Typography>
                )
            }
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'finalprice',
            headerName: 'Tiền Khám',
            valueGetter:params=>calculateResService(params?.row?.resExamServiceDts)+calculateResPrescription(params?.row?.prescriptions)
        },
        {
            flex: 0.1,
            minWidth: 80,
            maxWidth:180,
            field: 'status',
            headerName: 'Trạng Thái',
            renderCell:params=>{
                return(
                    <>
                        <Stack direction='column' spacing={1} alignItems='center'>
                            <div style={{ ...getStatusResExam(params.value).styles, textAlign: 'center' }}>
                                {getStatusResExam(params.value).label}
                            </div>
                                <Box
                                    sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    '& div': {
                                        backgroundColor: 'rgba(184, 186, 183, 0.2)',
                                        borderRadius: '10px',
                                        border: '1px solid #646E7A',
                                        padding: '8px 12px',
                                        fontSize: '14px'
                                    }
                                    }}
                                >
                                    <div
                                        title={getStatusPrescriptionsResExam(params?.row?.prescriptions, false).label}
                                        style={{
                                            ...getStatusPrescriptionsResExam(params?.row?.prescriptions, false).styles,
                                            textAlign: 'center'
                                        }}
                                        >
                                        <Icon icon='ic:baseline-attach-money' fontSize={24} />
                                    </div>
                                    {params?.row?.prescriptions?.deleteYn ? (
                                        <div
                                        title={getStatusPrescriptionsResExam(params?.row?.prescriptions, params?.row?.prescriptions?.deleteYn).label}
                                            style={{
                                            ...getStatusPrescriptionsResExam(params?.row?.prescriptions, params?.row?.prescriptions?.deleteYn)
                                                .styles,
                                            textAlign: 'center'
                                            }}
                                        >
                                            <Icon icon='bi:capsule' fontSize={24} />
                                        </div>
                                        ) : (
                                        <div 
                                            title={getStatusPrescriptionsResExam(params?.row?.prescriptions, params?.row?.prescriptions?.deleteYn).label}
                                            style={{
                                            ...getStatusPrescriptionsResExam(params?.row?.prescriptions, params?.row?.prescriptions?.deleteYn)
                                                .styles,
                                            textAlign: 'center'
                                            }}
                                        >
                                            <Icon icon='bi:capsule' fontSize={24} />
                                        </div>
                                        )}
                                    <div
                                        title={getStatusDtqgResExam(params?.row?.prescriptions?.statusDtqg).label}
                                        style={{...getStatusDtqgResExam(params?.row?.prescriptions?.statusDtqg).styles, textAlign:'center'}}
                                    >
                                        <Icon icon='ph:file-arrow-up-fill' fontSize={24} />
                                    </div>
                                </Box>
                        </Stack>
                    </>
                )
            }
        }
          

    ]

    return(
        <InitReport GridCol={COLUMN_DEF} title="Phiếu Khám" QueryString={GET_RES_EXAM}  QueryProp="getResExam" IsAdvancedSearch={true}  />
    )
}

export default ExaminationCard