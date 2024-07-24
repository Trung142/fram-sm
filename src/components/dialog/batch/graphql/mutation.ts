import { gql } from "@apollo/client";


export const ADD_BATCH = gql`
mutation AddBatch($input: BatchInput!){
  addBatch(data: $input){
    id
    startDate
    productId
    endDate
    modifyAt
    parentClinicId
    clinicId
  }
}
`
