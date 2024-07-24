import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
  query GetProduct($input: ProductFilterInput, $skip: Int, $take: Int) {
    getProduct(where: $input, skip: $skip, take: $take) {
      totalCount
      pageInfo{
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        productName
        unitId
        barId
        ingredients
        specifications
        price
        vat
        bhytPrict
        manufacturer
        manufacturerContry
        minimumInventory
        maximumInventory
        prescribingUnit{
          id
          name
        }
        instructions {
          id
          name
          note
        }
        cansales {
          id
          totalRemaining
          quantity
          batchId
          whId
        }
      }
    }
  }
`

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

export const GET_SERVICE = gql`
  query GetService($input: ServiceFilterInput, $skip: Int, $take: Int) {
    getService(
      where: $input
      skip: $skip
      take: $take
      order: {createAt: DESC}
    ){
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
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
export const GET_BATCH = gql`
  query GetBatch($input: BatchFilterInput, $skip: Int, $take: Int){
    getBatch(where: $input, skip: $skip, take: $take) {
      totalCount
      pageInfo{
        hasNextPage
        hasPreviousPage
      }
        items{
            id
            startDate
            endDate
            batch1
            productId
            modifyAt
            parentClinicId
            clinicId
        }
    }
}
`