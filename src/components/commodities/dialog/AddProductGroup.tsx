import { useMutation } from '@apollo/client'
import { CardContent, Grid, TextField } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'

// ** Icon Imports
import { ADD_PRODUCT_GROUP, UPDATE_PRODUCT_GROUP } from '../res_system/graphql/mutation'
import toast from 'react-hot-toast'
import { dialogType } from '../res_system'
import { ProductGroupInput } from '../res_system/graphql/variables'
import { getLocalstorage } from 'src/utils/localStorageSide'

type Props = {
  data?: any
  type?: 'add' | 'update'
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

function AddProductGroup(props: Props) {
  const { data, type, open, onSubmit } = props
  const [show, setShow] = useMemo(() => open, [open])

  const [addDataProductGroup, { data: addProductGroup, loading: addProductGroupLoading, error: addProductGroupError }] = useMutation(ADD_PRODUCT_GROUP)
  const [updateDataProductGroup,{ data: updateProductGroup, loading: updateProductGroupLoading, error: updateProductGroupError }] = useMutation(UPDATE_PRODUCT_GROUP)

  // ** State
  const [input, setInput] = useState<ProductGroupInput>({
    ...data,
    index: undefined,
    __typename: undefined
  })
  
  useEffect(() => {
    if (data) {
      setInput({
        ...data,
        index: undefined,
        __typename: undefined
      })
    }
  }, [data])

  const handleChangeProduct = (key: string, newValue: any) => {
    setInput({
      ...input,
      [key]: newValue
    })
  }
  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  const onError = useCallback(() => {
    toast.error('Có lỗi xảy ra khi cập nhật hàng hóa')
  }, [])

  const onCompleted = useCallback(() => {
    toast.success(dialogType.value === 'add' ? 'Thêm mới hàng hóa thành công' : 'Cập nhật hàng hóa thành công')
    if (onSubmit) onSubmit()
    handleClose()
  }, [handleClose, onSubmit])

  const submit = useCallback(() => {
    let updatedInput = { ...input }
    const userLogin = getLocalstorage('userData')
    console.log('userLogin', userLogin)

    if (userLogin) {
      updatedInput = {
        ...updatedInput,
        clinicId: userLogin?.clinicId,
        parentClinicId: userLogin?.parentClinicId
      }
    }
    if (dialogType.value === 'add') {
      addDataProductGroup({
        variables: {
          input: updatedInput
        },
        onError,
        onCompleted
      })
    } else {
      const inputString = JSON.stringify(updatedInput)
      updateDataProductGroup({
        variables: {
          input: inputString
        },
        onError,
        onCompleted
      })
    }
  }, [addDataProductGroup, updateDataProductGroup, input, onError, onCompleted])

  return (
    <MuiDialogContent onClose={handleClose} onSubmit={submit}>
      <CardContent>
        <Grid>
          <Grid item>
            <TextField
              label='Tên Hàng Hoá'
              placeholder='Nhập Tên Hàng Hoá'
              variant='outlined'
              fullWidth
              multiline
              defaultValue={input?.name}
              InputLabelProps={{ shrink: true }}
              onChange={e => {handleChangeProduct('name', e.target.value)}}
            />
          </Grid>
          <Grid item style={{ marginTop: 30 }}>
            <TextField
              label='Ghi chú'
              placeholder='Nhập Ghi Chú'
              fullWidth
              multiline
              rows={10}
              defaultValue={input?.note}
              InputLabelProps={{ shrink: true }}
              onChange={e => {handleChangeProduct('note', e.target.value)}}
            />
          </Grid>
        </Grid>
      </CardContent>
    </MuiDialogContent>
  )
}
AddProductGroup.defaultProps = {
  type: 'update'
}
export default AddProductGroup
