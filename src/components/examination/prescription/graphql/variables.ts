import { Product } from "src/components/drugstore/order-invoice/graphql/variables"

export type IPrescription = {
  id?: string
  createAt?: string
  resExam?: {
    id?: string
    gender?: number
    year?: number
    age?: number
    monthsOld?: number
    doctor?: {
      id?: string
      fristName?: string
      lastName?: string
    }
    patName?: string
  }
  statusSignOnline?: boolean
  prescriptionDts?: {
    id?: string
    productId?: string
    product?: {
      productName?: string
      prescribingUnit?: {
        name?: string
      }
      price?: number
      vat?: number
    }
    quantity?: number
    dosage?: string
  }
  orders? : {
    id? : string
    orderDts? : {
      product?:Product
      discountAmount? : number
      finalPrice?: number
      quantity? : number
    }
  }
  deleteYn?: boolean
  status?: string
  statusDtqg?: boolean
  paymentStatus?: boolean
}
export type IPrescriptionDts = {
    id?: string
    productId?: string
    product?: {
      productName?: string
      prescribingUnit?: {
        name?: string
      }
      price?: number
    }
    quantity?: number
    dosage?: string
}
