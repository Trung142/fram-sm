import { gql } from '@apollo/client'
export const GET_WH_TRANSFER = gql`
  query getWhTransfer($input: WhTransferFilterInput, $skip: Int, $take: Int) {
    getWhTransfer(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      items {
        id
        createAt
        deleteYn
        modifyAt
        note
        placeReceiving {
          id
          name
        }
        placeReceivingId
        placeRelease {
          id
          name
        }
        placeReleaseId
        totalAmount
        status
        statusPlaceRelease
        statusPlaceReceiving
        whPersion {
          id
          fristName
          lastName
        }
        whPersionId
        whReceiving {
          id
          name
        }
        whReceivingId
        whRelease {
          id
          name
        }
        whReleaseId
        whTransferDts {
          batchId
          batch {
            id
            startDate
            endDate
            batch1
          }
          createAt
          deleteYn
          dueDate
          id
          modifyAt
          product {
            id
            productName
            price
            vat
            unitId
            cansales {
              id
              batchId
              whId
              productId
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
          productId
          totalAmount
          transAmount
          transQuantity
          unitId
          unit {
            name
          }
        }
      }
    }
  }
`
export const GET_WH_TRANSFER_DT = gql`
  query getWhTransferDt($input: WhTransferDtFilterInput) {
    getWhTransferDt(where: $input) {
      items {
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
      }
    }
  }
`
export const GET_WH = gql`
  query ($input: WarehouseFilterInput) {
    getWarehouse(where: $input) {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_CLINIC = gql`
  query getClinic($input: ClinicFilterInput, $skip: Int, $take: Int) {
    getClinic(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      items {
        id
        label: name
        parentClinicId
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
  query getCanSale($input: CansaleFilterInput, $skip: Int, $take: Int) {
    getCansale(where: $input, skip: $skip, take: $take) {
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
