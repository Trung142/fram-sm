import { gql, useMutation } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import Icon from 'src/@core/components/icon'
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import MuiDialogContent from "src/@core/components/dialog/DialogContent";
import {UPDATE_PATIENT,UPDATE_SERVICE} from "./graphql/mutation"


type Props = {
    data?: any,
    open: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    onSubmit?: () => void;
    confirmType?:string
  }


const ConfirmDialog=(props:Props)=>{
    const { data, open, onSubmit,confirmType} = props;

    //state 
    const [dialogTitle, setDialogTitle] = useState('');
    const [show, setShow] = useMemo(() => open, [open]);
    //mutation
    const [updatePatient, { data: updatePatientData, loading: updatePatientLoading, error: updatePatientError }] = useMutation(UPDATE_PATIENT);
    const [updateService, { data: updateServiceData, loading: updateServiceLoading, error: updateServiceError }] = useMutation(UPDATE_SERVICE);
    
    const handleClose = useCallback(() => {
        setShow(false);
      }, [setShow]);
    
      const onError = useCallback(() => {
        toast.error("Có lỗi xảy ra khi cập nhật khách hàng");
      }, []);
    
      const onCompleted = useCallback(() => {
        toast.success("Cập nhật khách hàng thành công");
        if (onSubmit) onSubmit();
        handleClose();
      }, [handleClose, onSubmit]);

      const submit=useCallback(()=>{
        if(confirmType==='patient'){
          updatePatient({
            variables: {
              input: JSON.stringify(data)
            }, onError, onCompleted
          })
        }else{
          updateService({
            variables: {
              input: JSON.stringify(data)
            }, onError, onCompleted
          })
        }
        
      },[updatePatient, data, onError, onCompleted,updateService,confirmType])
    
    return(<>
     
        <MuiDialogContent onSubmit={submit} onClose={handleClose}>
            <Grid display="flex" flexDirection='row' justifyContent={'center'} padding={'10px'}>
                <Icon icon="mingcute:warning-fill" width="38" height="38"  />
                <Typography variant="h5" marginLeft={'15px'} paddingTop={'5px'}>Bạn có chắc chắn thực hiện thao tác</Typography>
            </Grid>
        </MuiDialogContent>
      </>)
}

export default ConfirmDialog;