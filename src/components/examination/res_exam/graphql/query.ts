import { gql } from "@apollo/client";

export const GET_RES_EXAM = gql`
query GetResExam($input: ResExamFilterInput, $skip: Int, $take: Int) {
  getResExam(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items{
      id
      stt
      status
      patId
      patName
      dob
      year
      age
      gender
      phone
      weight
      height
      paulse
      breathingRate
      temperature
      bp1
      bp2
      part
      address
      personalMedHistory
      familyMedHistory
      personalAllergicHistory
      otherDisease
      medHistory
      breathingRate
      bmi
      body
      createAt
      diagnosticId
      bp1
      statusNavigation{
          id
          name
      }
      diagnostic{
        id
        idCode1
        idCode2
        idCode3
        idCode4
        idCode5
        diagnose
        clsSummary
        treatments
        advice
        checkAgainLater
        dateReExam
        diseaseProgression
        examTypeId
        examResultsId
        dateReExam
        checkAgainLater
        clsSummary
        resExamId
      }
      diagnostics {
        id
        idCode1
        clsSummary
        diseaseProgression
        examTypeId
        examResultsId
        examResults {
          id
          name
        }
        dateReExam
        checkAgainLater
        resExamId
      }
      doctor {
        id
        userName
        fristName
        lastName
      }
      exploreObjects{
        id
        name
      }
      prescriptions {
        id
        status
        statusNavigation{
          id
          name
        }
        orders {
          id
          note
        }
        prescriptionDts {
          id
          note
        }
      }
      resExamServiceDts {
        id
        paymentStatus
        status
        statusNavigation{
          id
          name
        }
        service {
          id
          name
        }
      }
    }  }
}
`;
