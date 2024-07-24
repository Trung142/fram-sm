

export type IProduct = {
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
  wh: IWH,
  productId?: string;
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
  cansales: IWH[],
  whImportSupDts: IWH[],

}


export type IPrescriptionDts = {
  id?: string;
  note?: string;
  dosage?: string;
  createAt?: string;
  productId?: string;
  quantity?: number;
  totalPrice?: number;
  product?: IProduct
  statusDtqg?: boolean;
  bhytYn?: boolean;
}

export type IPrescription = {
  id?: string;
  parentClinicId?: string;
  resExamId?: string;
  status?: string;
  bhytYn: boolean;
  resExam?: {
    id?: string;
    patName?: string;
    doctor?: {
      id?: string
      userName?: string
      fristName?: string
      lastName?: string
    }
  };
  createAt?: string;
  statusSignOnline?: boolean;
  prescriptionDts?: IPrescriptionDts[]
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