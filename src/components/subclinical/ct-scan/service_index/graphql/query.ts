import { gql } from "@apollo/client";

export const GET_RES_EXAM_SERVICE = gql`
query GetResExamServices($skip: Int, $take: Int) {
  getResExamServiceDt(
    where: { service: { serviceTypeId: { eq: "SRT00003" } } }
    skip: $skip
    take: $take
    order: { createAt: DESC }
  ) {
    items {
      id
      status
      note
      createAt
      resExam {
        id
        stt
        patName
        year
        gender
        age
        status
        doctor{
          id
          fristName
          lastName
        }
      }
      service {
        id
        name
        unit
        status
        serviceTypeId
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
          serviceIndexProcs{
            id
            resultValue
            note
            symptom
            diagnostic
            commen
            createAt
            implementerDoctor{
              id
              fristName
              lastName
            }
            mainDoctor{
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
query ServiceIndexProc(
  $input: ServiceIndexProcFilterInput
  $skip: Int
  $take: Int
) {
  getServiceIndexProc(
    where: $input
    skip: $skip
    take: $take
    order: { id: ASC }
  ) {
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
