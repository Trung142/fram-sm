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
const Economic_Information = () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Typography>Thông tin tài chính</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
        <Grid container spacing={10}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Mã số thuế'
              placeholder='Mã số thuế'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type='date'
              InputLabelProps={{ shrink: true, placeholder: 'dd/mm/yyyy' }}
              label='Ngày cấp MST'
              placeholder='Nhập ngày cấp MST'
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Chi cục quản lý thuế'
              placeholder='Chi cục quản lý thuế'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Số bảo hiểm y tế'
              placeholder='Nhập bảo hiểm y tế '
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Economic_Information
