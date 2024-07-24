import { gql } from '@apollo/client'

export const ADD_BATCH = gql`
  mutation AddBatch($input: BatchInput!) {
    addBatch(data: $input) {
      id
      startDate
      endDate
      modifyAt
      parentClinicId
      clinicId
    }
  }
`
export const ADD_WH_IMPORT_SUP = gql`
  mutation addWhImportSup($input: WhImportSupInput!) {
    addWhImportSup(data: $input) {
      id
      whId
      whPersionId
      createAt
      totalAmount
      totalDiscount
      totalVatAmount
      finalAmount
      note
    }
  }
`
export const ADD_MANY_WH_IMPORT_SUP_DT = gql`
  mutation addManyWhImportSupDt($input: String!) {
    addManyWhImportSupDt(data: $input) {
      id
    }
  }
`
export const UPDATE_MANY_CAN_SALE = gql`
  mutation updateManyCansale($input: String!) {
    updateManyCansale(data: $input) {
      id
      productId
      whId
      batchId
      totalRemaining
    }
  }
`
export const ADD_MANY_CAN_SALE = gql`
  mutation addManyCansale($input: String!) {
    addManyCansale(data: $input) {
      id
      productId
      whId
      clinicId
      parentClinicId
      quantity
      totalRemaining
      batchId
    }
  }
`
export const UPDATE_WH_IMPORT_SUP = gql`
  mutation updateWhImportSup($input: String!) {
    updateWhImportSup(data: $input) {
      id
      wh {
        id
        name
      }
      whPersion {
        id
        fristName
        lastName
      }
      whPersionId
      whId
      totalAmount
      totalVatAmount
      finalAmount
      totalDiscount
      note
      status
      createAt
      totalPaid
      supplierId
      paymentTypeId
    }
  }
`
export const UPDATE_MANY_WH_IMPORT_SUP_DT = gql`
  mutation updateManyWhImportDt($input: String!) {
    updateManyWhImportSupDt(data: $input) {
      id
      batchId
      importPrice
      whImportSupId
      quantity
      unitId
      finalAmount
      productId
      vat
      totalVatAmount
      createAt
      totalRemaining
      product {
        id
        productName
        unitId
        unit {
          id
          name
        }
        vat
        price
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

export const DELETE_WH_IMPORT_SUP_DT = gql`
mutation ($input: String!){
  deleteWhImportSupDt(id: $input) {
    id
  }
}
`

