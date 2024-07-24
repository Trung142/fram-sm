import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_SERVICE } from './graphql/query'
import styles from './index.module.scss'
import useDebounce from 'src/hooks/useDebounce'
import { IService } from './graphql/variables'
import { formatVND } from 'src/utils/formatMoney'

type Props = {
  placeholder: string
  // onSearch: (value: string | null) => void
  onClick: (value: IService) => void
}

const InputServiceSearch: React.FC<Props> = ({ placeholder, onClick }) => {
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [serviceData, setServiceData] = useState<IService[]>([])
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const client = useApolloClient()
  const [isScrollBottom, setIsScrollBottom] = useState(false)

  const {
    data: GetService,
    refetch: refetch,
    loading: icdLoading
  } = useQuery(GET_SERVICE, {
    variables: {
      input: { or: [{ id: { contains: debouncedSearchValue } }, { name: { contains: debouncedSearchValue } }] }
    }
  })

  useEffect(() => {
    setServiceData(GetService?.getService?.items ?? [])
  }, [GetService])

  useEffect(() => {
    hanldStroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollBottom])

  const handleOnChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value)
  }

  const nearBottom = (target: any) => {
    const diff = Math.round((target.scrollHeight || 0) - (target.scrollTop || 0))
    return diff - 25 <= (target.clientHeight || 0)
  }
  const hanldStroll = async () => {
    if (GetService?.getService?.totalCount <= take || GetService?.getService?.totalCount <= skip) {
      return
    }
    if (isScrollBottom) {
      if (GetService?.getService?.pageInfo?.hasNextPage) {
        const newSkip = skip + 25
        const newTake = take + 25
        const result = await client.query({
          query: GET_SERVICE,
          variables: {
            skip: newSkip,
            take: newTake
          }
        })
        const data = result?.data?.getService?.items ?? []
        setServiceData(e => [...e, ...data])
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
    <Autocomplete
      freeSolo
      autoHighlight
      openOnFocus
      sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      options={serviceData}
      open={isAutocompleteOpen}
      onOpen={() => setIsAutocompleteOpen(true)}
      onClose={() => setIsAutocompleteOpen(false)}
      ListboxProps={{
        onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
      }}
      onBlur={handleBlur}
      getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.name)}
      renderOption={(props, option: any) => (
        <Box
          component='li'
          key={option.id}
          {...props}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={() => onClick(option)}
        >
          <Typography
            variant='body1'
            sx={{ width: '100%', textAlign: 'left', textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            {option.name}
          </Typography>
          <Typography variant='body2' color='textSecondary' sx={{ width: '100%', textAlign: 'left' }}>
            Giá: {formatVND(option.price)}
          </Typography>
          <Typography variant='body2' sx={{ width: '100%', textAlign: 'left', color: 'red' }}>
            Giá BHYT: {formatVND(option.bhytPrice)}
          </Typography>
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
  )
}

export default InputServiceSearch
