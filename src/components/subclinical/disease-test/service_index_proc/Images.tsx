import {
  Button,
  Card,
  CardHeader,
  Grid,
  Typography,
  Box,
  ButtonProps,
  CardContent,
  CardMedia,
  Icon
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { ElementType, useState } from 'react'
import { ResExamServiceDtInput } from './graphql/variables'
import AddIcon from '@mui/icons-material/Add'

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))
type Props = {
  data?: any
  // type?: "add" | "update";
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSubmit?: () => void
}
const Images = () => {
  // const { data, open, onSubmit } = props
  // const [input, setInput] = useState<ResExamServiceDtInput>({
  //   ...data,
  //   index: undefined,
  //   __typename: undefined
  // })
  // const [imgSrc, setImgSrc] = useState<string>(input.urlImage ?? '/images/no-image.png')

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box p={4} display='flex' alignItems={'center'}>
          <Typography fontSize={'20px'}>Hình ảnh</Typography>
          <Button sx={{ ml: 4 }} color='success' variant='outlined'>
            Tải file
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} display={'flex'} spacing={4} p={2}>
        <Button>
          <Card sx={{ maxWidth: 345, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <CardMedia>
              <Icon>
                <AddIcon />
              </Icon>
            </CardMedia>
            <CardContent>Hình ảnh</CardContent>
          </Card>
        </Button>
        <Button>
          <Card sx={{ maxWidth: 345, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <CardMedia>
              <Icon>
                <AddIcon />
              </Icon>
            </CardMedia>
            <CardContent>Hình ảnh</CardContent>
          </Card>
        </Button>
        <Button>
          <Card sx={{ maxWidth: 345, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <CardMedia>
              <Icon>
                <AddIcon />
              </Icon>
            </CardMedia>
            <CardContent>Hình ảnh</CardContent>
          </Card>
        </Button>
        {/* <Grid container spacing={1}>
          <Grid container item spacing={3}>
            <ButtonStyled component='label' htmlFor='account-settings-upload-image' sx={{ padding: 0 }}>
              <img
                src={imgSrc}
                alt='avatar'
                style={{
                  width: 200,
                  height: 200,
                  objectFit: 'cover'
                  // borderRadius: '50%',
                }}
              />
              <input
                hidden
                type='file'
                value={inputValue}
                accept='image/png, image/jpeg'
                onChange={handleInputImageChange}
                id='account-settings-upload-image'
              />
            </ButtonStyled>
          </Grid>
          <Grid container item spacing={3}>
            <FormRow />
          </Grid>
          <Grid container item spacing={3}>
            <FormRow />
          </Grid>
        </Grid> */}
      </Grid>
    </Grid>
  )
}

export default Images
