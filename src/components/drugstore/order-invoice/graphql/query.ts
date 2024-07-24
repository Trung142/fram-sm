import { gql } from '@apollo/client'

export const GET_ORDER = gql`
  query getOrder($input: OrderFilterInput) {
    getOrder(where: $input, order: { createAt: DESC }) {
      totalCount
      items {
        id
        createAt
        deleteYn
        totalDiscount
        finalPrice
        totalVat
        status
        paymentStatus
        totalPrice
        bhytAmount
        note
        payments {
          actuallyReceivedAmount
          debtAmount
        }
        paymentType {
          id
          name
        }
        orderDts {
          id
          vat
          finalPrice
          discountAmount
          quantity
          batchId
          batch {
            id
            startDate
            endDate
          }
          product {
            id
            productName
            createAt
            price
            bhytPrict
            prescribingUnit {
              name
            }
          }
          bhytAmount
          totalAmount
          unit {
            name
          }
        }
        pat {
          id
          name
        }
        resExam {
          id
          patName
          benefitLevel {
            id
            name
          }
        }
        pharmacyManager {
          id
          userName
          lastName
          fristName
        }
        prescription {
          id
        }
      }
    }
  }
`
export const GET_PAYMENT_TYPE = gql`
query {
  getPaymentType {
    items {
      id
      name
    }
  }
}
`
