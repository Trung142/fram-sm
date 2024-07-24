import { gql } from '@apollo/client'

export const GET_RES_EXAM = gql`
  query GetResExam($input: ResExamFilterInput, $skip: Int, $take: Int, $order: [ResExamSortInput!]) {
    getResExam(where: $input, skip: $skip, take: $take, order: $order) {
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
        department {
          id
          name
        }
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
        status
        doctor {
          id
          userName
          fristName
          lastName
        }
        prescriptions {
          id
          status
          deleteYn
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
          bhytYn
          createAt
          freeYn
          note
          paymentStatus
          quantity
          resExamId
          serviceId
          status
          price
          totalPrice
          service {
            id
            name
          }
        }
      }
    }
  }
`

export const GET_PAT_GROUP = gql`
  query GetPatGroup {
    getPatGroup {
      items {
        id
        name
      }
    }
  }
`

export const GET_EXPLORE_OBJECT = gql`
  query GetExploreObject {
    getExploreObject {
      items {
        id
        name
      }
    }
  }
`

export const GET_DEPARTMENT = gql`
  query GetDepartment {
    getDepartment {
      items {
        id
        name
      }
    }
  }
`

export const GET_USER = gql`
  query GetUser {
    getUser {
      items {
        id
        userName
        fristName
        lastName
      }
    }
  }
`

export const GET_SERVICE = gql`
  query GetService {
    getService(where: { deleteYn: { neq: true } }) {
      items {
        id
        name
        price
        bhytId
        bhytPrice
        bhytName
        chooseSpecIndex
        clinicId
        cost
        createAt
        createBy
        describe
        gender
        insurancePaymentRate
        serviceGroupId
        serviceTypeId
        status
      }
    }
  }
`

export const GET_SERVICE_GROUP = gql`
  query GetServiceGroup {
    getServiceGroup(where: { deleteYn: { eq: false } }) {
      items {
        id
        name
      }
    }
  }
`

export const GET_SERVICE_TYPE = gql`
  query GetServiceType {
    getServiceType {
      items {
        id
        name
      }
    }
  }
`

export const GET_APPOINT_SCHEDULE = gql`
  query GetAppointSchedule(
    $input: AppointScheduleFilterInput
    $skip: Int
    $take: Int
    $order: [AppointScheduleSortInput!]
  ) {
    getAppointSchedule(where: $input, skip: $skip, take: $take, order: $order) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        patId
        patName
        gender
        dob
        year
        age
        monthsOld
        email
        phone
        appointmentTypeId
        appointmentDate
        doctorId
        presenterId
        receptionistId
        scheduleContent
        reasonExam
        note
        clinicId
        parentClinicId
        status
        createAt
      }
    }
  }
`

export const GET_APPOINTMENT_TYPE = gql`
  query GetAppointmentType {
    getAppointmentType {
      items {
        id
        name
      }
    }
  }
`

export const GET_PATIENT = gql`
  query GetPatient($input: PatientFilterInput, $skip: Int, $take: Int) {
    getPatient(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        name
        phone
        patCccd
        patBhyt
        birthday
        age
        monthsOld
        gender
        status
        address
        patGroupId
        patTypeId
        presenterId
        oldPlaceTreatmentId
        startDate
        endDate
        personalMedHistory
        familyMedHistory
        personalAllergicHistory
        otherDisease
        note
        email
        taxId
        ethnicId
        nationId
        cityId
        districtId
        wardId
        jobId
        workPlace
        famlilyName
        relationshipId
        famlilyPhone
        famlilyCccd
        urlImage
        bhyt1
        bhyt2
        bhyt3
        bhyt4
        bhyt5
        bhyt6
      }
    }
  }
`

export const GET_RELATIONSHIP = gql`
  query GetRelationship {
    getRelationship {
      items {
        id
        name
      }
    }
  }
`

export const GET_OLD_PLACE_TREATMENT = gql`
  query GetOldPlaceTreatment($input: OldPlaceTreatmentFilterInput, $skip: Int, $take: Int) {
    getOldPlaceTreatment(where: $input, skip: $skip, take: $take) {
      items {
        id
        name
      }
    }
  }
`

export const GET_BENEFIT_LEVEL = gql`
  query GetBenefitLevel {
    getBenefitLevel {
      items {
        id
        name
      }
    }
  }
`

export const GET_AREA = gql`
  query GetArea {
    getArea {
      items {
        id
        name
      }
    }
  }
`

export const GET_FROM_INSURANCE = gql`
  query GetFromInsurance {
    getFromInsurance {
      items {
        id
        name
      }
    }
  }
`

export const GET_GLAND_TYPE = gql`
  query GetGlandType {
    getGlandType {
      items {
        id
        name
      }
    }
  }
`

export const GET_RES_EXAM_SERVICE_DT = gql`
  query GetResExamServiceDt($input: ResExamServiceDtFilterInput, $skip: Int, $take: Int) {
    getResExamServiceDt(where: $input, skip: $skip, take: $take) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        resExamId
        serviceId
        paymentStatus
        status
        note
      }
    }
  }
`

export const GET_USER_TOKEN = gql`
  query login {
    login(username: "anhkiet", password: "123") {
      userId
      userName
      token
    }
  }
`
