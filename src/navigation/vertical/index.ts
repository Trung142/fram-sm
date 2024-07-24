// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
          title: 'Khám Nhi',
          path: '/examination/pediatric-examination',
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
          path: '/report/examination-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Phiếu Khám',
              path: '/report/examination-report/examination-card',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Theo Dõi Khách Hàng PrEP',
              path: '/report/examination-report/examination-customer-book',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Cận Lâm Sàn',
          path: '/report/report-CLS',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Sổ Xét Nghiệm',
              path: '/report/report-CLS/tests-report',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Siêu Âm',
              path: '/report/report-CLS/ultrasound-report',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Nội Soi',
              path: '/report/report-CLS/endoscopic-report',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ X-Quang',
              path: '/report/report-CLS/x-ray-report',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Điện Tim',
              path: '/report/report-CLS/ecg-report',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Chi Tiết',
              path: '/report/report-CLS/details',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo BHYT',
          path: '/report/report-BHYT',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Tổng Hợp',
              path: '/report/report-BHYT/general',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Liên Thông',
              path: '/report/report-BHYT/interconnect',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Bán Hàng',
          path: '/report/sale-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/sale-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Doanh Thu Chi Tiết',
              path: '/report/sale-report/revenue-details',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Doanh Thu Theo Loại Dịch Vụ',
              path: '/report/sale-report/revenue-by-service',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Doanh Thu Theo Nhóm Dịch Vụ',
              path: '/report/sale-report/revenue-by-group-service',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Chiết Khấu',
              path: '/report/sale-report/discount',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Dịch Vụ',
              path: '/report/sale-report/service',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Gói Khám',
              path: '/report/sale-report/health-check-package',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hoàng Hóa',
              path: '/report/sale-report/commodity',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Thu Chi',
              path: '/report/sale-report/revenue-and-expenditure',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Nhân Viên',
              path: '/report/sale-report/employees',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Lợi Nhuận',
              path: '/report/sale-report/profit',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Khách Hàng',
          path: '/report/customer-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/customer-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Doanh Thu Chi Tiết',
              path: '/report/customer-report/revenue-details',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Công Nợ',
              path: '/report/customer-report/debt',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Kho',
          path: '/report/warehouse-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Xuất Nhập Tồn',
              path: '/report/warehouse-report/commodity-importing-exporting-list',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Xuất Nhập Tồn Chi Tiết',
              path: '/report/warehouse-report/commodity-importing-exporting-list-details',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Xuất Hủy',
              path: '/report/warehouse-report/commodity-cancel-list',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hàng Cận Date',
              path: '/report/warehouse-report/commodity-expiry-list',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Bác Sĩ',
          path: '/report/doctor-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/doctor-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Lợi Nhuận',
              path: '/report/doctor-report/profit',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hàng Bán Théo Bác Sĩ',
              path: '/report/doctor-report/sale-product-by-doctor',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Nhân Viên',
          path: '/report/employees-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/employees-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Lợi Nhuận',
              path: '/report/employees-report/profit',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hàng Bán Théo Bác Sĩ',
              path: '/report/employees-report/sale-product-by-employee',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Người Giới Thiệu',
          path: '/report/representer-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/representer-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hàng Bán Théo Bác Sĩ',
              path: '/report/representer-report/sale-product-by-representer',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Công Nợ Chi Tiết Theo Người Giới Thiệu',
              path: '/report/representer-report/debt-details-by-representer',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Người Tư Vấn',
          path: '/report/adviser-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/adviser-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Lợi Nhuận',
              path: '/report/adviser-report/profit',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hàng Bán Theo Người Tư Vấn',
              path: '/report/adviser-report/sale-product-by-adviser',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Người Thực Hiện',
          path: '/report/executor-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/executor-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Lợi Nhuận',
              path: '/report/executor-report/profit',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Dịch Vụ Theo Người Thực Hiện',
              path: '/report/executor-report/service-by-executor',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Nhà Cung Cấp',
          path: '/report/supplier-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Doanh Thu',
              path: '/report/supplier-report/revenue',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Công nợ',
              path: '/report/supplier-report/debt',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Hàng Nhập Theo Nhà Cung Cấp',
              path: '/report/supplier-report/product-by-supplier',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Nhà Thuốc',
          path: '/report/clinic-report',
          icon: 'bx:folder-plus',
          children: [
            {
              title: 'Nhiệt Độ - Độ Ẩm',
              path: '/report/clinic-report/temperature-humidity',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Theo Dõi Xuất Nhập Thuốc',
              path: '/report/clinic-report/drugs-tracking-book',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Xuất Nhập Tồn Thuốc Kiểm Soát Đặc Biệt',
              path: '/report/clinic-report/special-controlled-drugs',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Theo Dõi Thông Tin Chi Tiết Khách Hàng',
              path: '/report/clinic-report/customer-detailed-information-tracking-book',
              icon: 'bx:bookmark-plus'
            },
            {
              title: 'Sổ Theo Dõi Xuất Nhập Tồn Thuốc Kiểm Soát Đặc Biệt',
              path: '/report/clinic-report/special-controlled-drugs-tracking-book',
              icon: 'bx:bookmark-plus'
            }
          ]
        },
        {
          title: 'Báo Cáo Tài Chính',
          path: '/report/financial-report',
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
          title: 'Nhân viên',
          path: '/system/employee',
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
  ]
}

export default navigation
