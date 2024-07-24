import { Grid, Stack, TextField, Typography } from '@mui/material';
import MuiDialogContent from './components/diaglogContent'
import Icon from 'src/@core/components/icon'
import EditorContent from '../draftjs-wywis/Editor';
import {toolbarStyle, wrapperStyle} from './styles'
import {GET_SERVICE_EXAMPLE_VALUE} from './graphql/query'
import { ADD_SERVICE_EXAMPLE_VALUE,UPDATE_SERVICE_EXAMPLE_VALUE } from './graphql/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {ServiceExampleValue} from './graphql/variables'
import Description from '@mui/icons-material/Description';

type UpdateServiceExampleValueProps={
    open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onSubmit?: () => void;
    dialogType:string;
    data:any
}


const UpdateServiceExampleValue=((props : UpdateServiceExampleValueProps)=>{
    const {open,onSubmit,data,dialogType}=props
    const[input,setInput]=useState<ServiceExampleValue>(data)
    const [show, setShow] = useMemo(() => open, [open])
    
    const[addDataServiceExample]=useMutation(ADD_SERVICE_EXAMPLE_VALUE)
    const[updateDataServiceExample]=useMutation(UPDATE_SERVICE_EXAMPLE_VALUE)
    
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
        
    const handleSubmit=useCallback(()=>{
        if(dialogType==='add'){
            addDataServiceExample({
                variables:{
                    input:input
                },onCompleted,onError
            })
        }else{
            updateDataServiceExample({
                variables:{
                    input:JSON.stringify({
                        id:input?.id,
                        deleteYn:input?.deleteYn,
                        description:input?.description,
                        valueExample:input?.valueExample,
                        name:input?.name
                    })
                },onCompleted,onError
            })
        }
    },[addDataServiceExample,updateDataServiceExample,input,dialogType,onCompleted,onError])
    
    const handleChange=((key:string,value:any)=>{
        setInput({
            ...input,
            [key]:value
        })
    })
    console.log(input)
    return(
        <MuiDialogContent
            onClose={handleClose}
            onSubmit={handleSubmit}
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
            <Stack spacing={8}>
                <TextField
                fullWidth
                label='Tên Mẫu Kết Quã'
                value={input?.name}
                onChange={e => handleChange('name',e.target.value)}
                />
                <Grid>
                <Typography>Mô Tả</Typography>
                    <EditorContent
                        rawContent={input?.valueExample}
                        onAction={handleChange}
                        wrapperStyle={{...wrapperStyle,minHeight:'300px'}}
                        toolbarStyle={toolbarStyle}
                        changeKey='valueExample'
                    />  
                </Grid>
                <TextField value={input?.description} onChange={e => handleChange('description',e.target.value)} label='Kết Luận' rows={3} multiline />
            </Stack>
        </MuiDialogContent>
    )
})

export default UpdateServiceExampleValue