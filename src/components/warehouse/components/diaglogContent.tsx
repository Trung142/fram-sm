import { Button, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { Box, SxProps, Theme } from '@mui/system'
import PopupFunctionContext from 'src/context/PopupFunctionContext'
import Icon from 'src/@core/components/icon'
import { ReactElement, ReactNode } from 'react'

type DialogContentProps = {
  children: ReactElement
  title?: string
  useFooter?: boolean
  onClose?: () => void
  onSubmit?: () => void
  dialogActionsStyles?: SxProps<Theme>
  dialogActionsConfirm?: ReactNode
  dialogActionsCancel?: ReactNode
}

const MuiDialogContent = (props: DialogContentProps) => {
  const { children, title, useFooter, onClose, onSubmit } = props
  const handleSubmit = (e: any) => {
    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <>
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        {children}
      </DialogContent>
      {useFooter === undefined || useFooter === true ? (
        <DialogActions sx={{ justifyContent: 'center', ...props.dialogActionsStyles }}>
          <Button variant='contained' sx={{ minWidth: '170px', mr: 2 }} onClick={handleSubmit}>
            {props.dialogActionsConfirm ? props.dialogActionsConfirm : 'OK'}
          </Button>
          <Button variant='outlined' sx={{ minWidth: '170px' }} color='secondary' onClick={onClose}>
            {props.dialogActionsCancel ? props.dialogActionsCancel : 'Cancel'}
          </Button>
        </DialogActions>
      ) : (
        <></>
      )}
    </>
  )
}

export default MuiDialogContent
