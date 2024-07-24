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

export const GET_EXPLORE_OBJECT=gql`
query{
    getExploreObject{
      items{
        id
        label: name
      }
    }
  }
`