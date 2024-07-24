export type WarehouseExInput = {
  id?: string
  whPersionId?: string // mã ng nhập kho
  whId: string // mã kho
  totalVatAmountNumeric: number // tiền vat
  totalDiscountNumeric: number // tổng giảm giá
  totalAmountNumeric: number // tổng tiền
  finalAmountNumeric: number // tổng thành tiền (total_amount + total_vat_amount - total_discount)
  clinicId?: string // mã phòng khám
  parentClinicId?: string // mã chuỗi cha của phòng khám
}

export type RequestType = {
  fromDate: Date
  toDate: Date
  patTypeId: string | null
  patGroupId: string | null
  keySearch: string
}

export type ProductGroup = {
  productGroupId: string
  products: Product[]
}

export type IProduct = {
  id?: string
  productName?: string
  unitId?: string
  price?: number
  vat?: number
  bhytPrict?: number
  ingredients?: string
  specifications?: string
  maximumInventory?: number
  barId?: string
}

export type IpInventory = {
  whPersionId?: string
  createAt?: Date
  whId?: string
  totalAmount?: number
  totalDiscount?: number
  totalVatAmount?: number
  finalAmount: number
  note?: string
  totalPaid: number
  supplierId?: string
  paymentTypeId?: string
}
export type Product = {
  id: string
  productName: string
  unitId: string
  unit: {
    id: string
    name: string
  }
  price: number
  vat: number
  bhytPrict: number
  ingredients: string
  specifications: string
  quantity: number
  finalAmount: number
  batchId: string
  dueDate: string
  cansales: CanSale[]
  batches: Batch[]
}
export type Batch = {
  id: string
  batch1: string
  startDate: string
  endDate: string
}
export type whImportSup = {
  id: string
  wh: {
    id: string
    name: string
  }
  supplier: {
    name: string
  }
  whPersion: {
    id: string
    fristName: string
    lastName: string
  }
  note: string
  finalAmount: number
  debt: number
  status: string
  whImportSupDts : whImportSupDt[]
}
export type whImportSupDt = {
  id?:string
  unitId?: string
  whImportSupId?: string
  productId: string
  importPrice: number
  finalAmount: number
  quantity: number
  vat: number
  dueDate: string
  batchId: string
  product: Product
}

export type IWhImportSupInput = {
  id?: string
  whId?: string
  whPersionId?: string
  whPersion?: {
    id?: string
    fristName?: string
    lastName?: string
  }
  createAt?: Date
  status?: string
  totalAmount?: number
  totalDiscount?: number
  totalVatAmount?: number
  finalAmount?: number
  note?: string
  totalPaid?: number
  supplierId?: string
  paymentTypeId?: string
}

export type CanSale = {
  totalRemaining: number
  whId: string
  batchId: string
  productId: string
  quantity: number
}
