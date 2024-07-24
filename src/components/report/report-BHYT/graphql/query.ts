import { gql } from "@apollo/client";

export const GET_RES_EXAM=gql`
query GetPatient($input:ResExamFilterInput, $skip: Int, $take: Int){
    getResExam(
      where: $input
      skip: $skip
      take: $take
      order: {createAt: DESC}
    ){
      items{
        createAt
        id
        resExamServiceDts{
          id
          totalPrice
        }
        prescriptions{
          prescriptionDts{
            quantity
            totalPrice
          }
        }
      }
    }
  }   
`

export const GET_PATIENT=gql`
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
      createAt
      id
      name
      phone
      patCccd
      patBhyt
      birthday
      famlilyName
      address
      age
      monthsOld
      gender
      status
      startDate
            endDate
            patType{
                id
                name
            }
            patGroup{
                id
                name
            }
            reasonExam
    }
  }
}
`

export const GET_PRODUCT=gql`
query GetProduct($input:ProductFilterInput,$skip:Int,$take:Int){
  getProduct(
    where: $input,
    skip: $skip,
    take: $take
  ){
    totalCount,
    items{
      id
      bhytId
      productName
      bhytPrict
      bhytName
      price
      ingredients
      resNumber
      cansales{
        id
        totalRemaining
      }
      unit{
        name
      }
      instructions{
        name
      }
    }
  }
}
`