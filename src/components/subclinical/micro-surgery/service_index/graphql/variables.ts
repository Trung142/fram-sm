export type ResExamServiceDtInput = {
  id?: string
  status?: boolean
  note?: string
  createAt?: Date
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
    serviceIndices?: {
      id?: string
      name?: string
      indexTypeId?: string
      subIndex?: boolean
      normalIndex?: boolean
      fatherIndex?: boolean
      defaultValue?: string
      referenceValue?: string
      unit?: string
      testers?: string
      price?: number
      cost?: number
      clinicId?: string
      parentClinicId?: string
      createAt?: string
      serviceIndexProcs?: {
        id?: string
        resultValue?: string
        note?: string
        symptom?: string
        diagnostic?: string
        commen?: string
        createAt?: Date
        implementerDoctor?: {
          id?: string
          fristName?: string
          lastName?: string
        }
        mainDoctor?: {
          id?: string
          fristName?: string
          lastName?: string
        }
      }
    }
  }
}

export type ServiceIndexProcInput = {
  id?: string
  implementerDoctorId?: string
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
  mainDoctorId?: string
  clinicId?: string
  parentClinicId?: string
  createAt?: Date
  deleteYn?: Date
}
