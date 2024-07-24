import { gql, useMutation } from '@apollo/client'
import { Button, FormControl, FormControlLabel, FormHelperText, Grid, Switch, TextField } from '@mui/material'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'
import { CREATE_MESSAGE } from 'src/constants/message'
import PopupFunctionContext from 'src/context/PopupFunctionContext'
import { GetID, usePrefix } from 'src/hooks/usePrefix'

const ADD_MUTATION = gql`
  mutation Add($input: PatTypeInput!) {
    addPatType(data: $input) {
      id
      name
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation Update($input: PatTypeInput!) {
    updatePatType(data: $input) {
      id
      name
    }
  }
`

interface FormInputs {
  id?: string
  name?: string
  note?: string
}

type Props = {
  data?: FormInputs
  type?: 'add' | 'update'
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}

const PatientTypeDialog = (props: Props) => {
  const { data, type, open, onSubmit } = props
  const [show, setShow] = useMemo(() => open, [open])
  const prefix = usePrefix('pat_type')
  const [add] = useMutation(type === 'add' ? ADD_MUTATION : UPDATE_MUTATION)

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = useForm<FormInputs>({
    mode: 'all',
    defaultValues: {
      id: data?.id,
      name: data?.name,
      note: data?.note
    }
  })

  const handleClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  const submit = useCallback(() => {
    add({
      variables: {
        input: {
          id: getValues('id') ?? GetID(prefix?.prefixName ?? ''),
          name: getValues('name'),
          note: getValues('note')
        }
      },
      onError: error => {
        toast.error(`${CREATE_MESSAGE.ERROR}. ${error.message}`)
      },
      onCompleted: data => {
        toast.success(CREATE_MESSAGE.SUCCESS)
        if (onSubmit) onSubmit()
        handleClose()
      }
    })
  }, [add, onSubmit, prefix, getValues, handleClose])

  return (
    <>
      <MuiDialogContent onSubmit={handleSubmit(submit)} onClose={handleClose}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    label='Tên loại khách hàng'
                    value={value}
                    error={Boolean(errors.name)}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                  Tên loại khách hàng không được để trống
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='note'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Ghi chú'
                    multiline
                    rows={5}
                    value={value}
                    error={Boolean(errors.note)}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </MuiDialogContent>
    </>
  )
}

PatientTypeDialog.defaultProps = {
  type: 'add'
}

export default PatientTypeDialog
