import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_PRODUCT } from './graphql/query'
import { formatVND } from 'src/utils/formatMoney'
import useDebounce from 'src/hooks/useDebounce'
import { Product } from './graphql/variables'

type Props = {
  placeholder: string
  onSearch: (value: string) => void
  onCreate: (value: string | any) => void
}

const InputProductSearch: React.FC<Props> = ({ placeholder, onSearch, onCreate}) => {
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState<string>('')
  const [productData, setProductData] = useState<Product[]>([])
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [skip, setSkip] = useState(0)
  const [take, setTake] = useState(25)
  const client = useApolloClient()
  const [isScrollBottom, setIsScrollBottom] = useState(false)
  const { data: GetProduct, refetch: refetch } = useQuery(GET_PRODUCT, {
    variables: {
      input: {
        or: [
          { id: { contains: debouncedSearchValue } },
          { productName: { contains: debouncedSearchValue } },
          { ingredients: { contains: debouncedSearchValue } }
        ]
      }
    }
  })
  useEffect(() => {
    setProductData(GetProduct?.getProduct?.items ?? [])
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GetProduct])

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

  const checkTotalRemaining = (data: any[]) => {

    let total = 0
    data?.forEach((item: any) => {
      total += item.totalRemaining
    })
    return total
  }

  const nearBottom = (target: any) => {
    const diff = Math.round((target.scrollHeight || 0) - (target.scrollTop || 0))
    return diff - 24 <= (target.clientHeight || 0)
  }

  const hanldStroll = async () => {
    if (GetProduct?.getProduct?.totalCount <= take || GetProduct?.getProduct?.totalCount <= skip) {
      return
    }
    if (isScrollBottom) {
      if (GetProduct?.getProduct?.pageInfo?.hasNextPage) {
        const newSkip = skip + 25
        const newTake = take + 25
        const result = await client.query({
          query: GET_PRODUCT,
          variables: {
            skip: newSkip,
            take: newTake
          }
        })
        const data = result?.data?.getProduct?.items ?? []
        setProductData(e => [...e, ...data])
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
        freeSolo
        autoHighlight
        loading={loading}
        onOpen={() => setIsAutocompleteOpen(true)}
        onClose={() => setIsAutocompleteOpen(false)}
        options={productData}
        sx={{ width: '100%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        open={isAutocompleteOpen}
        ListboxProps={{
          onScroll: ({ target }) => setIsScrollBottom(nearBottom(target))
        }}
        onChange={(e:any,value:any)=> onCreate(value)}
        getOptionLabel={(option:any)=>option.productName}
        renderOption={(props, option: any, index) => (
          <Box
            component='li'
            {...props}
            key={option.id}
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
              {option.id} - {option.productName}
            </Typography>
            <Typography
              variant='body1'
              sx={{
                width: '100%',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Hoạt chất: {option.ingredients}
            </Typography>
            <Typography variant='body1' sx={{ width: '100%', textAlign: 'left' }}>
              Quy cách: <span style={{ fontWeight: 'bold' }}>{option.specifications}</span>
            </Typography>
            <Typography variant='body2' color='textSecondary' sx={{ width: '100%', textAlign: 'left' }}>
              Giá: {formatVND(option.price)} /{' '}
              <span style={{ color: 'red' }}>Giá BHYT: {formatVND(option.bhytPrict)} </span>
            </Typography>
            <Typography variant='body2' sx={{ width: '100%', textAlign: 'left' }}>
              Tồn kho: {checkTotalRemaining(option.cansales)}
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
      {/* <Button variant='contained' style={{ backgroundColor: '#0292B1', width: 56, height: 56 }} onClick={handleSearch}>
        <SearchIcon />
      </Button> */}
    </div>
  )
}

export default InputProductSearch
