type StatusStyleType = {
  border: string
  color: string
  backgroundColor: string
}
export const StatusStyle: Record<string, StatusStyleType> = {
  success: {
    border: '1px solid #67C932',
    color: '#67C932',
    backgroundColor: '#26F9A01F'
  },
  pending: {
    border: '1px solid #646E7A',
    color: '#646E7A',
    backgroundColor: '#B8BAB733'
  },
  processing: {
    border: '1px solid #0292B1',
    color: '#0292B1',
    backgroundColor: '#26C6F91F'
  },
  waiting_action: {
    border: '1px solid #FFAB00',
    color: '#FFAB00',
    backgroundColor: '#fff'
  },
  canceled: {
    border: '1px solid #FF3E1D',
    color: '#FF3E1D',
    backgroundColor: '#FF4D491F'
  },
  default: {
    border: '1px solid #6062E8',
    color: '#6062E8',
    backgroundColor: '#666CFF1F'
  }
}
