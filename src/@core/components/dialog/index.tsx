import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FadeProps, Grid, IconButton, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { ReactElement, Ref, forwardRef, useEffect, useMemo, useState } from "react"
import Icon from 'src/@core/components/icon'
import PopupFunctionContext from "src/context/PopupFunctionContext"

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

type DialogProps = {
  children: ReactElement;
  title?: string;
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  useFooter?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}

const MUIDialog = (props: DialogProps) => {
  const { children, title, open, maxWidth } = props;
  const [show, setShow] = useMemo(() => open, [open]);

  const handleClose = () => {
    setShow(false);

    // if (onClose)
    //   onClose();
  };

  return (

    <Dialog
      fullWidth
      open={show}
      maxWidth={maxWidth}
      scroll='body'
      disablePortal={true}
      onClose={() => handleClose()}
      style={{ zIndex: 1200 }}
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ backgroundColor: "primary.main" }}>
        <IconButton
          size='small'
          onClick={() => handleClose()}
          sx={{ position: 'absolute', right: '1rem', top: '1rem', color: 'common.white' }}
        >
          <Icon icon='bx:x' fontSize={30} />
        </IconButton>
        <Box>
          <Typography variant='h5' sx={{ mb: 5, color: 'common.white' }}>
            {title ?? ""}
          </Typography>
        </Box>
      </DialogTitle>
      {
        children
      }
    </Dialog>


  )
}
export default MUIDialog
