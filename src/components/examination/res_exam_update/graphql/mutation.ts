import { gql } from "@apollo/client";

export const UPDATE_RES_EXAM = gql`
mutation UpdateResExam($input: String!) {
  updateResExam(data: $input) {
   id
  }
}`;


export const ADD_DIAGNOSTICS = gql`
mutation AddDiagnostic($input: DiagnosticInput!){
  addDiagnostic(data: $input){
    id
    idCode1
    idCode2
    idCode3
    idCode4
    idCode5
    idCode6
    idCode7
    idCode8
    idCode9
    idCode10
    idCode11
    idCode12
    examResultsId
  }
}
`
export const UPDATE_DIAGNOSTICS = gql`
mutation UpdateDiagnostic($input: String!){
  updateDiagnostic(data: $input){
    id
    idCode1
    idCode2
    idCode3
    idCode4
    idCode5
    idCode6
    idCode7
    idCode8
    idCode9
    idCode10
    idCode11
    idCode12
    treatments
    examResultsId
  }
}
`
export const ADD_SERVICE_DT = gql`
mutation AddResExamServiceDt($input: ResExamServiceDtInput!) {
  addResExamServiceDt(data: $input) {
    id
    resExamId
    serviceId
    note
    status
    price
    bhytYn
    quantity
    freeYn
    resExam{
      patId
      doctorId
    }
    departmentId
    totalPrice
    serviceId
    service {
      id
      name
      bhytPrice
      price
      cost
      describe
      serviceIndices {
        id
        rowIndex
      }
    }
  }
}

`
export const ADD_SERVICE_DT_ARR = gql`
mutation AddManyResExamServiceDt($input: String!){
  addManyResExamServiceDt(data: $input){
    id
    resExamId
    serviceId
    note
    status
    price
    bhytYn
    quantity
    freeYn
    departmentId
    totalPrice
    service{
      id
      name
      bhytPrice
      price
      cost
      describe
    }
  }
}
`

export const UPDATE_SERVICE_DT_ARR = gql`
mutation UpdateManyResExamServiceDt($input: String!){
  updateManyResExamServiceDt(data: $input){
    id
    resExamId
    serviceId
    note
    status
    price
    bhytYn
    quantity
    freeYn
    departmentId
    totalPrice
   
  }
}
`

export const UPDATE_SERVICE_DT = gql`
mutation UpdateResExamServiceDt($input: String!){
  updateResExamServiceDt(data: $input){
    id
    resExamId
    serviceId
    note
    status
    price
    bhytYn
    quantity
    freeYn
    departmentId
    totalPrice
   
  }
}
`


export const ADD_PRECRIPTION = gql`
mutation AddPrescription($input: PrescriptionInput!){
  addPrescription(data: $input){
    id
    resExamId
    status
    statusSignOnline
  }
}
`

export const ADD_PRECRIPTION_DT = gql`
mutation AddManyPrescriptionDt($input: String!){
  addManyPrescriptionDt(data: $input){
    id
    dosage
    unit{
      id
      name
    }
    productId
    prescriptionId
    totalDay
    quantity
    note
  }
}
`
export const UPDATE_PRECRIPTION_DT = gql`
mutation UpdatePrescriptionDt($input: String!){
  updatePrescriptionDt(data: $input){
    id
    dosage
    unit{
      id
      name
    }
    productId
    prescriptionId
    totalDay
    quantity
    note
    bhytYn
  }
}
`

export const ADD_MANY_SERVICE_INDEX_Proc = gql`
mutation AddManyServiceIndexProc($input: String!){
  addManyServiceIndexProc(data: $input){
    id
    serviceId
    serviceIndexId
    mainDoctorId
    diagnostic
    resExamId
    patientId
    clinicId
    parentClinicId
    rowIndex
    resExamServiceDtId
    boldYn
    subclinicalId 
  }
}
`

export const ADD_SERVICE_INDEX_Proc = gql`
mutation AddServiceIndexProc($input: String!){
  addServiceIndexProc(data: $input){
    id
    serviceId
    serviceIndexId
    mainDoctorId
    diagnostic
    resExamId
    patientId
    clinicId
    parentClinicId
    rowIndex
    resExamServiceDtId
    boldYn
    subclinicalId 
  }
}
`

export const UPDATE_SERVICE_INDEX_Proc = gql`
mutation UpdateServiceIndexProc($input: String!){
  updateServiceIndexProc(data: $input){
    id
    serviceId
    serviceIndexId
    mainDoctorId
    diagnostic
    resExamId
    deleteYn
    patientId
    clinicId
    parentClinicId
    rowIndex
  }
}
`
export const ADD_ORDER = gql`
mutation AddOrder($input:OrderInput!){
  addOrder(data: $input){
    id
    status
    prescriptionId
    resExamId
  }
}
`