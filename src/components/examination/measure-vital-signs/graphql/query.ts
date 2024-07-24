import { gql } from '@apollo/client'

export const GET_RES_EXAM = gql`
  query GetResExam($input: ResExamFilterInput, $skip: Int, $take: Int) {
    getResExam(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        stt
        status
        patId
        patName
        year
        age
        gender
        phone
        address
        appointScheduleId
        areaId
        benefitLevelId
        bmi
        body
        bp1
        bp2
        personalMedHistory
        breathingRate
        paulse
        personalAllergicHistory
        clinicId
        createAt
        createBy
        dateOfConception
        deleteYn
        departmentId
        diagnosticId
        dob
        doctorId
        exploreObjectsId
        familyMedHistory
        fiveYearFullDate
        fristDayOfLastPeriod
        fromInsuranceId
        glandTypeId
        height
        medHistory
        modifyAt
        modifyBy
        monthsOld
        oldPlaceTreatmentId
        otherDisease
        parentClinicId
        endDate
        parentName
        patBhyt
        patCccd
        patGroupId
        part
        patId
        parentPhone
        presenterId
        startDate
        swElseComeId
        stt
        relationshipId
        temperature
        status
        weight
        reasonExam
        doctor {
          id
          userName
          fristName
          lastName
        }
        prescriptions {
          id
          status
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
          service {
            id
            name
          }
        }
      }
    }
  }
`
