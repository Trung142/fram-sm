export type WarehouseExInput = {
  id?: string;
  whPersionId?: string; // mã ng nhập kho
  whId: string; // mã kho
  totalVatAmountNumeric: number; // tiền vat
  totalDiscountNumeric: number; // tổng giảm giá
  totalAmountNumeric: number;// tổng tiền
  finalAmountNumeric: number; // tổng thành tiền (total_amount + total_vat_amount - total_discount)
  clinicId?: string; // mã phòng khám
  parentClinicId?: string; // mã chuỗi cha của phòng khám
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
  unitId?: string
  totalDiscount?: number
  totalVatAmount?: number
  finalAmount?: number
  note?: string
  paymentType?: string
}
export type Product = {
  id: string
  productName: string
  unitId: string
  unit: {
    id: string;
    name: string;
  }
  price: number
  vat: number
  bhytPrict: number
  ingredients: string
  specifications: string
  quantity: number
  thanhtien: number
  maximumInventory: number
  batchId: string
  cansales: any
}
export type IProducts = {
  id?: string;
  stopYn?: boolean;
  batchYn?: boolean;
  resNumber?: string;
  productName?: string;
  unitId?: string;
  price?: number;
  vat?: number;
  bhytId?: string;
  bhytName?: string;
  bhytPrict?: number;
  insurancePaymentRate?: number;
  ingredients?: string;
  specifications?: string;
  describe?: string;
  prescribingUnitId?: string;
  manufacturer?: string;
  manufacturerContry?: string;
  minimumInventory?: number;
  maximumInventory?: number;
  quantity?: number;
  totalPrice?: number;
  ck?: number;
  wareHouse: string;
  batchId: string;
  wh: IWH;
  productId?: string;
  cansales?: ICansales[]
  whExistenceDts: IWH[];
  whImportSupDts: IWH[];
  prescribingUnit?: {
    id?: string;
    name?: string;
    note?: string;
  };
  commodities?: {
    id?: string;
    name?: string;
    note?: string;
  }
  instructions?: {
    id?: string;
    name?: string;
    note?: string;
  }

}

export type whExistenceDt = {
  id: string;
  unitId?: string;
  whExistenceId?: string;
  importPrice?: number;
  price?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  totalRemaining?: number;
  productId?: string;
  parentClinicId?: string;
  quantity?: number;
  vat: number;
  maximumInventory?: number
  totalVatAmount?: number;
  productName?: string
  thanhtien: number
  batchId: string;
  product?: Product;
  products?: IProducts;
}

export type IWhExistenceInput = {
  id?: string;
  whId?: string;
  whPersionId?: string;
  whPersion?: {
    id?: string;
    fristName?: string;
    lastName?: string;
  };
  createAt?: string;
  status?: string;
  totalAmount?: number;
  totalDiscount?: number;
  totalVatAmount?: number;
  finalAmount?: number;
  note?: string;
  whExistenceDts?: whExistenceDt[]
}

export type ICanSale = {
  id: string
  totalRemaining: number
  quantity: number
  productId: string
  batchId: string
  createAt: string
  whId: string;
  wh: {
    id: string
    name: string
  }
  batch: {
    id: string
    startDate: string
    endDate: string
  }
  clinicId: string;
  parentClinicId: string;
}

export type IWH = {
  id: string
  totalRemaining: number
  quantity: number
  batchId: string
  createAt: string
  batch: {
    id: string
    startDate: string
    endDate: string
  }
}

export type ICansales = {
  id: string
  totalRemaining: number
  quantity: number
  batchId: string
  createAt: string
  whId: string;
  wh: {
    id: string
    name: string
  }
  batch: {
    id: string
    startDate: string
    endDate: string
  }
  clinicId: string;
  parentClinicId: string;
}