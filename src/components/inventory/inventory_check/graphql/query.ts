import { gql } from '@apollo/client'

export const GET_WH_CHECK_INV = gql`
  query getWhCheckInv($input: WhCheckInvFilterInput, $skip: Int, $take: Int) {
    getWhCheckInv(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      items {
        clinicId
        parentClinicId
        createAt
        deleteYn
        id
        modifyAt
        note
        totalDifference
        status
        whPersionId
        whPersion {
          id
          fristName
          lastName
          clinicId
          parentClinicId
        }
        whReleaseId
        whRelease {
          id
          name
          clinicId
          parentClinicId
        }
        whCheckInvDts {
          whCheckInvId
          batchId
          clinicId
          parentClinicId
          createAt
          deleteYn
          dueDate
          unitId
          id
          batch {
            id
            startDate
            endDate
            batch1
          }
          amountDifference
          modifyAt
          product {
            id
            productName
            price
            vat
            cansales {
              id
              whId
              batchId
              totalRemaining
              quantity
            }
            batches {
              id
              startDate
              endDate
              batch1
            }
          }
          qtyExistBeforeCheck
          qtyExistAfterCheck
          unit {
            id
            name
          }
        }
      }
    }
  }
`
export const GET_WH = gql`
  query {
    getWarehouse {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_UNIT = gql`
  query {
    getUnit {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_PRODUCT = gql`
  query getProduct($input: ProductFilterInput, $skip: Int, $take: Int) {
    getProduct(where: $input, skip: $skip, take: $take) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        productName
        unitId
        barId
        ingredients
        specifications
        price
        vat
        bhytPrict
        cansales {
          id
          totalRemaining
          quantity
          batchId
          whId
        }
        batches {
          id
          startDate
          endDate
          batch1
        }
      }
    }
  }
`
export const GET_BATCH = gql`
  query {
    getBatch {
      items {
        id
        startDate
        endDate
        modifyAt
        parentClinicId
        clinicId
      }
    }
  }
`
export const GET_CANSALE = gql`
  query getCanSale($input: CansaleFilterInput) {
    getCansale(where: $input) {
      items {
        id
        whId
        productId
        batchId
        totalRemaining
        quantity
      }
    }
  }
`
export const GET_WH_CHECK_INV_DT = gql`
  query getWhCheckInvDt($input: WhCheckInvDtFilterInput, $skip: Int, $take: Int) {
    getWhCheckInvDt(where: $input, skip: $skip, take: $take) {
      totalCount
      items {
        batchId
        whCheckInvId
        clinicId
        parentClinicId
        createAt
        deleteYn
        amountDifference
        dueDate
        product {
          id
          productName
        }
        id
        modifyAt
        qtyExistBeforeCheck
        qtyExistAfterCheck
        unit {
          id
          name
        }
        whCheckInv {
          clinicId
          parentClinicId
          createAt
          deleteYn
          id
          modifyAt
          note
          status
          totalDifference
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
    }
  }
`
