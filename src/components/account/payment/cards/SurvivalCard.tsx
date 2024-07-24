import { Box, CardContent, Grid, TextField } from '@mui/material'
import { memo, useEffect } from 'react'
import { Control, Controller, UseFormSetValue, useWatch } from 'react-hook-form'
import CardTemplate from './CardTemplate'

type FormAttribute = 'paulse' | 'breathingRate' | 'temperature' | 'bp1' | 'bp2' | 'weight' | 'height' | 'bmi'
type SurvivalCardFormType = Record<FormAttribute, number>

const attributeInfo: { name: FormAttribute; label: string }[] = [
  {
    name: 'paulse',
    label: 'Mạch (lần/phút)'
  },
  {
    name: 'breathingRate',
    label: 'Nhịp thở (lần/phút)'
  },
  {
    name: 'temperature',
    label: 'Nhiệt độ C'
  },
  {
    name: 'bp1',
    label: 'HA mmhg'
  },
  {
    name: 'bp2',
    label: 'HA mmhg'
  },
  {
    name: 'weight',
    label: 'Cân nặng (kg)'
  },
  {
    name: 'height',
    label: 'Chiều cao (cm)'
  },
  {
    name: 'bmi',
    label: 'BMI'
  }
]

const SurvivalCard: React.FC<{
  control: Control<SurvivalCardFormType>
  setValue: UseFormSetValue<SurvivalCardFormType>
}> = ({ control, setValue }) => {
  const height = useWatch({ name: 'height', control })
  const weight = useWatch({ name: 'weight', control })

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100
      setValue('bmi', +(weight / (heightInMeters * heightInMeters)).toFixed(2))
    } else setValue('bmi', 0)
  }, [height, weight, setValue])

  return (
    <CardTemplate title='Chỉ số sinh tồn'>
      <CardContent>
        <Grid container>
          <Grid item xs={5}>
            <Grid container columnSpacing={3}>
              {attributeInfo.slice(0, 4).map(({ name, label }) => (
                <Grid item xs={3} key={name}>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        onChange={e => {
                          if (e.target.value === '') {
                            field.onChange('')
                          } else {
                            const value = Number(e.target.value)
                            field.onChange(value > 0 ? value : '')
                          }
                        }}
                        value={field.value === 0 ? '' : field.value}
                        label={label}
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                fontWeight: '700',
                fontSize: '2rem'
              }}
            >
              /
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Grid container columnSpacing={3}>
              {attributeInfo.slice(4).map(({ name, label }) => (
                <Grid item xs={3} key={name}>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        onChange={e => {
                          if (e.target.value === '') {
                            field.onChange('')
                          } else {
                            const value = Number(e.target.value)
                            field.onChange(value > 0 ? value : '')
                          }
                        }}
                        label={label}
                        InputLabelProps={{ shrink: true }}
                        variant='outlined'
                        InputProps={{
                          readOnly: name === 'bmi'
                        }}
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </CardTemplate>
  )
}

export default memo(SurvivalCard)
