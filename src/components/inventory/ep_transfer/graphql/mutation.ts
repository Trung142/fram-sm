import { gql } from '@apollo/client'

export const ADD_WH_TRANSFER = gql`
  mutation addWhTransfer($input: WhTransferInput!) {
    addWhTransfer(data: $input) {
      id
      createAt
      deleteYn
      modifyAt
      note
      placeReceiving {
        id
        name
      }
      placeRelease {
        id
        name
      }
      status
      statusPlaceRelease
      statusPlaceReceiving
      totalAmount
      whPersion {
        id
        fristName
        lastName
      }
      whReceiving {
        id
        name
      }
      whRelease {
        id
        name
      }
    }
  }
`
export const ADD_MANY_WH_TRANSFER_DT = gql`
  mutation addManyWhTransferDt($input: String!) {
    addManyWhTransferDt(data: $input) {
      batchId
      createAt
      deleteYn
      dueDate
      id
      modifyAt
      product {
        id
        productName
        price
        unitId
      }
      totalAmount
      transAmount
      transQuantity
      unitId
      parentClinicId
      clinicId
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
export const UPDATE_WH_TRANSFER = gql`
  mutation updateWhTransfer($input: String!) {
    updateWhTransfer(data: $input) {
      id
      clinicId
      parentClinicId
      createAt
      deleteYn
    }
  }
`
export const UPDATE_MANY_WH_TRANSFER_DT = gql`
  mutation updateManyWhTransferDt($input: String!) {
    updateManyWhTransferDt(data: $input) {
      id
      clinicId
      parentClinicId
      createAt
      deleteYn
    }
  }
`
export const DELETE_WH_TRANSFER = gql`
  mutation deleteWhTransferDt($input: String!) {
    deleteWhTransferDt(id: $input) {
      id
      clinicId
      parentClinicId
      createAt
      deleteYn
    }
  }
`
