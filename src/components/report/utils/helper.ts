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

  export const getStatusPrescriptionsResExam = (prescriptions:any[], deleteYn: boolean) => {
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
    } else if (prescriptions.length > 0 && !deleteYn) {
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

  export const getStatusDtqgResExam=(status:boolean)=>{
    if(status===true){
      return{
        label:'Đã Liên Thông',
        styles: {
          color: '#67C932',
          backgroundColor: 'rgba(184, 186, 183, 0.2)',
          borderRadius: '10px',
          border: '1px solid #646E7A',
          padding: '8px 12px',
          fontSize: '14px'
        }
      }
    }else{
      return{
        label:'Chưa Liên Thông',
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