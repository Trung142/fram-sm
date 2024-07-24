import { gql } from '@apollo/client'

export const ADD_WH_EXISTENCE = gql`
  mutation AddWhExistence($input: WhExistenceInput!) {
    addWhExistence(data: $input) {
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
export const ADD_WH_EXISTENCE_DT = gql`
  mutation AddWhExistenceDt($input: String!) {
    addManyWhExistenceDt(data: $input) {
      id
      unitId
      whExistenceId
      importPrice
      discountPercent
      discountAmount
      finalAmount
      productId
      parentClinicId
      quantity
      vat
      totalVatAmount
      batchId
    }
  }
`

export const UPDATE_WH_EXISTENCE = gql`
  mutation UpdateWhExistence($input: String!) {
    updateWhExistence(data: $input) {
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

export const UPDATE_WH_EXISTENCE_Dt = gql`
  mutation updateWhExistenceDt($input: String!) {
    updateWhExistenceDt(data: $input) {
      id
      unitId
      whExistenceId
      importPrice
      discountPercent
      discountAmount
      finalAmount
      productId
      parentClinicId
      quantity
      vat
      totalVatAmount
      deleteYn
      batchId
    }
  }
`
export const DELETE_WH_EXISTENCE_Dt = gql`
  mutation DeleteWhExistenceDt($input: String!) {
    deleteWhExistenceDt(id: $input) {
      id
      unitId
      whExistenceId
      importPrice
      discountPercent
      discountAmount
      finalAmount
      productId
      parentClinicId
      quantity
      vat
      totalVatAmount
      batchId
    }
  }
`

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

export const ADD_MANY_CANSALE = gql`
  mutation AddManyCansale($input: String!) {
    addManyCansale(data: $input) {
      id
      batchId
      productId
      whId
      totalRemaining
      quantity
      clinicId
      parentClinicId
    }
  }
`
export const ADD_CANSALE = gql`
mutation AddCansale($input: CansaleInput!) {
  addCansale(data: $input) {
    id
    batchId
    productId
    whId
    totalRemaining
    quantity
    clinicId
    parentClinicId
  }
}
`

export const UPDATE_MANY_CANSALE = gql`
  mutation UpdateManyCansale($input: String!) {
    updateManyCansale(data: $input) {
      id
      batchId
      productId
      whId
      totalRemaining
      quantity
      clinicId
      parentClinicId
    }
  }
`
export const UPDATE_CANSALE = gql`
  mutation UpdateCansale($input: String!) {
    updateCansale(data: $input) {
      id
      batchId
      productId
      whId
      totalRemaining
      quantity
      clinicId
      parentClinicId
    }
  }
`