import { gql } from "@apollo/client";


export const ADD_ORDER = gql`
  mutation AddOrder($input: OrderInput!){
    addOrder(data: $input){
        id
        resExamId
        prescriptionId
        paymentStatus
        status
        totalVat
        totalDiscount
        totalPrice
        finalPrice
        patId
        whId
        note
        deleteYn
        totalSurcharge
        pharmacyManagerId
        clinicId
        parentClinicId
    }
  }`

export const ADD_MANY_ORDER_DT = gql`
  mutation AddManyOrderDt($input: String!){
    addManyOrderDt(data: $input){
        id
        orderId
        productId
        quantity
        dosage
        vat
        vatAmount
        batchId
        totalAmount
        unitPrice
        discountPercent
        discountAmount
        finalPrice
        promotionPercent
        promotionAmount
        couponPercent
        couponAmount
        clinicId
        parentClinicId
    }
  }`

export const ADD_PAYMENT = gql`
  mutation AddPayment($input: PaymentInput!){
    addPayment(data: $input){
      id
      orderId
      paymentTypeId
      resExamServiceId
      patName
      note
      status
      totalAmount
      actuallyReceivedAmount
      debtAmount
      totalSurcharge
      clinicId
      parentClinicId
    }
  }`

export const ADD_MANY_PAYMENT_DT = gql`
mutation AddManyPaymentDt($input: String!){
  addManyPaymentDt(data: $input){
      id
      productId
      paymentId
      orderId
      resExamServiceId
      status
      quantity
      vatAmount
      bhytAmount
      unitPrice
      totalAmount
      finalPrice
      surcharge
      discountAmount
      clinicId
      parentClinicId
  }
}`


export const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: String!){
    updateOrder(data: $input){
        id
        resExamId
        prescriptionId
        paymentStatus
        status
        totalVat
        totalDiscount
        totalPrice
        finalPrice
        patId
        whId
        note
        deleteYn
        pharmacyManagerId
        clinicId
        parentClinicId
    }
  }`

export const UPDATE_PRESCRIPTION = gql`
  mutation UpdatePrescription($input: String!){
    updatePrescription(data: $input){
        id
        status
        clinicId
        parentClinicId
    }
  }`

export const UPDATE_MANY_ORDER_DT = gql`
  mutation UpdateManyOrderDt($input: String!){
    updateManyOrderDt(data: $input){
        id
        batchId
        orderId
        productId
        quantity
        dosage
        vat
        vatAmount
        batchId
        totalAmount
        unitPrice
        discountPercent
        discountAmount
        finalPrice
        promotionPercent
        promotionAmount
        couponPercent
        couponAmount
        clinicId
        parentClinicId
    }
  }`

export const UPDATE_MANY_CANSALES = gql`
  mutation UpdateManyCansale($input: String!){
    updateManyCansale(data: $input){
        id
        quantity
        totalRemaining
        batchId
        clinicId
        parentClinicId
    }
  }`

export const DELETE_ORDER_DT = gql`
  mutation DeleteOrderDt($input: String!){
    deleteOrderDt(data: $input){
        id
    }
  }`