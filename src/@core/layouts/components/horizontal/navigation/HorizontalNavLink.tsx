// ** React Imports
import { ElementType, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Hook Import
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

// ** Util Imports
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { handleURLQueries } from 'src/@core/layouts/utils'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<
  ListItemProps & { component?: ElementType; href: string; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: 'auto',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: hexToRGBA(theme.palette.common.white, 0.3)
  },
  '&:focus-visible': {
    outline: 0,
    backgroundColor: theme.palette.action.focus
  }
}))

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props

  // ** Hook & Vars
  const router = useRouter()
  const { skin, mode } = settings
  const bgColors: UseBgColorType = useBgColor()
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const icon = item.icon ? item.icon : navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: skin === 'bordered' ? 2.375 : 2.5 } } : {})}>
        <ListItem
          component={Link}
          disabled={item.disabled}
          {...(item.disabled && { tabIndex: -1 })}
          className={clsx({ active: isNavLinkActive() })}
          target={item.openInNewTab ? '_blank' : undefined}
          href={item.path === undefined ? '/' : `${item.path}`}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sx={{
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            ...(!hasParent
              ? {
                  borderRadius: 5,
                  '&.active': {
                    backgroundColor: bgColors.primaryLight.backgroundColor,
                    '&:focus-visible': {
                      backgroundColor: theme =>
                        mode === 'light' ? hexToRGBA(theme.palette.common.white, 0.8) : 'primary.dark'
                    },
                    '& .MuiTypography-root': {
                      color: 'primary.main'
                    }
                  }
                }
              : { py: 2.5 })
          }}
        >
          <Box sx={{ gap: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' }),
                ...(hasParent && isNavLinkActive() && { pl: 1.5, ml: -1.5 })
              }}
            >
              <ListItemIcon
                sx={{
                  mr: icon === navSubItemIcon ? 2.5 : 2,
                  '& svg': { transition: 'transform .25s ease-in-out' },
                  ...(icon === navSubItemIcon && { color: 'text.disabled' }),
                  ...{ color: hasParent ? 'text.primary' : 'common.white' },
                  ...(isNavLinkActive() && {
                    color: 'primary.main',
                    ...(hasParent &&
                      icon === navSubItemIcon && {
                        '& svg': {
                          transform: 'scale(1.35)',
                          filter: theme => `drop-shadow(0 0 2px ${theme.palette.primary.main})`
                        }
                      })
                  })
                }}
              >
                <UserIcon icon={icon} fontSize={icon === navSubItemIcon ? '0.4375rem' : '1.375rem'} />
              </ListItemIcon>
              <Typography
                {...(menuTextTruncate && { noWrap: true })}
                sx={{
                  ...{ color: hasParent ? 'primary.main' : 'common.white'},
                  ...(isNavLinkActive()
                    ? hasParent && { fontWeight: 600 }
                    : { color: hasParent ? 'text.primary' : 'common.white' })
                }}
              >
                <Translations text={item.title} />
              </Typography>
            </Box>
            {item.badgeContent ? (
              <Chip
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  height: 20,
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                }}
              />
            ) : null}
          </Box>
        </ListItem>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
