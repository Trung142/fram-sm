import { gql } from '@apollo/client'

export const GET_PRESCRIPTION = gql`
  query getPrescription($input: PrescriptionFilterInput, $skip: Int, $take: Int) {
    getPrescription(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        createAt
        resExam {
          id
          gender
          year
          age
          monthsOld
          doctor {
            id
            fristName
            lastName
          }
          patName
        }
        statusSignOnline
        prescriptionDts {
          id
          productId
          product {
            productName
            prescribingUnit {
              name
            }
            price
            vat
          }
          quantity
          dosage
        }
        orders {
          id
          orderDts {
            productId
            discountAmount
            finalPrice
            quantity
          }
        }
        deleteYn
        status
        statusDtqg
        paymentStatus
      }
    }
  }
`
