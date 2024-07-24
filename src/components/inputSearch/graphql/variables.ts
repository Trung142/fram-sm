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
}
export type CanSale = {
    totalRemaining: number
    whId: string
    batchId: string
    productId: string
    quantity: number
}

export type ResExamInput = {
    id?: string;
    resExamId?: string;
    patId?: string;
    patName?: string;
    gender?: number;
    dob?: string;
    year?: number;
    age?: number;
    paulse?: number;
    breathingRate?: number;
    temperature?: number;
    bp1?: number;
    bp2?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    body?: string;
    reasonExam?: string;
    personalMedHistory?: string;
    familyMedHistory?: string;
    personalAllergicHistory?: string;
    otherDisease?: string;
    medHistory?: string;
    part?: string;
    diagnosticId?: string;
    address?: string;
    createAt?: string;
    status?: string;
    exploreObjects?: {
        id?: string;
        name?: string
    }
    doctor?: {
        id?: string;
        userName?: string;
        fristName?: string;
        lastName?: string;
    }

    diagnostics?: {
        id?: string;
        idCode1?: string;
        idCode2?: string;
        idCode3?: string;
        idCode4?: string;
        idCode5?: string;
        clsSummary?: string;
        diagnose?: string;
        treatments?: string;
        examResultsId?: string;
        examTypeId?: string;
        advice?: string;
        checkAgainLater?: number;
        dateReExam?: Date;
        diseaseProgression?: string;
    }
    diagnostic?: {
        id?: string;
        idCode1?: string | null;
        idCode2?: string | null;
        idCode3?: string | null;
        idCode4?: string | null;
        idCode5?: string | null;
        clsSummary?: string;
        diagnose?: string;
        treatments?: string;
        examResultsId?: string;
        examTypeId?: string;
        advice?: string;
        checkAgainLater?: number;
        dateReExam?: Date;
        diseaseProgression?: string;

    }
}

export type Icd = {
    id?: string;
    name?: string;
}
export type IBatch = {
    id?: string;
    batch1?: string;
    productId?: string;
    startDate: string
    endDate: string
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
