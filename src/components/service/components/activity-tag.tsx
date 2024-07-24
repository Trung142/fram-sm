import { ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import styles from './activity-tag.module.scss'
type Props = {
  type: 'success' | 'warning' | 'primary' | 'denied' | undefined
  children: ReactNode
}
const ActivityTag = ({ children, type = 'primary' }: Props) => {
  const theme = useTheme()
  let color = theme.palette.primary.main
  if (type === 'warning') {
    color = theme.palette.warning.main
  }
  if (type === 'success') {
    color = theme.palette.success.main
  }
  if(type==='denied'){
    color=theme.palette.error.main
  }
  return (
    <div style={{ border: `1px solid ${color}`, color }} className={styles.container}>
      <span>{children}</span>
    </div>
  )
}

export default ActivityTag

