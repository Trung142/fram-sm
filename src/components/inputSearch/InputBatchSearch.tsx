import React, { useEffect, useMemo, useState } from 'react'
import { IBatch, Product } from './graphql/variables'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_BATCH } from './graphql/query'
import moment from 'moment'
import useDebounce from 'src/hooks/useDebounce'

interface props {
  product: any
  batchId: any
  onChange: (value: IBatch | null) => void
  onSearch: (value: string | null) => void
}

export default function InputBatchSearch(props: props) {
  const [dataBatch, setDataBatch] = useState<IBatch[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const client = useApolloClient()
  const [isScrollBottom, setIsScrollBottom] = useState(false)
  const { data: GetBatch, refetch: refetch } = useQuery(GET_BATCH, {
    variables: {
      input: {
        productId: props.product.id ? { eq: props.product.id } : undefined,
        or: [{ id: { contains: debouncedSearchValue } }, { batch1: { contains: debouncedSearchValue } }]
      },
      skip: 0,
      take: 100
    }
  })

  useEffect(() => {
    setDataBatch(GetBatch?.getBatch?.items ?? [])
  }, [GetBatch])

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
    if (GetBatch?.getBatch?.totalCount <= take || GetBatch?.getBatch?.totalCount <= skip) {
      return
    }
    if (isScrollBottom) {
      if (GetBatch?.getBatch?.pageInfo?.hasNextPage) {
        const newSkip = skip + 25
        const newTake = take + 25
        const result = await client.query({
          query: GET_BATCH,
          variables: {
            input: { productId: props.product.id ? { eq: props.product.id } : undefined },
            skip: newSkip,
            take: newTake
          }
        })
        const data = result?.data?.getBatch?.items ?? []
        setDataBatch(e => [...e, ...data])
        setSkip(newSkip)
      }
      return
    }
  }
  const handleBlur = async () => {
    await refetch({ input: { productId: props.product.id ? { eq: props.product.id } : undefined }, skip: 0, take: 100 })
    setSkip(0)
    setTake(100)
  }
  return (
    <Autocomplete
      sx={{ minWidth: '240px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      options={dataBatch}
      getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.batch1)}
      value={dataBatch.find((i: any) => i.id === props.batchId) ?? null}
      onChange={(e: any, newValue: IBatch | null) => {
        props.onChange(newValue)
      }}
      onBlur={handleBlur}
      onInputChange={(event, newInputValue) => {
        props.onSearch(newInputValue)
      }}
      ListboxProps={{
        onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
      }}
      renderOption={(props, option) => (
        <Box
          component='li'
          key={option.id}
          {...props}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            variant='body1'
            sx={{
              width: '100%',
              textAlign: 'left',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            {option.batch1}
          </Typography>

          <Typography
            variant='body1'
            sx={{
              width: '100%',
              textAlign: 'left',
              fontSize: '14px'
            }}
          >
            NSX: {moment(option.startDate).format('DD/MM/YYYY HH:mm')}
          </Typography>
          <Typography variant='body1' sx={{ width: '100%', textAlign: 'left', fontSize: '14px' }}>
            HSD: {moment(option.endDate).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label='Chọn số lô'
          onChange={handleOnChange}
          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '100%' }}
        />
      )}
    />
  )
}
