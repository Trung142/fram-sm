import { gql } from "@apollo/client";

export const GET_RES_EXAM=gql`
query GetResExam($input:ResExamFilterInput, $skip: Int, $take: Int){
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