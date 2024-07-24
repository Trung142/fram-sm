import { gql } from "@apollo/client";

export const GET_PRESCRIPTION = gql`
query GetPrescription($input: PrescriptionFilterInput, $skip: Int, $take: Int) {
    getPrescription(
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
        parentClinicId
        resExamId
        status
        statusSignOnline
        status
        paymentStatus
        bhytYn
        resExam{
          id
          patName
          patId
          phone
          patCccd
          doctor {
            id
            userName
            fristName
            lastName
          }
        }
        createAt
        prescriptionDts{
          id
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
            cansales{
              id
              totalRemaining
              quantity
              batchId
              createAt
              batch{
                id
                startDate
                endDate
              }
            }
           
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
`;


export const GET_PATEINT = gql`
query GetPatient($input: PatientFilterInput, $skip: Int, $take: Int) {
  getPatient(
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
    }
  }
}
`;

export const GET_CANSALES = gql`
query GetCansale($input: CansaleFilterInput, ) {
  getCansale(
    where: $input
    skip: 0
    take: 100
    order: {createAt: ASC}
  ){
    totalCount
      items{
        id
        batchId
        quantity
        createAt
        whId
        productId
        product{
          productName
        }
        wh{
          id
          name
        }
        batch{
          id
          startDate
          endDate
        }
        totalRemaining
        clinicId
        parentClinicId
      }
  }
}
`