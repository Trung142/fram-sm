import React, { useCallback, useMemo, useState } from 'react'
import MuiDialogContent from './components/diaglogContent'
import Icon from 'src/@core/components/icon'
import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Stack, TextField } from '@mui/material'
import toast from 'react-hot-toast'
import { getLocalstorage } from 'src/utils/localStorageSide'
import {ADD_COMREFER_VALUE,UPDATE_COMREFER_VALUE} from './graphql/mutation'
import { useMutation } from '@apollo/client'
import { use } from 'i18next'

type Props = {
  decimal?:any
  data?: any
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
  dialogType: string
}


enum Gender {
  allgender='allgender',
  female='female',
  male='male'
}
enum AgeType {
  all='allAge',
  specificAge='specificAge'
}

const dataUs=getLocalstorage('userData')

const UpdateComparisonReferenceValue = (props : Props) => {
  const { data, open, onSubmit,decimal,dialogType } = props
  const [input,setInput]=useState<any>(data)
  const [show, setShow] = useMemo(() => open, [open])
  const [gender, setGender] = useState<Gender>(input?.allgender === true ? Gender.allgender : input?.male === true ? Gender.male : Gender.female)
  const [ageType, setAgeType] = useState<AgeType>(input?.allAge === true ? AgeType.all : AgeType.specificAge)

  //======Mutation======
  const [addComReferValue] = useMutation(ADD_COMREFER_VALUE)
  const [updateComReferValue]=useMutation(UPDATE_COMREFER_VALUE)

  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  const handleChangeGender=((key:any,value:any)=>{
    if(key && key==="male"){
      setInput({
        ...input,
        [key]: value,
        female:false,
        allgender:false
      })
    }else{
      if(key==="female"){
        setInput({
          ...input,
          [key]: value,
          male:false,
          allgender:false
        })
      }else{
        setInput({
          ...input,
          [key]: value,
          male:false,
          female:false
        })
      }
    }

  })

  const handleChangeAgeType=((key:any,value:any)=>{
    if(key && key === "allAge"){
      setInput({
        ...input,
        [key]: value,
        fromAge:undefined,
        toAge:undefined
      })
    }else{
      setInput({
        ...input,
        allAge:false
      })
    }
  })

  const handleChange=((key:any,value:any)=>{
    setInput({
      ...input,
      [key]:value
    })
  })
  

  const onCompleted = useCallback(() => {
    toast.success('Cập nhật giá trị tham chiếu thành công')
    if (onSubmit) onSubmit()
    handleClose()
  }, [handleClose, onSubmit])
  
  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật giá trị tham chiếu')
  }, [])

  const submit=useCallback(()=>{
    if(!input.smallestValue ||input.smallestValue<0){
      toast.error("Vui lòng nhập lại giá trị")
      return
    }
    if(!input.greatestValue ||input.greatestValue<0){
      toast.error("Vui lòng nhập lại giá trị")
      return
    }
    if(data && dialogType === 'add' ){
      addComReferValue({
        variables:{
          input:{
            ...input,
            deleteYn: false,
            clinicId: dataUs.clinicId,
            parentClinicId: dataUs.parentClinicId
          }
        },onError,
        onCompleted
      })
    }else{
      updateComReferValue({
        variables:{
          input:JSON.stringify(input)
        },onError,
        onCompleted
      })
    }
  },[addComReferValue,onError,onCompleted,input,data,dialogType,updateComReferValue])    
  return (
    <MuiDialogContent
      onClose={() => {
        handleClose()
      }}
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
      <Stack spacing={2}>
        {/* Genders */}
        <FormControl>
          <FormLabel>Giới tính</FormLabel>
          <RadioGroup
            aria-labelledby='genders-group-label'
            value={gender}
            onChange={e => {
              setGender(e.target.value as any)
              handleChangeGender(e.target.value,true)
            }}
            row
            name='radio-buttons-group'
          >
            <FormControlLabel value={Gender.allgender} control={<Radio />} label='Tất cả' />
            <FormControlLabel value={Gender.male} control={<Radio />} label='Nam' />
            <FormControlLabel value={Gender.female} control={<Radio />} label='Nữ' />
          </RadioGroup>
        </FormControl>
        {/* End genders */}

        {/* age */}
     <Grid container spacing={2}>
      <Grid item xs={6}>
      <FormControl>
          <FormLabel>Độ tuổi</FormLabel>
          <RadioGroup
            aria-labelledby='age-group-label'
            value={ageType}
            onChange={e => {
              setAgeType(e.target.value as any);handleChangeAgeType(e.target.value,true)
            }}
            row
            name='radio-buttons-group'
          >
            <FormControlLabel value={AgeType.all} control={<Radio />} label='Tất cả' />
            <FormControlLabel value={AgeType.specificAge} control={<Radio />} label='Theo độ tuổi' />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
           {ageType===AgeType.specificAge &&  <Stack direction='row' spacing={2}>
            <TextField 
              defaultValue={input?.fromAge} 
              inputProps={{style:{textAlign:'end'}}} 
              label="Độ tuổi từ" 
              onBlur={(e)=>{handleChange('fromAge',parseInt(e.target.value))}}/>
            <TextField 
              defaultValue={input?.toAge} 
              inputProps={{style:{textAlign:'end'}}} 
              label="Độ tuổi đến"
              onBlur={(e)=>{handleChange('toAge',parseInt(e.target.value))}}/>
            </Stack>}
      </Grid>
     </Grid>
        {/* end age */}

        {/* value */}
        <Grid container marginTop={4}>
          <Grid item xs>
            <TextField
              fullWidth
              defaultValue={Number(input?.smallestValue).toFixed(decimal) || 0}
              inputProps={{style:{textAlign:'end'}}}
              label='Giá trị nhỏ nhất'
              onBlur={(e)=>handleChange('smallestValue',parseFloat(e.target.value))}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              defaultValue={Number(input?.greatestValue).toFixed(decimal) || 0}
              inputProps={{style:{textAlign:'end'}}}
              label='Giá trị lớn nhất'
              onBlur={(e)=>handleChange('greatestValue',parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>
        {/* end value */}
      </Stack>
    </MuiDialogContent>
  )
}

export default UpdateComparisonReferenceValue
