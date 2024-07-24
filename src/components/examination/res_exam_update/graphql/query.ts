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
      createAt
      breathingRate
      temperature
      bp1
      bp2
      reasonExam
      part
      address
      personalMedHistory
      familyMedHistory
      personalAllergicHistory
      otherDisease
      medHistory
      breathingRate
      bmi
      diagnosticId

      bp1
      body
      diagnostic{
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
          groupSubclinical
        }
      }
    }
  }
}
`;


export const GET_ICD = gql`
query GetIcd($input: IcdFilterInput, $skip: Int, $take: Int) {
  getIcd(
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
    items {
      id
      name
    }
  }
}
`;

export const GET_PRODUCTS = gql`
query GetProducts($input: ProductFilterInput, $skip: Int, $take: Int) {
  getProduct(
    where: $input
    skip: $skip
    take: $take
    order: {id: ASC}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
        id
        stopYn
        batchYn
        resNumber
        productName
        barId
        unitId
        price
        vat
        bhytId
        bhytName
        bhytPrict
        insurancePaymentRate
        ingredients
        specifications
        describe
        prescribingUnit{
          id
          name
      }
        prescribingUnitId
        instructions {
            id
            name
            note
        }
        manufacturer
        manufacturerContry
        minimumInventory
        maximumInventory
        commodities {
            id
            name
            note
        }
        commodityGroup {
            id
            name
            note
        }
    }
  }
}
`;

export const GET_EXAM_RESULT = gql`
query {
  getExamResult {
    items {
      id
      name
    }
  }
}
`;

export const GET_EXAM_TYPE = gql`
query {
  getExaminationType (order: {id: ASC}) {
    items {
      id
      name
    }
  }
}
`;

export const GET_SERVICE_GROUP = gql`
query {
  getServiceGroup (order: {id: ASC}) {
    items {
      id
      name
      services {
        id
        name
        bhytPrice
        insurancePaymentRate
        unit
        cost
        price
        describe
        status
        note
        deleteYn
      }
    }
  }
}
`;

export const GET_SERVICE = gql`
  query GetService {
    getService(where: {deleteYn: {neq: true}},order: {id: DESC}){
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
        groupSubclinical
      }
    }
  }
`;

export const GET_DEPARTMENT = gql`
  query GetDepartment {
    getDepartment {
      items {
        id
        name
      }
    }
  }
`;

export const GET_RES_EXAM_SERVICEDT = gql`
  query GetResExamServiceDt($input: ResExamServiceDtFilterInput) {
    getResExamServiceDt(where: $input, order: {id: DESC}){
      totalCount    
      items {
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
        deleteYn
        service{
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
          groupSubclinical
          serviceIndices {
            id
            rowIndex
          }
        }
      }
    }
  }
`;

export const GET_SUBCLINICALID = gql`
query{
  getGetSubclinicalId{
    items{
      id
    }
  }
}
`

export const GET_PRECRIPTION = gql`
query GetPrescription($input: PrescriptionFilterInput){
  getPrescription(where: $input, order: {id: DESC}){
    items{
      id
      parentClinicId
      resExamId
      status
      statusSignOnline
      bhytYn
      deleteYn
      prescriptionDts{
        id
        bhytYn
        quantity
        productId
        note
        dosage
        deleteYn
        totalPrice
        product{
           id
          stopYn
          batchYn
          resNumber
          productName
          barId
          unitId
          price
          vat
          bhytId
          bhytName
          bhytPrict
          insurancePaymentRate
          ingredients
          specifications
          describe
          prescribingUnit{
            id
            name
            note
          }
          prescribingUnitId
          instructions {
              id
              name
              note
          }
          manufacturer
          manufacturerContry
          minimumInventory
          maximumInventory
          commodities {
              id
              name
              note
          }
          commodityGroup {
              id
              name
              note
          }
          
        }
      }
   }
  }
}
`

export const GET_PRECRIPTION_DT = gql`
query GetPrescriptionDT($input: PrescriptionDtFilterInput ){
  getPrescriptionDt(where: $input, order: {id: DESC}){
    items{
      id
      dosage

      unit{
        id
        name
      }
      product{
        id
        price
        productName
        bhytYn
        prescribingUnit{
          id
          name
        }
      }
      productId
      prescriptionId
      totalDay
      quantity
      note
      statusDtqg
   }
  }
}
`


export const GET_SERVICE_INDEX = gql`
  query GetServiceIndex($input: ServiceIndexFilterInput, $skip: Int, $take: Int) {
    getServiceIndex(  
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
    ){
      items {
        id
        rowIndex
        clinicId
        parentClinicId
        deleteYn
        serviceId
      }
    }
  }
`;

export const GET_SERVICE_INDEX_PROC = gql`
  query GetServiceIndexProc($input: ServiceIndexProcFilterInput, $skip: Int, $take: Int) {
    getServiceIndexProc(
      where: $input
      skip: $skip
      take: $take
      order: {createAt: DESC}
    ){
      items {
        id
        rowIndex
        resExamId
        deleteYn
        serviceId
        service{
            id
            name
        }
        rowIndex
      }
    }
  }
`;