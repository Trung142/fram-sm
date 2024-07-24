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
export type WhTransferInput = {
    createAt: Date
    note: string
    placeReceivingId: string
    placeReleaseId: string
    whReceivingId: string
    whReleaseId: string
    whPersionId: string
    totalAmount: number
    totalQuantity: number
}
export type WhTransferDtInput = {
    batchId: string
    createAt: Date
    dueDate: Date
    product: Product
    transAmount: number
    transQuantity: number
    unitId: string
}