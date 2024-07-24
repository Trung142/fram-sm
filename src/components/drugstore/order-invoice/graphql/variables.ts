export type Order = {
  id?: string
  createAt?: Date
  totalDiscount?: number
  finalPrice?: number
  totalVat?: number
  bhytAmount?: number
  status?: string
  paymentStatus?: boolean
  totalPrice?: number
  note?: string
  paymentType?: PaymentType
  payments? : {
    actuallyReceivedAmount?: number
    debtAmount?: number
  }
  pat?: {
    id?: string
    name?:string
  }
  resExam?: {
    id?: string
    patName?:string
    benefitLevel?: {
        id?: string
        name?:string
    }
  }
  pharmacyManager?: {
    id?: string
    userName?:string
    lastName?:string
    fristName?:string
  }
  prescription? : {
    id?:string
  }
  orderDts?: OrderDt[]
}
export type PaymentType = {
    id:string
    name:string
}
export type OrderDt = {
    id?:string
    vat?: number
    finalPrice?: number
    discountAmount?: number
    quantity?: number
    bhytAmount?: number
    totalAmount?: number
    unit?: {
        name?:string
    }
    batchId?: string
    batch? : {
        id?:string
        startDate?: Date
        endDate?: Date
    }
    product?:Product
}

export type Product = {
    id?:string
    productName?:string
    createAt?: Date
    price?:number
    bhytPrict?:number
    prescribingUnit? : {
        name?:string
    }
}
