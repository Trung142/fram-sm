import { gql } from '@apollo/client'

export const GET_RES_EXAM_SERVICE = gql`
  query GetResExamServices($input: ResExamServiceDtFilterInput, $skip: Int, $take: Int) {
    getResExamServiceDt(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
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
          doctor {
            id
            fristName
            lastName
          }
        }
        statusNavigation {
          id
          name
        }
        service {
          id
          name
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
            serviceIndexProcs {
              id
              resultValue
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
