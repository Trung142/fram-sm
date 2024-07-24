// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    icon: 'bx:home-circle'
  },
  {
    title: 'Tiếp Đón',
    path: '/reception',
    icon: 'bx:bxs-group'
  },
  {
    title: 'Khám Bệnh',
    path: '/examination',
    icon: 'bx:folder-plus',
    children: [
      {
        title: 'Đo Sinh Hiệu',
        path: '/examination/measure-vital-signs',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Khám Bệnh',
        path: '/examination/examination-list',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Đơn thuốc',
        path: '/examination/prescription',
        icon: 'bx:folder-plus'
      }
    ]
  },
  {
    title: 'Khách hàng',
    path: '/customer',
    icon: 'bx:group',
    children: [
      {
        title: 'Khách hàng',
        path: '/customer/customer-list',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Tin nhắn',
        path: '/customer/message-list',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Gói khám',
        path: '/customer/customer-package-list',
        icon: 'bx:folder-plus'
      }
    ]
  },
  {
    title: 'Cận Lâm Sàn',
    path: '/subclinical',
    icon: 'bx:group',
    children: [
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Xét nghiệm',
        path: '/subclinical/disease-test'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Siêu âm',
        path: '/subclinical/ultrasound'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Nội soi',
        path: '/subclinical/endoscopic'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'XQuang',
        path: '/subclinical/xray'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'CT',
        path: '/subclinical/ct-scan'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Điện tim',
        path: '/subclinical/ecg'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Thủ thuật',
        path: '/subclinical/micro-surgery'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Phẫu thuật',
        path: '/subclinical/surgery'
      },
      {
        icon: 'bx:pie-chart-alt-2',
        title: 'Dịch vụ khác',
        path: '/subclinical/other-service'
      }
    ]
  },
  {
    title: 'Nhà thuốc',
    path: '/drugstore',
    icon: 'bx:group',
    children: [
      {
        title: 'Điểm bán hàng',
        path: '/drugstore/pharmacy',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Đơn hàng',
        path: '/drugstore/order',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Hóa đơn bán hàng',
        path: '/drugstore/order-invoice',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Khách trả hàng',
        path: '/drugstore/customer-return',
        icon: 'bx:folder-plus'
      }
    ]
  },
  {
    title: 'Quản lý kho',
    path: '/inventory',
    icon: 'bx:group',
    children: [
      {
        title: 'Nhập hàng tồn kho đầu vào',
        path: '/inventory/ip-inventory',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Nhập tồn từ NCC',
        path: '/inventory/ip-from-supplier',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Xuất trả NCC',
        path: '/inventory/ep-from-supplier',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Xuất hủy hàng',
        path: '/inventory/ep-cancellations',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Xuất khác - Xuất tiêu hao',
        path: '/inventory/ep_other',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Xuất điều chuyển',
        path: '/inventory/ep_transfer',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Tồn kho',
        path: '/inventory/inventory',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Kiểm kho',
        path: '/inventory/inventory-check',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Nhà cung cấp',
        path: '/inventory/supplier',
        icon: 'bx:folder-plus'
      }
    ]
  },
  {
    title: 'Kế Toán',
    path: '/account',
    icon: 'bx:group',
    children: [
      {
        title: 'Thanh toán',
        path: '/account/payment',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Hóa đơn',
        path: '/account/invoice',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Sổ quỹ',
        path: '/account/cash-book',
        icon: 'bx:folder-plus'
      }
    ]
  },
  {
    title: 'Báo cáo',
    path: '/report',
    icon: 'bx:group',
    children: [
      {
        title: 'Báo Cáo Khám',
        path: '/report/report-exam',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Báo Cáo Cận Lâm Sàn',
        path: '/report/report-CLS',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Báo Cáo BHYT',
        path: '/report/report-BHYT',
        icon: 'bx:folder-plus'
      }
    ]
  },
  {
    title: 'Hệ thống',
    path: '/system',
    icon: 'bx:group',
    children: [
      {
        title: 'Hàng hóa',
        path: '/system/product',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Dịch vụ',
        path: '/system/service',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Gói khám',
        path: '/system/package-service',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Phác đồ',
        path: '/system/treatment-regimen',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Đơn thuốc mẫu',
        path: '/system/sample-prescription',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Dịch vụ mẫu',
        path: '/system/sample-service',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Gợi ý liều dùng',
        path: '/system/sample-suggest',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Vai trò',
        path: '/system/role',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Tài khoản',
        path: '/system/user',
        icon: 'bx:folder-plus'
      },
      {
        title: 'Lịch làm việc',
        path: '/system/working-calendar'
      },
      {
        title: 'Phòng ban',
        path: '/system/departments'
      },
      {
        title: 'Kho hàng',
        path: '/system/manage-inventories'
      },
      {
        title: 'Liên thông',
        path: '/system/interconnect'
      },
      {
        title: 'Cái đặt phòng khám',
        path: '/system/setting'
      },
      {
        title: 'Cài mẫu in ấn',
        path: '/system/template-setting'
      }
    ]
  }
  // {
  //   path: '/acl',
  //   action: 'read',
  //   subject: 'acl-page',
  //   title: 'Access Control',
  //   icon: 'bx:shield'
  // }
]

export default navigation
