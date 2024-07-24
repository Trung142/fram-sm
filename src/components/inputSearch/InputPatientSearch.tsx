import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_PATEINT } from './graphql/query'
import styles from './index.module.scss'
import useDebounce from 'src/hooks/useDebounce'

type Props = {
  placeholder: string
  onSearch: (value: string) => void
  onCreate: (value: string) => void
}

const InputPatientSearch: React.FC<Props> = ({ placeholder, onSearch, onCreate }) => {
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [dataPatient, setDataPatient] = useState<any[]>([])
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const client = useApolloClient()
  const [isScrollBottom, setIsScrollBottom] = useState(false)

  const { data: GetPatient, refetch: refetch } = useQuery(GET_PATEINT, {
    variables: {
      input: { or: [{ id: { contains: debouncedSearchValue } }, { productName: { contains: debouncedSearchValue } }] }
    }
  })

  useEffect(() => {
    setDataPatient(GetPatient?.getPatient?.items ?? [])
  }, [GetPatient])

  useEffect(() => {
    hanldStroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollBottom])

  const handleOnChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
  }

  const handleSearch = () => {
    if (searchValue.trim() !== '') {
      onSearch(searchValue)
    }
  }

  const nearBottom = (target: any) => {
    const diff = Math.round((target.scrollHeight || 0) - (target.scrollTop || 0))
    return diff - 25 <= (target.clientHeight || 0)
  }
  const hanldStroll = async () => {
    if (GetPatient?.getPatient?.totalCount <= take || GetPatient?.getPatient?.totalCount <= skip) {
      return
    }
    if (isScrollBottom) {
      if (GetPatient?.getPatient?.pageInfo?.hasNextPage) {
        const newSkip = skip + 25
        const newTake = take + 25
        const result = await client.query({
          query: GET_PATEINT,
          variables: {
            skip: newSkip,
            take: newTake
          }
        })
        const data = result?.data?.getPatient?.items ?? []
        setDataPatient(e => [...e, ...data])
        setSkip(newSkip)
      }
      return
    }
  }

  const handleBlur = async () => {
    await refetch({ input: {}, skip: 0, take: 25 })
    setSkip(0)
    setTake(25)
  }
  return (
    <div style={{ display: 'flex' }}>
      <Autocomplete
        autoHighlight
        loading={loading}
        onOpen={() => setIsAutocompleteOpen(true)}
        onClose={() => setIsAutocompleteOpen(false)}
        options={dataPatient}
        sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        open={isAutocompleteOpen}
        ListboxProps={{
          onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
        }}
        onBlur={handleBlur}
        getOptionLabel={(option: any) => {
          if (typeof option === 'string') {
            return option
          } else {
            return `${option.id} - ${option.productName}`
          }
        }}
        renderOption={(props, option) => (
          <Box
            component='li'
            {...props}
            key={`${option.id}-${option.name}`}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}
          >
            <>
              <Typography variant='body2' sx={{ width: '100%' }}>
                <strong>{option.name}</strong> - {option.gender === 1 ? 'Nữ' : 'Nam'}
              </Typography>
              <Typography variant='body2' sx={{ width: '100%' }}>
                <strong>SĐT:</strong> {option.phone}
              </Typography>
              <Typography variant='body2' sx={{ width: '100%' }}>
                <strong> Ngày sinh:</strong> {option.dob} - <strong>Tuổi: </strong>
                {option.age}
              </Typography>
              <Typography variant='body2' sx={{ width: '100%' }}>
                <strong>Địa chỉ:</strong> {option.address}
              </Typography>
            </>
          </Box>
        )}
        renderInput={params => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
            onChange={handleOnChange}
            label={placeholder}
            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
        )}
      />
    </div>
  )
}

export default InputPatientSearch
