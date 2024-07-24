import { useCallback, useMemo, useState } from 'react'
import Icon from 'src/@core/components/icon'
import MuiDialogContent from './components/diaglogContent'
import { Stack, TextField } from '@mui/material'
import {ADD_SERVICE_GROUP,UPDATE_SERVICE_GROUP}  from './graphql/mutation'
import { useMutation } from '@apollo/client'
import toast from "react-hot-toast";
import { CREATE_MESSAGE,UPDATE_MESSAGE } from "src/constants/message";

type UpdateServiceGroupProps = {
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  onSubmit?: () => void;
  dialogType:string;
  data:any
}

const UpdateServiceGroup = ( props : UpdateServiceGroupProps) => {

  const {onSubmit,  open,data,dialogType} = props
  const[input,setInput]=useState(data)
  const [note, setNote] = useState('')
  const [show, setShow] = useMemo(() => open, [open]);
  

  const [addServiceGroup, { data: addServiceGroupData, loading: addServiceGroupLoading, error: addServiceGroupError }] = useMutation(ADD_SERVICE_GROUP)
  const[updateServiceGroup]=useMutation(UPDATE_SERVICE_GROUP)
  
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleChange=((key:any,value:any)=>{
    setInput({
      ...input,
      serviceGroup:{
        ...input.serviceGroup,
        [key]:value
      }
    })
  })

  const submit = useCallback(() => {
    if(dialogType==="add"){
      if(input?.serviceGroup.name&&input?.serviceGroup.name!==undefined){
        addServiceGroup({
          variables:{
            input:{
              name:input?.serviceGroup.name,
              clinicId:"CLI0001",
              parentClinicId:"CLI0001",
              deleteYn:false
            }
          },
          onError: (error) => {
            toast.error(`${CREATE_MESSAGE.ERROR}. ${error.message}`);
          },
          onCompleted: () => {
            toast.success(CREATE_MESSAGE.SUCCESS);
            if (onSubmit) onSubmit();
            handleClose();
          }
        })
      }
    }else{
      updateServiceGroup({
        variables:{
          input:JSON.stringify({
            id:input?.serviceGroup.id,
            name:input?.serviceGroup.name,
            clinicId:"CLI0001",
            parentClinicId:"CLI0001",
            deleteYn:false
          })
        },
        onError: (error) => {
          toast.error(`${UPDATE_MESSAGE.ERROR}. ${error.message}`);
        },
        onCompleted: () => {
          toast.success(UPDATE_MESSAGE.SUCCESS);
          if (onSubmit) onSubmit();
          handleClose();
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addServiceGroup, onSubmit, handleClose,dialogType,updateServiceGroup,input?.serviceGroup?.id,input?.serviceGroup?.name])
  
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
      <Stack spacing={8}>
        <TextField
          fullWidth
          label='Tên nhóm dịch vụ'
          value={input?.serviceGroup?.name}
          onChange={e => handleChange('name',e.target.value)}
        />
        <TextField fullWidth value={input?.serviceGroup?.note} onChange={e => handleChange('note',e.target.value)} label='Ghi chú' rows={6} multiline />
      </Stack>
    </MuiDialogContent>
  )
}

export default UpdateServiceGroup
