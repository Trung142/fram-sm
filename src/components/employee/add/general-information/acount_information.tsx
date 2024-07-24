import { Grid, Autocomplete, TextField } from '@mui/material'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
type Props = {
  DATAROLE: any
  DATACLinict: any
  handleaddUser: (key: string, newvalue: any) => void
  input: any
}
const Acount_Information = (props: Props) => {
  const { DATAROLE, DATACLinict, handleaddUser, input } = props
  return (
    <>
      <Grid container sx={{ pt: 10 }}>
        <Grid item xs={6} container spacing={3} sx={{ pt: 5 }}>
          <Grid item xs={12}>
            <Autocomplete
              id='country-select-demo'
              autoHighlight
              openOnFocus
              filterSelectedOptions
              options={DATACLinict?.map((item: any) => item.name)}
              onChange={(e, newvalue) =>
                handleaddUser('clinicId', DATACLinict?.find((item: any) => item?.name === newvalue).id)
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label='Chi nhánh trực thuộc '
                  placeholder='Chi nhánh trực thuộc'
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Mật khẩu'
              required
              placeholder='Số lượng con'
              autoFocus
              InputLabelProps={{ shrink: true }}
              value={input?.password}
              onChange={e => handleaddUser('password', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Mật khậu nhắc lại'
              required
              placeholder='Số lượng con'
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Grid item xs={6} spacing={2} sx={{ pl: 10 }}>
          <FormGroup>
            {DATAROLE?.map((item: any) => (
              <FormControlLabel key={item.id} control={<Checkbox />} label={item.name} />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
    </>
  )
}
export default Acount_Information
