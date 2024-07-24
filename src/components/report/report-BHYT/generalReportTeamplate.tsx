import { Typography } from "@mui/material"
import { maxWidth, minWidth } from "@mui/system"
import { GridColDef } from "@mui/x-data-grid"
import moment from "moment"

//========Mau 19============
const checkTotalRemaining = (data: any[]) => {
  let total = 0
  data?.forEach((item: any) => {
    total += item.totalRemaining
  })
  return total
}

const formatDatetoYear=((date :Date)=>{
  return moment(date).format('yyyy')
})


export const COLUMN_DEF_TYPE_19: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 20,
      maxWidth: 180,
      field: 'index',
      headerName: 'STT theo DMT của BYT',
      align:'center'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'bhytId',
      headerName: 'Mã số theo danh mục do BYT ban hành'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 500,
      field: 'bhytName',
      headerName: 'Tên VTYT theo danh mục do BYT ban hành',
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 500,
      field: 'productName',
      headerName: 'Tên thương mại'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 180,
      field: 'ingredients',
      headerName: 'Quy Cách'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      field: 'unit.name',
      headerName: 'Đơn Vị Tính',
      valueGetter:params=>params?.row?.unit?.name
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'endDate',
      headerName: 'Giá mua vào (đồng)'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      field: 'quantity',
      headerName: 'Số Lượng',
      renderCell:params=>{
        return(
          <Typography>{checkTotalRemaining(params?.row?.cansales)}</Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 250,
      field: 'bhytPrict',
      headerName: 'Giá thanh toán BHYT (đồng)',
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'final_price',
      headerName: 'Thành tiền (đồng)',
      renderCell:params=>(
        <>{(checkTotalRemaining(params?.row?.cansales))*params?.row?.bhytPrict}</>
      )
    }
  ]

export const COLUMN_DEF_TYPE_20: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 20,
      maxWidth: 180,
      field: 'index',
      headerName: 'STT theo DMT của BYT',
      align:'center'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 300,
      field: 'ingredients',
      headerName: 'Tên Hoạt Chất'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 350,
      field: 'productName',
      headerName: 'Tên Thuốc'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'instructions.name',
      headerName: 'Đường dùng, dạng bào chế',
      valueGetter:params=>params?.row?.instructions?.name
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      field: 'serviceGroup',
      headerName: 'Hàm lượng, nồng độ'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 250,
      field: 'resNumber',
      headerName: 'Số đăng ký hoặc số GPNK'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'unit.name',
      headerName: 'Đơn vị tính',
      valueGetter:params=>params?.row?.unit?.name
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      field: 'quantity',
      headerName: 'Số Lượng',
      renderCell:params=>{
        return(
          <Typography>{checkTotalRemaining(params?.row?.cansales)}</Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 250,
      field: 'price',
      headerName: '	Đơn giá (đồng)'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'final_price',
      headerName: 'Thành tiền (đồng)',
      renderCell:params=>{
        return(
          <Typography>{(checkTotalRemaining(params?.row?.cansales))*params?.row?.price}</Typography>
        )
      }
    }
  ]

  export const COLUMN_DEF_TYPE_21: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 20,
      maxWidth: 180,
      field: 'index',
      headerName: 'STT theo DMT của BYT',
      align:'center'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 300,
      field: 'bhytId',
      headerName: 'Mã số theo danh mục BYT'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 350,
      field: 'bhytName',
      headerName: 'Tên Dịch Vụ Y Tế'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      field: 'quantity',
      headerName: 'Số Lượng',
      renderCell:params=>{
        return(
          <Typography>{checkTotalRemaining(params?.row?.cansales)}</Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 180,
      field: 'bhytPrict',
      headerName: 'Đơn Giá (đồng)'
    },
    {
      flex: 0.1,
      minWidth: 50,
      maxWidth: 180,
      field: 'final_price',
      headerName: 'Thành Tiền (đồng)',
      renderCell:params=>{
        return(
          <Typography>{checkTotalRemaining(params?.row?.cansales)*params?.row?.bhytPrict}</Typography>
        )
      }
    }
  ]
  export const COLUMN_DEF_TYPE_79: GridColDef[] = [
    {
      minWidth: 20,
      maxWidth: 100,
      field: 'index',
      headerName: 'STT',
      align:'center'
    },
    {
      minWidth: 50,
      maxWidth: 500,
      width:200,
      field: 'name',
      headerName: 'Họ Và Tên'
    },
    {
      minWidth: 100,
      maxWidth: 350,
      field: 'birthday',
      headerName: 'Năm Sinh',
      valueGetter:params=>formatDatetoYear(params?.value)
    },
    {
      minWidth: 50,
      maxWidth: 150,
      width:250,
      field: 'patBhyt',
      headerName: 'Mã thẻ BHYT'
    },
    {
      minWidth: 50,
      maxWidth: 100,
      field: 'serviceGroup',
      headerName: 'Mã ĐKBĐ'
    },
    {
      minWidth: 50,
      maxWidth: 100,
      field: 'startDate',
      headerName: 'Mã bệnh'
    },
    {
      minWidth: 50,
      maxWidth: 150,
      field: 'endDate',
      headerName: 'Ngày Khám'
    },
    {
      minWidth: 50,
      maxWidth: 100,
      field: 'reason',
      headerName: 'Xét Nghiệm'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'status',
      headerName: 'CĐHA TDCN'
    },
    {
      minWidth: 50,
      maxWidth:300,
      width:100,
      field: 'statusS',
      headerName: 'Thuốc'
    },
    {
      minWidth: 50,
      maxWidth: 350,
      width:200,
      field: 'statuswag',
      headerName: 'Máu và chế phẩm máu'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'ttpt',
      headerName: 'TTPT'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'vtyt',
      headerName: 'VTYT'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'DVKT',
      headerName: 'DVKT'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'fsagw',
      headerName: 'Thuốc'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'tienkham',
      headerName: 'Tiền Khám'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'vanchuyen',
      headerName: 'Vận Chuyển'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'patpay',
      headerName: 'Người Bệnh Chi Trả'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'payments',
      headerName: 'Tổng Cộng'
    },
    {
      minWidth: 50,
      maxWidth: 250,
      field: 'quy',
      headerName: 'Trong đó chi phí ngoài quỹ định suất'
    },
    
  ]

export const COLUMN_DEF_TYPE_CHILD:GridColDef[]=[
  {
    flex:0.1,
    minWidth:50,
    maxWidth:100,
    field:'index',
    headerName:'STT'
  },
  {
    flex:0.1,
    minWidth:50,
    maxWidth:220,
    field:'name',
    headerName:'Họ Và Tên'
  },  
  {
    flex:0.1,
    minWidth:50,
    maxWidth:100,
    field:'patBhyt',
    headerName:'Số thẻ BHYT theo CV 531/BHXH-CSYT'
  },
  {
    flex:0.1,
    minWidth:50,
    maxWidth:100,
    field:'id',
    headerName:'Mã đăng ký KCB ban đầu theo CV 531'
  },
  {
    flex:0.1,
    minWidth:50,
    maxWidth:150,
    field:'birthday',
    headerName:'Năm sinh',
    valueGetter:params=>formatDatetoYear(params.value)
  },
  {
    flex:0.1,
    minWidth:50,
    maxWidth:200,
    field:'familyName',
    headerName:'Tên bố mẹ hoặc người giám hộ'
  },
  {
    flex:0.1,
    minWidth:50,
    maxWidth:220,
    field:'address',
    headerName:'Địa chỉ thường trú	'
  },
  {
    flex:0.1,
    minWidth:50,
    maxWidth:100,
    field:'Fsa',
    headerName:'BHXH thanh toán'
  }
]
export const COLUMN_DEF_TYPE_DETAIL=[
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 100,
    field: 'index',
    headerName: 'STT'
  },
  {
    flex: 0.1,
    minWidth: 100,
    maxWidth: 250,
    field: 'clinicname',
    headerName: 'Tên Bệnh Viên'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'id',
    headerName: 'Mã Số'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'sohs',
    headerName: 'Số Hồ Sơ'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'name',
    headerName: 'Họ và Tên'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'birth',
    headerName: 'Năm Sinh'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'gender',
    headerName: 'Giới Tính'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'bhytYn',
    headerName: 'Có thẻ BHYT hay không'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'bhytId',
    headerName: 'Mã Thẻ BHYT'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'startDate',
    headerName: 'Ngày Bắt Đầu'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'endDate',
    headerName: 'Ngày Hết Hạn'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'noidangky',
    headerName: 'Nơi Đăng Ký Ban Đầu'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'idbandaugg',
    headerName: 'Mã Đăng Ký Ban Đầu'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'timein',
    headerName: 'Thời Gian Nhập Viện'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'timeout',
    headerName: 'Thời Gian Ra Viện'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'ddatenum',
    headerName: 'Số Ngày Điều Trị'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'ddungtuyen',
    headerName: 'Đúng tuyến hay không'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'from',
    headerName: 'Chuyển Đến Từ'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'note',
    headerName: 'Kết Luận Khi Xuất Viện'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'icd',
    headerName: 'Mã Bệnh ICD10'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'idbandau',
    headerName: 'Bệnh Kèm Theo'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'serviceused',
    headerName: 'Các Dịch Vụ Đã Điều Trị'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'dieutri',
    headerName: 'Điều Trị'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'idbandaus',
    headerName: 'Bệnh Kèm Theo'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'serivicedetail',
    headerName: 'Chi Tiết Phí Dịch Vụ'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'unit',
    headerName: 'ĐVT'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'quantity',
    headerName: 'Số Lượng'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'pricae',
    headerName: 'Đơn Giá'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'sumPrice',
    headerName: 'Tổng Chi Phí'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'sumBhytPrice',
    headerName: 'Tổng Bảo Hiểm'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'bhytpayment',
    headerName: 'BH thanh toán'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'patPayment',
    headerName: 'Bệnh Nhân Trả'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'address',
    headerName: 'Địa Chỉ'
  },
  {
    flex: 0.1,
    minWidth: 50,
    maxWidth: 250,
    field: 'chungchi',
    headerName: 'Chứng Chỉ Hành Nghề'
  },
]

