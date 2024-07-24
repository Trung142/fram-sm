import {
  Box,
  Typography
} from '@mui/material'
import { memo } from 'react'

type LabelPropsType = {
  text: string
  rowCount: number
}

const TableTabLabel: React.FC<LabelPropsType> = ({rowCount, text}) => {
  return (
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
			  <Typography
			    sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}
			  >
			    {text}
        </Typography>
			  <Typography
			    sx={{
			      color: '#fff',
			      ml: 4,
			      backgroundColor: 'red',
			      borderRadius: '50%',
			      width: '1.5rem',
			      height: '1.5rem'
			    }}
			  >
			    {rowCount}
			  </Typography>
			</Box>
  )
}

export default memo(TableTabLabel)
