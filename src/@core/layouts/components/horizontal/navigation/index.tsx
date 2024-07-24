// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Menu Components
import HorizontalNavItems from './HorizontalNavItems'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
interface Props {
  settings: LayoutProps['settings']
  horizontalNavItems: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['navMenu']>['navItems']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
}

const Navigation = (props: Props) => {
  // ** Props
  const { appBarContent: userAppBarContent } = props

  return (
    <Box
      className='menu-content'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box
        sx={{
          flex: 1,
          gap: 3,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          '& > *': {
            '&:not(:last-child)': { mr: 0.5 },
            ...(themeConfig.menuTextTruncate && { maxWidth: 200 })
          }
        }}
      >
        <HorizontalNavItems {...props} />
      </Box>
      {/* <div>
        {userAppBarContent ? userAppBarContent(props) : null}
      </div> */}
    </Box>
  )
}

export default Navigation
