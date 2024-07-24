import { gql } from '@apollo/client'

export const ADD_WH_INVENTORY_CHECK = gql`
  mutation addWhCheckInv($input: WhCheckInvInput!) {
    addWhCheckInv(data: $input) {
      clinicId
      parentClinicId
      createAt
      deleteYn
      id
      modifyAt
      note
      whPersion {
        id
        fristName
        lastName
        clinicId
        parentClinicId
      }
      whRelease {
        id
        name
        clinicId
        parentClinicId
      }
    }
  }
`
export const ADD_MANY_WH_INVENTORY_CHECK_DT = gql`
  mutation addManyWhCheckInvDt($input: String!) {
    addManyWhCheckInvDt(data: $input) {
      batchId
      whCheckInvId
      clinicId
      parentClinicId
      createAt
      deleteYn
      dueDate
      id
      modifyAt
      qtyExistBeforeCheck
      qtyExistAfterCheck
      unit {
        id
        name
      }
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
export const DELETE_WH_CHECK_INV_DT= gql`
  mutation deleteWhCheckInvDt($input: String!) {
    deleteWhCheckInvDt(id: $input) {
      id
    }
  }
`
export const UPDATE_WH_CHECK_INV = gql`
  mutation updateWhCheckInv($input: String!) {
    updateWhCheckInv(data: $input) {
      id
      clinicId
      parentClinicId
      createAt
      deleteYn
      totalDifference
      status
      modifyAt
      note
      whPersion {
        id
        fristName
        lastName
        clinicId
        parentClinicId
      }
      whRelease {
        id
        name
        clinicId
        parentClinicId
      }
      whCheckInvDts {
        batchId
        whCheckInvId
        clinicId
        amountDifference
        parentClinicId
        createAt
        deleteYn
        product {
          cansales {
            id
            whId
            batchId
            totalRemaining
            quantity
          }
        }
        dueDate
        id
        modifyAt
        qtyExistBeforeCheck
        qtyExistAfterCheck
        unit {
          id
          name
        }
      }
    }
  }
`
export const UPDATE_MANY_WH_CHECK_INV_DT = gql`
mutation updateManyWhCheckInvDt($input: String!) {
  updateManyWhCheckInvDt(data: $input) {
    batchId
        whCheckInvId
        clinicId
        amountDifference
        parentClinicId
        createAt
        deleteYn
        product {
          cansales {
            id
            whId
            batchId
            totalRemaining
            quantity
          }
        }
        dueDate
        id
        modifyAt
        qtyExistBeforeCheck
        qtyExistAfterCheck
        unit {
          id
          name
        }
  }
}
`

