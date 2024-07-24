export type ServiceInput = {
  id?: string
  name?: string
  serviceTypeId?: string
  serviceGroupId?: string
  gender?: number
  serviceType?: {
    id?: string
    label?: string
  }
  serviceGroup?: {
    id?: string
    label?: string
  }
  status?: boolean
  unit?: string
  agreeLis?: boolean
  cost?: number
  price?: number
  bhytId?: string
  bhytName?: string
  insurancePaymentRate?: number
  bhytPrice?: number
  surchargePrice?: number
  describe?: string
  chooseSpecIndex?: boolean
  clinicId?: string
  parentClinicId?: string
  deleteYn?: boolean
  groupSubclinical?:boolean
  departmentId?:string
}

export type ServiceIndexInput = {
  id?: string
  name?: string
  serviceId?:string
  normalIndex?: boolean | null
  fatherIndex?: boolean| null
  subIndex?: boolean| null
  indexTypeId?: string
  referenceValue?: string
  defaultValue?: string
  price?: number
  cost?: number
  unit?: string
  testers?: string 
  clinicId?: string
  parentClinicId?: string | null
  deleteYn?: boolean
  indexType?:{
    name?:string
  }
}
export type ServiceUpdate = {
  id?: string
  name?: string
  serviceTypeId?: string
  serviceGroupId?: string
  gender?: number
  status?: boolean
  unitId?: string
  agreeLis?: boolean
  argeeBhyt?: boolean
  cost?: number
  price?: number
  bhytId?: string
  bhytName?: string
  insurancePaymentRate?: number
  bhytPrice?: number
  surchargePrice?: number
  describe?: string
  chooseSpecIndex?: boolean
  clinicId?: string
  parentClinicId?: string
  deleteYn?: boolean
  groupSubclinical?:boolean
  departmentId?:string
}

export type IndexProp={
  id?: string
  serviceId?: string
  serviceIndexId?: string
  clinicId?: string
  parentClinicId?: string
  deleteYn?: boolean
}

export type ConSumUpdate={
  id?:string
  unit?:string
  quantity?:number
  clinicId?: string
  parentClinicId?: string
  deleteYn?: boolean
}

export type CanSale ={
  totalRemaining:number
}

export type ServiceExampleValue={
  id?:string,
  name?:string,
  clinicId:string,
  parentClinicId:string,
  deleteYn?:boolean,
  description?:string
  valueExample?:string
}