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
  cansales: CanSale[]
  batches: Batch[]
}
export type Batch = {
  id: string
  startDate: Date
  endDate: Date
  batch1: string
}
export type CanSale = {
  totalRemaining: number
  whId: string
  batchId: string
  productId: string
  quantity: number
}
export type WhCheckInvDt = {
  id:string
  unitId:string
  whCheckInvId:string
  amountDifference: number
  dueDate: Date
  batchId:string
  qtyExistBeforeCheck: number
  qtyExistAfterCheck: number
  product: Product
}
export type whChechInvInput = {
  id?: string
  createAt?: Date
  clinicId?: string
  parentClinicId?: string
  totalDifference?: number
  status?: string
  note?:string
  whPersionId?: string
  whPersion?: {
    id?: string
    fristName?: string
    lastName?:string
    clinicId?:string
    parentClinicId?:string
  }
  whReleaseId?: string
  whRelease?: {
    id?:string
    name?: string
    clinicId?:string
    parentClinicId?:string
  }

}