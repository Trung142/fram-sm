import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import { Button, TextField, TableHead, List } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
export const TabListWrapper = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    borderBottom: '0px solid',
    gap: 10
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    backgroundColor: '#E0E0E0',
    border: 0,
    color: '#32475CDE',
    borderBottom: '0px solid',
    borderRadius: '6px',
    minWidth: '200px',
    '&:hover': {
      color: '#0292B1',
      border: '2px solid #0292B1'
    },
    '&.Mui-selected': {
      backgroundColor: '#fff',
      color: '#0292B1',
      border: '2px solid #0292B1',
      borderRadius: '6px'
    }
  }
}))
export const TinyButton = styled(Button)(({ theme }) => ({
  minWidth: '30px',
  padding: 0
}))
export const GreyDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .css-3aa9u3-MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[800]
  }
}))
export const ListPopOverWrapper = styled(List)(({ theme }) => ({
  '& .css-1z08kpf-MuiButtonBase-root-MuiListItemButton-root:hover': {
    backgroundColor: '#0292B1'
  }
}))
export const TableHeaderWrapper = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[800]
}))
// export const GridDataWrapper=
export const StyledRequiredTextField = styled(TextField)(() => ({
  '& .MuiFormLabel-asterisk': {
    color: 'red'
  }
}))

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})
