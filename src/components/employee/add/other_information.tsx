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
const Other_Information = () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Typography>Thông tin khác</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10, mt: 5 }}>
        <Grid container spacing={10}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Trinh độ học vẫn'
              placeholder='Trinh độ học vẫn'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Chuyên ngành'
              placeholder='Chuyên ngành'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              id='country-select-demo'
              autoHighlight
              openOnFocus
              filterSelectedOptions
              options={['Độc Thân', 'Đã kết hôn', 'Đã ly hôn']}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Tình trạng hôn nhân '
                  placeholder='Tình trạng hôn nhân'
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label='Số lượng con'
              placeholder='Số lượng con'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Other_Information
