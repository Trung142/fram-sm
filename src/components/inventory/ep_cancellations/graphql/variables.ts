export type WarehouseExInput = {
  id?: string;
  whPersionId?: string; 
  whId: string; 
  totalVatAmountNumeric: number; 
  totalDiscountNumeric: number; 
  totalAmountNumeric: number;
  finalAmountNumeric: number; 
  clinicId?: string; 
  parentClinicId?: string; 



  
}

/*test*/ 

export type EpFromSupplier = {


  whPersionId?: string
  createAt?: Date
  supplierId?: string;
  paymentTypeId?: string;
  whId?: string;
  totalAmount?: number;
  totalDiscount?: number;
  unitId?: string;
  totalVatAmount?: number;
  finalAmount?: number;
  totalRefund?: number;     
  note?: string

}

export type EpCancel = {


  whPersionId?: string
  createAt?: Date
  supplierId?: string;
  // paymentTypeId?: string;
  whId?: string;
  totalAmount?: number;
  unitId?: string;
  note?: string

}

export type ReturnSupInputDt = {
  id: string;
  whReturnSupId?: string;
  dueDate?: string
  productId?: string;
  productName?: string
  product?: Product;
  batchId?: string;
  quantity?: number;
  unitId?: string;
  vat: number;
  thanhtien: number;
  importPrice?: number;
  price?: number;
  totalVatAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  parentClinicId?: string;
  maximumInventory?: number



}

export type ReturnSupInput = {
  id?: string;
  whPersionId?: string // mã ng nhập kho
  whPersion?: {
    id?: string;
    fristName?: string;
    lastName?: string;
  };

  createAt?: Date
  whId?: string; 
  supplierId?: string; 
  supplier?: {
    id?: string;
    fristName?: string;
    lastName?: string;
  };
  whImportSupId?: string; 
   
  totalVatAmount?: number; 
  totalDiscount?: number; 
  totalAmount?: number; 
  finalAmount?: number; 
  totalRefund?: number; 
  paymentTypeId?: string; 
  clinicId?: string; 
  parentClinicId?: string;
  note?: string;
  status?: string;
  whReturnSupDts?: ReturnSupInputDt[]
}


/* test*/



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
  supplierId?: string; //
  paymentTypeId?: string;
  totalAmount?: number
  unitId?: string
  totalDiscount?: number
  totalVatAmount?: number
  totalRefund?: number
  finalAmount?: number
  note?: string
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
  batchId: string
  batches: Batch[]
  bhytPrict: number
  ingredients: string
  specifications: string
  quantity: number
  thanhtien: number
  maximumInventory: number
  barId: string
  dueDate: string
  cansales: CanSale[]
}
export type Batch = {
  id: string;
  batch1: string;
  startDate: Date;
  endDate: string;
}

export type CanSale = {
  totalRemaining: number
  whId: string
  batchId: string
  productId: string
  quantity: number
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
    batch1: string
  }
  clinicId: string;
  parentClinicId: string;
}