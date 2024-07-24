export type TabDetailData = {
  value: string,
  text: string,
}

export const TabDetails: TabDetailData[] = [
  {
    value: 'waiting_examines',
    text: 'Chờ Khám',
  },
  {
    value: 'examines',
    text: 'Đang Khám',
  },
  {
    value: 'waiting_action',
    text: 'Chờ thực hiện',
  },
  {
    value: 'success',
    text: 'Hoàn thành',
  },
  {
    value: 'canceled',
    text: 'Hủy Khám',
  },

]


