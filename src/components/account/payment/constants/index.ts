type Status = {
  id: number
  label: string
  value: string
}

export const AppointScheduleStatuses: Status[] = [
  {
    id: 1,
    label: 'Chờ xác nhận',
    value: '110'
  },
  {
    id: 2,
    label: 'Đã xác nhận',
    value: '112'
  },
  {
    id: 3,
    label: 'Hoàn tất',
    value: '114'
  },
  {
    id: 4,
    label: 'Đã hủy',
    value: '115'
  }
]

export const ResExamStatuses: Status[] = [
  {
    id: 1,
    label: 'Chờ khám',
    value: '100'
  },
  {
    id: 2,
    label: 'Đang khám',
    value: '102'
  },
  {
    id: 3,
    label: 'Chờ thực hiện',
    value: '104'
  },
  {
    id: 4,
    label: 'Hoàn thành',
    value: '106'
  },
  {
    id: 5,
    label: 'Hủy khám',
    value: '107'
  }
]
