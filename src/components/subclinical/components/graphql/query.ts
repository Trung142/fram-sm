import { gql } from '@apollo/client'

export const GET_RES_EXAM_SERVICE_DT = gql`
  query GetResExamServiceDt($skip: Int, $take: Int, $input: ResExamServiceDtFilterInput) {
    getResExamServiceDt(where: $input, skip: $skip, take: $take, order: { createAt: ASC }) {
      totalCount
      items {
        id
        status
        paymentStatus
        note
        createAt
        implementerDoctorId
        implementerDoctor {
          id
          fristName
          lastName
        }
        resExam {
          id
          stt
          patName
          pat {
            birthday
          }
          year
          gender
          age
          status
          doctor {
            id
            fristName
            lastName
          }
        }
        serviceId
        service {
          id
          name
          unit {
            name
          }
          status
          serviceTypeId
          serviceType {
            name
          }
          serviceIndices {
            id
            name
            indexTypeId
            subIndex
            normalIndex
            fatherIndex
            indexTypeId
            defaultValue
            referenceValue
            unit
            testers
            price
            cost
            clinicId
            parentClinicId
            serviceIndexProcs {
              id
              resultValue
              resExamId
              resExam {
                patName
                parentName
                parentPhone
                gender
                monthsOld
                age
              }
              note
              symptom
              diagnostic
              commen
              createAt
              implementerDoctor {
                id
                fristName
                lastName
              }
              mainDoctor {
                id
                fristName
                lastName
              }
            }
          }
        }
      }
    }
  }
`
export const GET_SERVICE_INDEX_PROC = gql`
  query ServiceIndexProc($input: ServiceIndexProcFilterInput, $skip: Int, $take: Int) {
    getServiceIndexProc(where: $input, skip: $skip, take: $take, order: { id: ASC }) {
      items {
        id
        implementerDoctorId
        serviceIndexId
        resultSampleId
        resExamId
        serviceId
        patientId
        resultValue
        note
        symptom
        diagnostic
        commen
        mainDoctorId
        clinicId
        parentClinicId
        deleteYn
      }
    }
  }
`
export const GET_SERVICE_EXAMPLE_VALUE = gql`
query getServiceExampleValue($input: ServiceExampleValueFilterInput) {
  getServiceExampleValue(where: $input) {
    items {
      id
      label: name
      serviceId
      description
      valueExample
    }
  }
}
`