import React, { useState, useEffect } from 'react'
import { CardMedia, TextField, Typography, Button, Autocomplete } from '@mui/material'
import { Box, Stack } from '@mui/system'
import MUIDialog from 'src/@core/components/dialog'
import { IProduct } from 'src/components/drugstore/pharmacy/graphql/variables'
import { formatVND } from 'src/utils/formatMoney'
import PercentIcon from '@mui/icons-material/Percent'
import { Icon } from '@iconify/react'
import moment from 'moment'
import toast from 'react-hot-toast'

type Props = {
  detailData: IProduct | undefined
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  onSave: (data: any) => void
}

const DetailDialog = (props: Props) => {
  const [unit, setUnit] = useState('VNĐ')
  const [discount, setDiscount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [quantity, setQuantity] = useState(props.detailData?.quantity || 0)
  const [values, setValues] = useState<any>({
    id: props?.detailData?.id,
    quantity: quantity,
    discount: discount,
    totalPrice: totalPrice,
    batchId: props?.detailData?.batchId
  })
  const batchs = props.detailData?.cansales?.find(e => e.batchId === props.detailData?.wh.batchId)
  useEffect(() => {
    calculateTotalPrice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount, props.detailData?.price, quantity])

  const handleVndClick = () => {
    setUnit('VNĐ')
    calculateTotalPrice()
  }

  const handlePercentClick = () => {
    setUnit('%')
    calculateTotalPrice()
  }

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    setDiscount(value)
    calculateTotalPrice()
  }

  const handleQuantityChange = (amount: number) => {
    const batchs = props.detailData?.cansales?.find(e => e.batchId === props.detailData?.wh?.batchId)
    if (quantity === 0 && amount === -1) {
      return
    }
    if (quantity + amount > (batchs?.totalRemaining || 0)) {
      toast.error('Số lượng sản phẩm trong lô không đủ, vui lòng chọn lô khác')
      return
    }
    setQuantity(prevQuantity => prevQuantity + amount)
  }

  const calculateTotalPrice = () => {
    const price = props.detailData?.price || 0

    let totalPrice
    if (unit === 'VNĐ') {
      totalPrice = price * quantity - discount
    } else {
      const discountAmount = (price * quantity * discount) / 100
      totalPrice = price * quantity - discountAmount
    }
    setTotalPrice(totalPrice)
  }

  const handleSave = () => {
    const data = {
      id: props?.detailData?.id,
      quantity: quantity,
      discount: discount,
      totalPrice: totalPrice,
      batchId: values?.batchId
    }
    setValues(data)
    props.onSave(data)
  }
  console.log('batchId', values)

  return (
    <MUIDialog open={props.open} title='Chi tiết sản phẩm' maxWidth='sm'>
      <>
        <Box p={5} sx={{ width: '100%' }}>
          <Stack direction='row'>
            <Stack direction='column' width={'80%'}>
              <Stack direction={'row'}>
                <Typography fontWeight={'bold'} color={'#0292B1'}>
                  {props.detailData?.productName}
                </Typography>
              </Stack>
              <Typography>
                Hoạt chất: <b> {props.detailData?.ingredients}</b>
              </Typography>
              <Stack direction='row' width={'fullWidth'}>
                <Typography sx={{ width: '50%' }}>
                  Quy cách: <b>{props.detailData?.prescribingUnit?.name}</b>
                </Typography>
                <Typography textAlign={'left'}>Vat: {props.detailData?.vat}%</Typography>
              </Stack>
              <Stack direction='row' width={'fullWidth'}>
                <Typography sx={{ width: '50%' }}>Giá: {formatVND(props.detailData?.price || 0)}</Typography>
                <Typography textAlign={'left'}>Tồn: {batchs?.totalRemaining}</Typography>
              </Stack>
            </Stack>
            <CardMedia
              component={'img'}
              sx={{ width: '20%' }}
              image='https://vivita.vn/wp-content/uploads/2021/08/Tylenol-Extra-Strength-500mg-2.jpg'
            />
          </Stack>
          <Stack direction={'row'} display={'flex'} sx={{ marginTop: 10 }} spacing={2}>
            <TextField
              label='Giá'
              sx={{ width: '50%' }}
              value={props.detailData?.price || 0}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              style={{ width: '30px', fontSize: '1rem', backgroundColor: '#0292b1', color: '#fff' }}
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </Button>
            <TextField
              type='number'
              label='Số lượng'
              value={quantity}
              sx={{ width: '100px' }}
              inputProps={{ min: 0 }}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              style={{ width: '30px', fontSize: '1.2rem', backgroundColor: '#0292b1', color: '#fff' }}
              onClick={() => handleQuantityChange(1)}
            >
              +
            </Button>
          </Stack>

          <Stack direction={'row'} mt={5}>
            {unit === 'VNĐ' ? (
              <TextField
                label='Chiết khấu'
                sx={{ width: '90%' }}
                value={discount}
                onChange={handleDiscountChange}
                InputLabelProps={{ shrink: true }}
                placeholder={unit === 'VNĐ' ? 'number' : 'text'}
              />
            ) : (
              <TextField
                label='Chiết khấu'
                type='text'
                sx={{ width: '90%' }}
                value={`${discount} %`}
                onChange={handleDiscountChange}
                InputLabelProps={{ shrink: true }}
                placeholder={unit === 'VNĐ' ? 'number' : 'text'}
              />
            )}
            <Stack direction={'column'} sx={{ ml: -1, boxShadow: 2 }}>
              <Button
                sx={{
                  backgroundColor: unit === 'VNĐ' ? '#0292b1' : '#ffff',
                  cursor: 'pointer',
                  color: unit === 'VNĐ' ? '#ffff' : '#000',
                  fontWeight: 'bold',
                  height: 28,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                }}
                variant='outlined'
                onClick={handleVndClick}
              >
                VNĐ
              </Button>
              <Button
                sx={{
                  backgroundColor: unit === '%' ? '#0292b1' : '#ffff',
                  cursor: 'pointer',
                  color: unit === '%' ? '#ffff' : '#000',
                  fontWeight: 'bold',
                  height: 28,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: 0
                }}
                variant='outlined'
                onClick={handlePercentClick}
              >
                <PercentIcon />
              </Button>
            </Stack>
          </Stack>
          <TextField
            sx={{ mt: 5 }}
            label='Thành tiền'
            value={totalPrice}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            disablePortal
            sx={{ mt: 5 }}
            fullWidth
            options={props.detailData?.cansales ?? []}
            getOptionLabel={option => option.batchId}
            value={
              (props.detailData &&
                props.detailData.cansales &&
                props.detailData.cansales.find(i => i.batchId === props.detailData?.wh.batchId)) ??
              null
            }
            onChange={(e, value: any) => {
              setValues({
                ...value,
                batchId: value?.batchId
              })
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
                // onClick={() => handleSelectProduct(option)}
              >
                <Typography
                  variant='body1'
                  sx={{ width: '100%', textAlign: 'left', textTransform: 'uppercase', fontWeight: 'bold' }}
                >
                  Mã số lô: {option.batchId}
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
                  Ngày sản xuất: {moment(option?.batch?.startDate).format('DD/MM/YYYY HH:mm')}
                </Typography>
                <Typography variant='body1' sx={{ width: '100%', textAlign: 'left' }}>
                  Ngày hết hạn:{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {moment(option?.batch?.endDate).format('DD/MM/YYYY HH:mm')}
                  </span>
                </Typography>
                <Typography variant='body1' sx={{ width: '100%', textAlign: 'left' }}>
                  Số Lượng tồn kho:
                  <span style={{ fontWeight: 'bold' }}>{option.totalRemaining}</span>
                </Typography>
              </Box>
            )}
            renderInput={params => <TextField {...params} label='Số lô' />}
          />
        </Box>
        <Stack sx={{ padding: '8px', backgroundColor: '#D9D9D9' }} direction={'row'} spacing={4} justifyContent={'end'}>
          <Button
            variant='contained'
            sx={{ width: '180px' }}
            startIcon={<Icon icon='eva:save-fill' />}
            onClick={handleSave}
          >
            Lưu
          </Button>
        </Stack>
      </>
    </MUIDialog>
  )
}

export default DetailDialog
