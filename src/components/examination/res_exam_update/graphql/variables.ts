export type ResExamInput = {
  id?: string
  resExamId?: string
  patId?: string
  patName?: string
  dob?: string
  year?: number
  age?: number
  gender?: number
  paulse?: number
  breathingRate?: number
  temperature?: number
  bp1?: number
  bp2?: number
  weight?: number
  height?: number
  bmi?: number
  reason_exam?: string
  personalMedHistory?: string
  familyMedHistory?: string
  personalAllergicHistory?: string
  otherDisease?: string
  medHistory?: string
  createAt?: string
  body?: string
  part?: string
  address?: string
  doctor?: {
    id?: string
    userName?: string
    fristName?: string
    lastName?: string
  }
  diagnosticId?: string
  diagnostics?: {
    id?: string
    idCode1?: string
    idCode2?: string
    idCode3?: string
    idCode4?: string
    idCode5?: string
    idCode6?: string
    idCode7?: string
    idCode8?: string
    idCode9?: string
    idCode10?: string
    idCode11?: string
    idCode12?: string
    clsSummary?: string
    diagnose?: string
    treatments?: string
    examResults?: string
    examTypeId?: string
    examResultsId?: string
    advice?: string
    checkAgainLater?: number
    dateReExam?: Date
    diseaseProgression?: string
    resExamId: string
  }
  diagnostic?: {
    id?: string
    idCode1?: string
    idCode2?: string
    idCode3?: string
    idCode4?: string
    idCode5?: string
    idCode6?: string
    idCode7?: string
    idCode8?: string
    idCode9?: string
    idCode10?: string
    idCode11?: string
    idCode12?: string
    clsSummary?: string
    diagnose?: string
    treatments?: string
    examResults?: string
    examTypeId?: string
    examResultsId?: string

    advice?: string
    checkAgainLater?: number
    dateReExam?: Date
    diseaseProgression?: string
    resExamId: string

  }
}



export type Icd = {
  id?: string;
  name?: string;
}

export type ServiceGroup = {
  id?: string;
  name?: string;
  services?: IService[];
}

export type IService = {
  id?: string;
  bhytId?: string;
  bhytName?: string;
  bhytPrice?: number;
  chooseSpecIndex?: boolean;
  bhytYn?: boolean;
  freeYn?: boolean;
  clinicId?: string;
  note?: string;
  createAt?: string;
  createBy?: string;
  insurancePaymentRate?: number;
  name?: string;
  cost?: number;
  serviceGroupId?: string;
  serviceTypeId?: string;
  departmentId?: string;
  resExamDtId?: string;
  quantity?: number;
  price?: number;
  totalPrice?: number;
  describe?: string;
  status?: boolean;
  serviceIndex?: serviceIndex[]
  serviceIndexId?: string;
  resExamId?: string;
  groupSubclinical?: boolean;
  subclinicalId?: string;
  patient_id?: string;
  main_doctor_id?: string;
  diagnostic?: string;
  parentClinicId?: string;
}
export type serviceIndex = {
  id?: string
  serviceId?: string;
  name?: string
  rowIndex?: string
}

export type IResExamServiceDt = {
  id?: string;
  clinicId?: string;
  departmentId?: string;
  note?: string;
  parentClinicId?: string;
  paymentStatus?: boolean;
  quantity?: number;
  resExamId?: string;
  serviceId?: string;
  groupSubclinical?: boolean;
  totalPrice?: number;
  price?: number;
  status?: boolean;
  bhytYn?: boolean;
  freeYn?: boolean;
  deleteYn?: boolean;
  service?: {
    id?: string;
    name?: string;
    bhytPrice?: number;
    price?: number;
    cost?: number;
    describe?: string;
  }

}


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
  bhytYn?: boolean;
  insurancePaymentRate?: number;
  ingredients?: string;
  specifications?: string;
  describe?: string;
  prescribingUnitId?: string;
  manufacturer?: string;
  manufacturerContry?: string;
  minimumInventory?: number;
  maximumInventory?: string;
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
  whExistenceDts?: {
    totalSold?: number;
    totalRemaining?: number
    totalVatAmount?: number;
  }
  whImportSupDts?: {
    totalSold?: number;
    totalRemaining?: number
    totalVatAmount?: number;
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
  totalPrice?: number;
  vat?: number;
  bhytId?: string;
  bhytYn?: boolean;
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
  freeYn?: boolean;
  manufacturer?: string;
  manufacturerContry?: string;
  minimumInventory?: number;
  maximumInventory?: string;
  prescribingUnit?: string;
  instructions?: string;
  note?: string;
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
export type IMedicine = {
  id?: string;
  parentClinicId?: string;
  resExamId?: string;
  status?: boolean;
  statusSignOnline?: boolean;
  prescriptionDts?: IPrescriptionDts[]
}

export type CanSale = {
  totalRemaining: number
}