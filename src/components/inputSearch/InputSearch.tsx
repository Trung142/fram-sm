import { Icon } from '@iconify/react'
import { Box, Button, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDebounce from 'src/hooks/useDebounce'
type Props = {
  placeholder: string
  label: string
  onSearch: (value: string) => void
  onRefesh: (value: string) => void
}
export default function InputSearch({ placeholder, label, onSearch, onRefesh }: Props) {
  const [keySearch, setKeySearch] = useState<string>('')
  const debounce = useDebounce(keySearch, 1000)
  useEffect(() => {
    if (debounce) {
      onSearch(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce, keySearch])
  return (
    <div>
      <Box display={'flex'}>
        <Grid item xs={10}>
          <TextField
            fullWidth
            label={label}
            autoComplete='off'
            placeholder={placeholder}
            value={keySearch}
            InputLabelProps={{
              shrink: true
            }}
            onChange={e => {
              setKeySearch(e.target.value)
            }}
            onBlur={e => onSearch(debounce)}
          />
        </Grid>
        <Button
          variant='contained'
          color='primary'
          sx={{ minWidth: 40 }}
          style={{ margin: '0px 5px' }}
          onClick={() => {
            onSearch(debounce)
          }}
        >
          <Icon icon='bx:search' fontSize={20} />
        </Button>
        <Button
          variant='contained'
          color='secondary'
          sx={{ minWidth: 40 }}
          style={{ margin: '0px 5px' }}
          onClick={() => {
            setKeySearch('')
            onRefesh('true')
          }}
        >
          <Icon icon='bx:revision' fontSize={20} />
        </Button>
      </Box>
    </div>
  )
}
