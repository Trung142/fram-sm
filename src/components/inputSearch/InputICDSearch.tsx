import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_ICD } from './graphql/query'
import styles from './index.module.scss'
import useDebounce from 'src/hooks/useDebounce'
import { Icd } from './graphql/variables'

type Props = {
  placeholder: string
  icdId: any
  onSearch: (value: string | null) => void
  onChange: (value: Icd | null) => void
}

const InputICDSearch: React.FC<Props> = ({ placeholder, onSearch, onChange, icdId }) => {
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [dataICD, setDataICD] = useState<Icd[]>([])
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const client = useApolloClient()
  const [isScrollBottom, setIsScrollBottom] = useState(false)

  const {
    data: GetIcd,
    refetch: refetch,
    loading: icdLoading
  } = useQuery(GET_ICD, {
    variables: {
      input: { or: [{ id: { contains: debouncedSearchValue } }, { name: { contains: debouncedSearchValue } }] }
    }
  })

  useEffect(() => {
    setDataICD(GetIcd?.getIcd?.items ?? [])
  }, [GetIcd])

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
    if (GetIcd?.getIcd?.totalCount <= take || GetIcd?.getIcd?.totalCount <= skip) {
      return
    }
    if (isScrollBottom) {
      if (GetIcd?.getIcd?.pageInfo?.hasNextPage) {
        const newSkip = skip + 25
        const newTake = take + 25
        const result = await client.query({
          query: GET_ICD,
          variables: {
            skip: newSkip,
            take: newTake
          }
        })
        const data = result?.data?.getIcd?.items ?? []
        setDataICD(e => [...e, ...data])
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
        options={dataICD}
        sx={{ width: '100%' }}
        getOptionLabel={(option: Icd) => `[${option.id}] ${option.name}` ?? ''}
        isOptionEqualToValue={(option, value) => option.id === icdId}
        value={dataICD.find((i: any) => i.id === icdId) ?? null}
        onChange={(e: any, newValue: Icd | null) => {
          onChange(newValue)
        }}
        onBlur={handleBlur}
        onInputChange={(event, newInputValue) => {
          onSearch(newInputValue)
        }}
        ListboxProps={{
          onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
        }}
        loading={icdLoading}
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

export default InputICDSearch
