import { PropsWithChildren, useState } from "react"
import {
  Card,
  CardHeader,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material'
// Material-UI icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const CardTemplate: React.FC<PropsWithChildren<{title: string, isExpand?: boolean}>> = ({ children, title, isExpand=true }) => {
  const [expanded, setExpanded] = useState<boolean>(isExpand)
  return (
		<Card sx={{ width: '100%' }}>
		  <CardHeader
		    sx={{ backgroundColor: '#0292B1', height: '50px', mb: '20px' }}
		    title={
		      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
		        <Typography style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem' }}>{title}</Typography>
		        <IconButton
		          onClick={() => setExpanded(prev => !prev)}
		          aria-expanded={expanded}
		          aria-label='show more'
		          style={{
		            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
		          }}
		        >
		          <ExpandMoreIcon
		            sx={{
		              color: 'white'
		            }}
		          />
		        </IconButton>
		      </div>
		    }
		  />
		  <Collapse in={expanded} timeout='auto' unmountOnExit>
        {children}
      </Collapse>
    </Card>
  )
}

export default CardTemplate
