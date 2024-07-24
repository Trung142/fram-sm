export type ResExamServiceDtInput = {
  id?: string
  status?: boolean
  note?: string
  createAt?: Date
  serviceId?: string
  resExam?: {
    id?: string
    stt?: number
    status?: string
    patName?: string
    year?: string
    gender?: string
    age?: string
  }
  service?: {
    id?: string
    name?: string
    unit?: string
    status?: string
    serviceTypeId?: string
    serviceIndices?: ServiceIndices[]
  }
}
export type Service = {
  id?: string
  name?: string
  unit?: string
  status?: string
  serviceTypeId?: string
  serviceIndices?: {
    id: string
    name: string
    indexTypeId: string
    subIndex?: string | null
    normalIndex?: string | null
    fatherIndex?: string | null
    defaultValue?: string | null
    referenceValue?: string | null
    unit: string
    testers?: string[] | null
    price?: number | null
    cost?: number | null
    clinicId?: string | null
    parentClinicId?: string | null
    serviceIndexProcs?: {
      id?: string
      implementerDoctor?: {
        id: string
        fristName: string
        lastName: string
      }
      mainDoctor?: {
        id: string
        fristName: string
        lastName: string
      }
      serviceIndexId?: string
      resultSampleId?: string
      resExamId?: string
      serviceId?: string
      patientId?: string
      resultValue?: string
      note?: string
      symptom?: string
      diagnostic?: string
      commen?: string
      clinicId?: string
      parentClinicId?: string
      createAt?: Date
      deleteYn?: Date
    }
  }
}

export type ServiceIndices = {
  id?: string
  name?: string
  indexTypeId: string
  subIndex?: string | null
  normalIndex?: string | null
  fatherIndex?: string | null
  defaultValue?: string | null
  referenceValue?: string | null
  unit?: string
  testers?: string | null
  price?: number | null
  cost?: number | null
  serviceIndexProcs?: {
    id?: string
    note?: string
    implementerDoctor?: {
      id?: string
      fristName?: string
      lastName?: string
    }
    mainDoctor?: {
      id: string
      fristName: string
      lastName: string
    }
  }
}
export type ServiceIndex = {
  id?: string
  name?: string
  indexTypeId: string
  subIndex?: string | null
  normalIndex?: string | null
  fatherIndex?: string | null
  defaultValue?: string | null
  referenceValue?: string | null
  unit?: string
  testers?: string | null
  price?: number | null
  cost?: number | null
}
export type ServiceIndexProcs = {
  id?: string
  implementerDoctor?: {
    id: string
    fristName: string
    lastName: string
  }
  mainDoctor?: {
    id: string
    fristName: string
    lastName: string
  }
  serviceIndex?: ServiceIndex
  serviceIndexId?: string
  resultSampleId?: string
  resExamId?: string
  serviceId?: string
  patientId?: string
  resultValue?: string
  note?: string
  symptom?: string
  diagnostic?: string
  commen?: string
  clinicId?: string
  parentClinicId?: string
  createAt?: Date
  deleteYn?: Date
}
