import { gql } from "@apollo/client";

export const GET_WAREHOUSE=gql`
query{
  getWarehouse(where: {deleteYn:{eq:false}}){
      items{
          id
          name
      }
  }
}
`

export const GET_WH_CANCEL=gql`
query GetWhExpCancel($input:WhExpCancelFilterInput, $skip: Int, $take: Int){
  getWhExpCancel(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ){
      items{
          whId
          whExpCancelDts{
              quantity
              totalCancelPrice
              batchId
              unit{
                  id
                  name
              }
              product{
                  id
                  productName
              }
          }
      }
  }
}
`