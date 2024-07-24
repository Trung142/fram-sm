import { PaginationModel } from './type'

export const remapForDataGrid = (data: Record<string, any>[], paginationModel: PaginationModel) =>
  data.map((item, index) => ({
    ...item,
    index: index + 1 + paginationModel.page * paginationModel.pageSize
  }))

export const getStatus = (status: string) => {
  switch (status) {
    case '110':
      return {
        label: 'Chờ xác nhận',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '8px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '112':
      return {
        label: 'Đã xác nhận',
        styles: {
          color: '#03C3EC',
          backgroundColor: 'rgba(38, 198, 249, 0.12)',
          borderRadius: '10px',
          border: '1px solid #03C3EC',
          padding: '8px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '114':
      return {
        label: 'Hoàn tất',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          borderRadius: '10px',
          border: '1px solid #67C932',
          padding: '8px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '115':
      return {
        label: 'Đã hủy',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          borderRadius: '10px',
          border: '1px solid #FF3E1D',
          padding: '8px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '8px 12px',
          fontSize: '14px'
        }
      }
  }
}

export const getStatusResExam = (status: string) => {
  switch (status) {
    case '100':
      return {
        label: 'Chờ khám',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '10px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '102':
      return {
        label: 'Đang khám',
        styles: {
          color: '#16B1FF',
          backgroundColor: 'rgba(38, 198, 249, 0.12)',
          borderRadius: '10px',
          border: '1px solid #16B1FF',
          padding: '10px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '104':
      return {
        label: 'Chờ thực hiện',
        styles: {
          color: '#6062E8',
          backgroundColor: 'rgba(102, 108, 255, 0.12)',
          borderRadius: '10px',
          border: '1px solid #6062E8',
          padding: '10px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '106':
      return {
        label: 'Hoàn thành',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          borderRadius: '10px',
          border: '1px solid #67C932',
          padding: '10px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    case '107':
      return {
        label: 'Hủy khám',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          borderRadius: '10px',
          border: '1px solid #FF3E1D',
          padding: '10px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '10px 12px',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center'
        }
      }
  }
}

export const getStatusResExamForWaitingScreen = (status: string) => {
  switch (status) {
    case '100':
      return {
        label: 'Chờ khám',
        styles: {
          color: '#8082FF',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #8082FF',
          padding: '8px 12px',
          fontSize: '18px'
        }
      }
    case '102':
      return {
        label: 'Đang khám',
        styles: {
          color: '#16B1FF',
          backgroundColor: 'rgba(38, 198, 249, 0.12)',
          borderRadius: '10px',
          border: '1px solid #16B1FF',
          padding: '8px 12px',
          fontSize: '18px'
        }
      }
    case '104':
      return {
        label: 'Chờ thực hiện',
        styles: {
          color: '#FFAB00',
          backgroundColor: 'rgba(102, 108, 255, 0.12)',
          borderRadius: '10px',
          border: '1px solid #FFAB00',
          padding: '8px 12px',
          fontSize: '18px'
        }
      }
    case '106':
      return {
        label: 'Hoàn thành',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          borderRadius: '10px',
          border: '1px solid #67C932',
          padding: '8px 12px',
          fontSize: '18px'
        }
      }
    case '107':
      return {
        label: 'Hủy khám',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          borderRadius: '10px',
          border: '1px solid #FF3E1D',
          padding: '8px 12px',
          fontSize: '18px'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186 ,183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '8px 12px',
          fontSize: '18px'
        }
      }
  }
}

export const getStatusPrescriptionsResExam = (status: boolean, deleteYn: boolean) => {
  if (deleteYn) {
    return {
      label: 'Đã hủy đơn',
      styles: {
        color: '#FF3E1D',
        backgroundColor: 'rgba(255, 77, 73, 0.12)',
        borderRadius: '10px',
        border: '1px solid #FF3E1D',
        padding: '10px 12px',
        fontSize: '14px'
      }
    }
  } else if (status && !deleteYn) {
    return {
      label: 'Đã kê đơn',
      styles: {
        color: '#67C932',
        backgroundColor: 'rgba(38, 249, 160, 0.12)',
        borderRadius: '10px',
        border: '1px solid #67C932',
        padding: '10px 12px',
        fontSize: '14px'
      }
    }
  } else {
    return {
      label: 'Chưa kê đơn',
      styles: {
        color: '#646E7A',
        backgroundColor: 'rgba(184, 186, 183, 0.2)',
        borderRadius: '10px',
        border: '1px solid #646E7A',
        padding: '8px 12px',
        fontSize: '14px'
      }
    }
  }
}

export const getPaymentStatusForResExam = (status: string) => {
  switch (status) {
    case '100':
      return {
        label: 'Chờ thanh toán',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '8px 12px',
          fontSize: '14px'
        }
      }
    case '102':
      return {
        label: 'Đã thanh toán',
        styles: {
          color: '#03C3EC',
          backgroundColor: 'rgba(38, 198, 249, 0.12)',
          borderRadius: '10px',
          border: '1px solid #03C3EC',
          padding: '8px 12px',
          fontSize: '14px'
        }
      }
    case '104':
      return {
        label: 'Hủy thanh toán',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          borderRadius: '10px',
          border: '1px solid #FF3E1D',
          padding: '8px 12px',
          fontSize: '14px'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '8px 12px',
          fontSize: '14px'
        }
      }
  }
}

export const debounce = <T extends (...args: any[]) => void>(callback: T, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    clearTimeout(timeout!)
    timeout = setTimeout(() => callback(...args), wait)
  }
}
