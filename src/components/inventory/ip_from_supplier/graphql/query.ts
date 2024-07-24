import { gql } from '@apollo/client'
export const GET_WH_IP_FROM_SUPPLIER = gql`
  query getWhImportSup($input: WhImportSupFilterInput, $skip: Int, $take: Int) {
    getWhImportSup(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      items {
        id
        wh {
          id
          name
        }
        whPersion {
          id
          fristName
          lastName
        }
        whPersionId
        whId
        totalAmount
        totalVatAmount
        finalAmount
        totalDiscount
        note
        debt
        status
        createAt
        totalPaid
        supplierId
        supplier {
          name
        }
        paymentTypeId
        whImportSupDts {
          id
          batchId
          importPrice
          whImportSupId
          quantity
          unitId
          unit {
            name
          }
          finalAmount
          productId
          vat
          totalVatAmount
          createAt
          totalRemaining
          productId
          product {
            id
            productName
            unitId
            unit {
              id
              name
            }
            vat
            price
            cansales {
              id
              totalRemaining
              quantity
              batchId
              whId
            }
            batches {
              batch1
              startDate
              endDate
              id
            }
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
      pageInfo{
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
          batch1
          productId
          startDate
          endDate
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
export const GET_SUPPLIER = gql`
  query {
    getSupplier {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_PAYMENT_TYPE = gql`
  query {
    getPaymentType {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_CANSALE = gql`
  query getCanSale($input: CansaleFilterInput, $skip:Int, $take: Int) {
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
export const GET_WH_IMPORT_SUP_DT = gql`
  query getWhImportSupDt($input: WhImportSupDtFilterInput, $skip: Int, $take: Int) {
    getWhImportSupDt(where: $input, skip: $skip, take: $take) {
      totalCount
      items {
        id
        batchId
        batch {
          startDate
          endDate
          batch1
        }
        dueDate
        importPrice
        unitId
        unit {
          name
        }
        whImportSupId
        whImportSup {
          createAt
          status
          whPersion {
            fristName
            lastName
          }
          wh {
            name
          }
          supplier {
            name
          }
          totalAmount
          finalAmount
          totalPaid
          totalVatAmount
          totalDiscount
          debt
          note
        }
        quantity
        finalAmount
        productId
        vat
        discountPercent
        discountAmount
        totalVatAmount
        createAt
        totalRemaining
        product {
          id
          productName
          unit {
            id
            name
          }
          cansales {
            id
            batchId
            whId
            productId
            quantity
            totalRemaining
          }
          vat
          price
          maximumInventory
        }
      }
    }
  }
`
export const GET_WH_CUST_RETURN_DT = gql`
query GetWhCustReturnDt($input: WhCustReturnDtFilterInput, $skip: Int, $take: Int) {
  getWhCustReturnDt(where: $input, skip: $skip, take: $take) {
    totalCount
    items {
      id
      batchId
      batch {
        startDate
        endDate
      }
      dueDate
      importPrice
      unitId
      unit {
        name
      }
      whCustReturnId
      whCustReturn {
        createAt
        status
        whPersion {
          fristName
          lastName
        }
        wh {
          name
        }
        
        totalAmount
        finalAmount
        
        totalVatAmount
        totalDiscount
        
        note
      }
      quantity
      finalAmount
      productId
      vat
      discountPercent
      discountAmount
      totalVatAmount
      createAt
      totalRemaining
      product {
        id
        productName
        unit {
          id
          name
        }
        cansales {
          id
          batchId
          whId
          productId
          quantity
          totalRemaining
        }
        vat
        price
        maximumInventory
      }
    }
  }
}`