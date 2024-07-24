import { gql } from '@apollo/client'

export const GET_SUPPLIER = gql`
query getSupplier($input:SupplierFilterInput, $skip: Int, $take: Int) {
  getSupplier(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ){
    items {
      createAt
      id
      name
      whImportSups {
        finalAmount
        totalPaid
        debt
        whImportSupDts {
          quantity
        }
      }
      whReturnSups {
        finalAmount
        whReturnSupDts {
          quantity
        }
      }
    }
  }
}
`
export const GET_WH_IMPORT_SUP_DT = gql`
query getWhImportSupDt($input: WhImportSupDtFilterInput, $skip: Int, $take: Int) {
  getWhImportSupDt(where: $input, skip: $skip, take: $take, order: {createAt: DESC}) {
    items {
      whImportSup {
        supplier {
          name
        }
      }
      product {
        id
        productName
      }
      batchId
      dueDate
      unit {
        name
      }
      
    }
  }
}
`
