import {
  Button,
  Autocomplete,
  ButtonProps,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  backdropClasses
} from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
type Props = {
  handleaddUser: (key: string, newvalue: any) => void
  input: any
}
const Job_Information = (props: Props) => {
  const { handleaddUser, input } = props
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Typography>Thông tin công việc</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
        <Grid container spacing={10}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  CMND hoặc thẻ CCCD <span style={{ color: 'red' }}>*</span>
                </Typography>
              }
              placeholder='CMND hoặc thẻ CCCD'
              autoFocus
              InputLabelProps={{ shrink: true }}
              value={input?.userCccd}
              onChange={e => handleaddUser('userCccd', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Nơi cấp CMND/CCCD'
              placeholder='Nhập nơi cấp CMND/CCCD'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type='date'
              InputLabelProps={{ shrink: true, placeholder: 'dd/mm/yyyy' }}
              label='Ngày cấp CMND/CCCD'
              placeholder='Nhập ngày cấp CMND/CCCD'
            />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label='Hộ khẩu' placeholder='Hộ khẩu ' autoFocus InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Người liên hệ khẩn cấp '
              placeholder='Người liên hệ khẩn cấp'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Điện thoại khẩn cấp '
              placeholder='Điện thoại khẩn cấp'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Job_Information
