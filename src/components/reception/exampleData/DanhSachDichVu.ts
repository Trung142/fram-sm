import { ServiceGroup } from '../graphql/types'

export const DanhSachDichVu: ServiceGroup[] = [
  {
    serviceGroupId: 'SRG00018',
    services: [
      {
        __typename: 'Service',
        id: 'sr2024031110000001',
        name: 'MauInKetQua',
        price: 500000,
        bhytId: null,
        bhytPrice: 0,
        bhytName: null,
        chooseSpecIndex: false,
        clinicId: 'CLI0001',
        cost: 200000,
        createAt: '2024-03-11T01:48:17.629+07:00',
        createBy: 'System',
        describe: 'no',
        gender: 0,
        insurancePaymentRate: 0,
        serviceGroupId: 'SRG00018',
        serviceTypeId: 'SRT00016',
        status: false,
        quantity: 2
      }
    ]
  },
  {
    serviceGroupId: 'SRG00019',
    services: [
      {
        __typename: 'Service',
        id: 'sr2024030110000000',
        name: 'Xét nghiệm 88',
        price: 50000,
        bhytId: '1122',
        bhytPrice: 500000,
        bhytName: 'bao hiem te y',
        chooseSpecIndex: false,
        clinicId: 'CLI0001',
        cost: 100000,
        createAt: null,
        createBy: null,
        describe: 'Mo ta',
        gender: 0,
        insurancePaymentRate: 2,
        serviceGroupId: 'SRG00019',
        serviceTypeId: 'SRT00015',
        status: true,
        quantity: 1
      }
    ]
  }
]
