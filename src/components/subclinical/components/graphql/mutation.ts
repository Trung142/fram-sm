import { gql } from "@apollo/client";

export const UPDATE_RES_EXAM_SERVICE_DT =gql`
mutation updateResExamServiceDt($input: String!) {
  updateResExamServiceDt(data: $input) {
    id
    implementerDoctorId
    note
    createAt
    status
  }
}
`
export const ADD_SERVICE_INDEX_PROC = gql`
mutation addServiceIndexProc($input: ServiceIndexProcInput) {
  addServiceIndexProc(data: $input) {
    id
    implementerDoctorId
    mainDoctorId
    commen
    clinicId
    parentClinicId
    resExamServiceDtId
    diagnostic
  }
}
`
export const UPDATE_SERVICE_INDEX_PROC = gql`
mutation updateServiceIndexProc($input: String!) {
  updateServiceIndexProc(data: $input) {
    id
    implementerDoctorId
    mainDoctorId
    commen
    clinicId
    parentClinicId
    resExamServiceDtId
    diagnostic
  }
}
`