export const getStatusResExam = (status: string) => {
  switch (status) {
    case '100':
      return {
        label: 'Chờ khám',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '8px',
          border: '1px solid #646E7A',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    case '102':
      return {
        label: 'Đang khám',
        styles: {
          color: '#16B1FF',
          backgroundColor: 'rgba(38, 198, 249, 0.12)',
          borderRadius: '8px',
          border: '1px solid #16B1FF',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    case '104':
      return {
        label: 'Chờ thực hiện',
        styles: {
          color: '#6062E8',
          backgroundColor: 'rgba(102, 108, 255, 0.12)',
          borderRadius: '8px',
          border: '1px solid #6062E8',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    case '106':
      return {
        label: 'Hoàn thành',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          borderRadius: '8px',
          border: '1px solid #67C932',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    case '107':
      return {
        label: 'Hủy khám',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          borderRadius: '8px',
          border: '1px solid #FF3E1D',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '8px',
          border: '1px solid #646E7A',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
  }
}

export const getInvoiceStatus = (status: string) => {
  switch (status) {
    case '10':
      return {
        label: 'Chờ khám',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          border: '1px solid #646E7A',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
    case '20':
      return {
        label: 'Hoàn thành',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          border: '1px solid #67C932',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
    case '30':
      return {
        label: 'Hủy khám',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          border: '1px solid #FF3E1D',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          border: '1px solid #646E7A',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
  }
}

export const getExploreObjectType = (id: string) => {
  switch (id) {
    case 'EO0000001':
      return {
        label: 'BHYT',
        styles: {
          color: '#FFAB00',
          backgroundColor: '#FDB5281F',
          borderRadius: '10px',
          border: '1px solid #FFAB00',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    case 'EO0000002':
      return {
        label: 'Dịch vụ',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          borderRadius: '10px',
          border: '1px solid #67C932',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
          textAlign: 'center'
        }
      }
    case 'EO0000003':
      return {
        label: 'Miễn phí',
        styles: {
          color: '#16B1FF',
          backgroundColor: 'rgba(38, 198, 249, 0.12)',
          borderRadius: '10px',
          border: '1px solid #16B1FF',
          padding: '10px 12px',
          fontSize: '14px',
          minWidth: '130px',
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
          minWidth: '130px',
          textAlign: 'center'
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
        border: '1px solid #FF3E1D',
        padding: '5px',
        fontSize: '14px',
        width: '40px'
      }
    }
  } else if (status && !deleteYn) {
    return {
      label: 'Đã kê đơn',
      styles: {
        color: '#67C932',
        backgroundColor: 'rgba(38, 249, 160, 0.12)',
        border: '1px solid #67C932',
        padding: '5px',
        fontSize: '14px',
        width: '40px'
      }
    }
  } else {
    return {
      label: 'Chưa kê đơn',
      styles: {
        color: '#646E7A',
        backgroundColor: 'rgba(184, 186, 183, 0.2)',
        border: '1px solid #646E7A',
        padding: '5px',
        fontSize: '14px',
        width: '40px'
      }
    }
  }
}

export const getPaymentStatus = (status: string) => {
  switch (status) {
    case '112':
      return {
        label: 'Đã thanh toán',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(38, 249, 160, 0.12)',
          border: '1px solid #67C932',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
    case '113':
      return {
        label: 'Hủy thanh toán',
        styles: {
          color: '#FF3E1D',
          backgroundColor: 'rgba(255, 77, 73, 0.12)',
          border: '1px solid #FF3E1D',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
    default:
      return {
        label: 'Không xác định',
        styles: {
          color: '#646E7A',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          border: '1px solid #646E7A',
          padding: '5px',
          fontSize: '14px',
          width: '40px',
          textAlign: 'center'
        }
      }
  }
}
