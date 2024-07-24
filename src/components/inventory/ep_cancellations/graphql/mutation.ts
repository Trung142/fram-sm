import { gql } from '@apollo/client'

export const ADD_RETURN_SUPPLIER = gql`
  mutation ADD_RETURN($input: WhReturnSupInput!) {
    addWhReturnSup(data: $input) {
      id
      note
      clinicId
      parentClinicId
      status
      whPersionId
      supplierId
      whId
      totalVatAmount
      totalAmount
      totalRefund
      totalDiscount
      totalAmount
      finalAmount
      paymentTypeId
    }
  }
`
export const ADD_WH_CANCEL = gql`
  mutation ADD_CANCEL($input: WhExpCancelInput!) {
    addWhExpCancel(data: $input) {
      id
      note
      clinicId
      parentClinicId
      status
      whPersionId
      whId
      totalAmount
    }
  }
`

export const ADD_MANY_CANCEL_DT = gql`
  mutation ADD_CANCEL_DT($input: String!) {
    addManyWhExpCancelDt(data: $input) {
      id
      whExpCancelId
      clinicId
      parentClinicId

      product {
        id
        productName
      }
      batch {
        id
      }
      quantity
      unit {
        id
      }
      capitalPrice
      totalCancelPrice
      createAt
    }
  }
`

export const ADD_MANY_RETURN_SUPPLIER_DT = gql`
  mutation ADD_RETURN_DT($input: String!) {
    addManyWhReturnSupDt(data: $input) {
      id
      whReturnSupId
      clinicId
      parentClinicId
      product {
        id
        productName
      }
      batch {
        id
      }
      quantity
      unitId
      importPrice
      discountAmount
      discountPercent
      vat
      totalVatAmount

      finalAmount
      createBy
      createAt
      modifyBy
      modifyAt
    }
  }
`
export const UPDATE_RETURN_SUPPLIER = gql`
  mutation UpdateWhReturnSup($input: String!) {
    updateWhReturnSup(data: $input) {
      id
      note
      clinicId
      parentClinicId
      status
      whPersion {
        id
        fristName
        lastName
      }
      supplierId
      wh {
        id
        name
      }
      totalVatAmount
      totalAmount
      totalRefund
      totalDiscount
      totalAmount
      finalAmount
      paymentTypeId
      createAt
    }
  }
`

export const UPDATE_EXP_CANCEL = gql`
  mutation UpdateWhExpCancel($input: String!) {
    updateWhExpCancel(data: $input) {
      id
      note
      clinicId
      parentClinicId
      status
      whPersion {
        id
        fristName
        lastName
      }

      wh {
        id
        name
      }

      totalAmount

      createAt
    }
  }
`

export const UPDATE_RETURN_SUPPLIER_DT = gql`
  mutation UpdateWhReturnSupDt($input: String!) {
    updateWhReturnSupDt(data: $input) {
      id
      whReturnSupId
      clinicId
      parentClinicId
      productId
      batchId

      quantity
      unitId
      importPrice
      discountAmount
      discountPercent
      vat
      totalVatAmount

      finalAmount
      createBy
      createAt
      modifyBy
      modifyAt
    }
  }
`
export const UPDATE_MANY_RETURN_SUPPLIER_DT = gql`
  mutation updateManyWhReturnSupDt($input: String!) {
    updateManyWhReturnSupDt(data: $input) {
      id
    }
  }
`

export const DELETE_RETURN_SUPPLIER_DT = gql`
  mutation DeleteWhReturnSupDt($input: String!) {
    deleteWhReturnSupDt(data: $input) {
      id
      whReturnSupId
      clinicId
      parentClinicId
      product {
        id
        productName
      }
      batch {
        id
      }
      quantity
      unitId
      importPrice
      discountAmount
      discountPercent
      vat
      totalVatAmount

      finalAmount
      createBy
      createAt
      modifyBy
      modifyAt
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

export const UPDATE_MANY_CANSALE = gql`
  mutation updateManyCansale($input: String!) {
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

export const ADD_MANY_CANSALE = gql`
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
