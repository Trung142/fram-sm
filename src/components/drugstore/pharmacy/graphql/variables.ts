

export type IProduct = {
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
  cansales: ICansales[]
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

export type SeleteProduct = {
  id?: string;
  stopYn?: boolean;
  batchYn?: boolean;
  resNumber?: string;
  productName?: string;
  barId?: string;
  unitId?: string;
  price?: number;
  vat?: number;
  bhytId?: string;
  dosage?: string;
  quantity?: number;
  dateNumber?: number;
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
  prescribingUnit?: string;
  instructions?: string;
  note?: string;
  wh: IWH;
  whExistenceDts?: {
    totalSold?: number;
    totalRemaining?: number
    totalVatAmount?: number;
  }
}

export type IPrescriptionDts = {
  id?: string;
  note?: string;
  dosage?: string;
  productId?: string;
  quantity?: number;
  product?: IProduct
}

export type IPatient = {
  id?: string;
  name?: string;
  phone?: string;
  patCccd?: string;
  patBhyt?: string;
  birthday?: string;
  age?: number;
  monthsOld?: number;
  gender?: number;
  status?: boolean;
  address?: string;
  patGroupId?: string;
  patTypeId?: string;
  presenterId?: string;
  oldPlaceTreatmentId?: string;
  startDate?: string;
  endDate?: string;
  personalMedHistory?: string;
  familyMedHistory?: string;
  personalAllergicHistory?: string;
  otherDisease?: string;
  note?: string;
  email?: string;
  taxId?: string;
  ethnicId?: string;
  nationId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  jobId?: string;
  workPlace?: string;
  famlilyName?: string;
  relationshipId?: string;
  famlilyPhone?: string;
  famlilyCccd?: string;
  patImages?: PatImage[];
  urlImage?: string;
  clinicId?: string;
  parentClinicId?: string;
}

export type PatImage = {
  id?: string;
  urlImage?: string;
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
  productId: string;
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