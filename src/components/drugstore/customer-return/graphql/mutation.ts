import { gql } from '@apollo/client'

export const ADD_WH_CUST_RETURN = gql`
  mutation AddWhCustReturn($input: WhCustReturnInput!) {
    addWhCustReturn(data: $input) {
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
export const ADD_WH_MANY_CUST_RETURN_DT = gql`
  mutation AddManyWhCustReturnDt($input: String!) {
    addManyWhCustReturnDt(data: $input) {
      id
      unitId
      whCustReturnId
      importPrice
      discountPercent
      discountAmount
      finalAmount
      totalAmount
      productId
      parentClinicId
      quantity
      vat
      totalVatAmount
      batchId
    }
  }
`

export const UPDATE_WH_CUST_RETURN = gql`
  mutation UpdateWhCustReturn($input: String!) {
    updateWhCustReturn(data: $input) {
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

export const UPDATE_WH_CUST_RETURN_DT = gql`
  mutation UpdateWhCustReturnDt($input: String!) {
    updateWhCustReturnDt(data: $input) {
      id
      unitId
      whCustReturnId
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
export const DELETE_WH_CUST_RETURN_DT = gql`
  mutation DeleteWhCustReturnDt($input: String!) {
    deleteWhCustReturnDt(id: $input) {
      id
      unitId
      whCustReturnId
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