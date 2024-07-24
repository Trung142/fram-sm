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

export const GET_SERVICE_BY_DOCTOR=gql`
query GetServiceDoctor($input:ServiceIndexProcFilterInput, $skip: Int, $take: Int){
  getServiceIndexProc(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ){
      items{
          id
          service{
              name
              price
          }
          mainDoctor{
              id
              fristName
              lastName
          }
      }
  }
}
`
export const GET_SERVICE_TYPE=gql`
query{
  getServiceType(where:{deleteYn:{eq:false}}){
    items{
      id
      label:name
    }
  }
}
`

export const GET_SERVICE_GROUP=gql`
query{
  getServiceGroup(where:{deleteYn:{eq:false}}){
    items{
      id
      label:name
    }
  }
}
`