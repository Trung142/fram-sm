import { id } from 'date-fns/locale'

export type ProductInput = {
  barId?: string
  batchYn?: boolean
  bhytId?: string
  bhytName?: string
  bhytPrict?: number
  clinicId?: string
  commoditiesId?: string
  commodityGroupId?: string
  connectDqg?: boolean
  deleteYn?: boolean
  describe?: string
  id?: string
  ingredients?: string
  instructions?: string
  instructionsId?: string
  insurancePaymentRate: number
  manufacturer?: string
  manufacturerContry?: string
  maximumInventory?: number
  minimumInventory?: number
  modifyAt?: Date
  modifyBy?: string
  parentClinicId?: string
  prescribingUnitId?: string
  prescriptionDts?: string
  price?: number
  productName?: string
  resNumber?: string
  specifications?: string
  stopYn?: boolean
  unitId?: string
  vat?: number
  bhytYn?: boolean
  // commodityGroup?: {
  //   id: string
  //   name: string
  // }
  // unit?: {
  //   id: string
  //   name: string
  // }
}

export type ProductGroupInput = {
  id?: string
  name?: string
  note?: string
  clinicId?: string
  parentClinicId?: string
  clinic?: string
  createBy?: string
  deleteYn?: boolean
  parentClinic?: string
  modifyBy: string
  modifyAt?: Date
}

export type UnitInput = {
  barid?: string
  clinicId?: string
  createAt?: Date
  createBy?: string
  deleteYn?: boolean
  exchange?: number
  id?: string
  modifyAt?: Date
  modifyBy?: string
  parentClinicId?: string
  price?: number
  productId?: string
  unitExchangeId: string
  product?: string
  unitExchange?: string
}
