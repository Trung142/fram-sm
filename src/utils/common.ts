export const getGender = (genderId: any) => {
  switch (genderId) {
    case 1:
      return 'Nữ'
    case 2:
      return 'Nam'
    default:
      return 'Unknown gender'
  }
}

export const statusMapping = (
  status: any,
  styles: {
    statusWaiting: any
    statusExaming: any
    statusPending: any
    statusDone: any
    statusComplete: any
    statusCancel: any
  }
) => {
  switch (status) {
    case '00':
      return { className: styles.statusWaiting, label: 'Chờ khám' }
    case '10':
      return { className: styles.statusExaming, label: 'Đang khám' }
    case '20':
      return { className: styles.statusPending, label: 'Chờ thực hiện' }
    case '30':
      return { className: styles.statusDone, label: 'Đã thực hiện' }
    case '40':
      return { className: styles.statusComplete, label: 'Hoàn thành' }
    case '50':
      return { className: styles.statusCancel, label: 'Hủy khám' }
    default:
      return { className: styles.statusWaiting, label: 'Chờ khám' }
  }
}

export const statusSubclinicalMapping = (
  status: any,
  styles: {
    statusPending: any
    statusComplete: any
    statusInProgress: any
    statusCancel: any
  }
) => {
  switch (status) {
    case '1000_100':
      return { className: styles.statusPending, label: 'Chờ thực hiện' }
    case '1000_102':
      return { className: styles.statusInProgress, label: 'Đang thực hiện' }
    case '1000_104':
      return { className: styles.statusComplete, label: 'Đã thực hiện' }
    case '1000_105':
      return { className: styles.statusCancel, label: 'Đã hủy' }
    default:
      return { className: styles.statusPending, label: 'Chờ thực hiện' }
  }
}
