import { gql } from '@apollo/client'

export const GET_PRODUCT = gql`
  query getProduct($input: ProductFilterInput, $skip: Int, $take: Int) {
    getProduct(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        productName
        price
        unitId
        stopYn
        bhytName
        bhytPrict
        manufacturer
        manufacturerContry
        describe
        vat
        barId
        minimumInventory
        maximumInventory
        resNumber
        prescribingUnitId
        ingredients
        prescribingUnitId
        specifications
        instructionsId
        commoditiesId
        commodityGroupId
        clinicId
        parentClinicId
        deleteYn
      }
    }
  }
`

export const GET_COMMODITY = gql`
  query {
    getCommodity(where: { deleteYn: { eq: false } }) {
      items {
        id
        name
      }
    }
  }
`
export const GET_COMMODITY_GROUP = gql`
  query getCommodityGroup($input: CommodityGroupFilterInput, $skip: Int, $take: Int) {
    getCommodityGroup(where: $input, skip: $skip, take: $take, order: { createAt: ASC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        name
        note
        deleteYn
      }
    }
  }
`
export const GET_USE_METHOD = gql`
  query {
    getUseMethod(where: { deleteYn: { eq: false } }) {
      items {
        id
        name
      }
    }
  }
`

export const GET_CLINIC = gql`
  query {
    getClinic {
      items {
        id
        name
      }
    }
  }
`

export const GET_WAREHOUSE_TYPE = gql`
  query {
    getWarehouseType(where: { deleteYn: { eq: false } }) {
      items {
        id
        name
      }
    }
  }
`
export const GET_UNIT = gql`
  query {
    getUnit(where: { deleteYn: { eq: false } }) {
      items {
        id
        label: name
      }
    }
  }
`

export const GET_SEARCH_DATA = gql`
  query {
    commodities: getCommodity(where: { deleteYn: { eq: false } }) {
      items {
        id
        label: name
      }
    }
    commodityGroup: getCommodityGroup(where: { deleteYn: { eq: false } }) {
      items {
        id
        label: name
      }
    }
    instructions: getInstructionsProduct {
      items {
        id
        label: name
      }
    }
    unit: getUnit(where: { deleteYn: { eq: false } }) {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_PRODUCT_UNIT = `
query getProductAddUnit($input: ProductAddUnitFilterInput, $skip: Int) {
  getProductAddUnit(
    where: $input
    skip: $skip
    order: {createAt: DESC}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      price
      unitExchangeId
      barid
      productId
    }
  }
}
`

export const GET_WH_EXISTENCE = gql`
  query getWarehouseExistence($skip: Int, $take: Int) {
    getWhExistence(where: { deleteYn: { eq: false } }, skip: $skip, take: $take, order: { createAt: DESC }) {
      items {
        id
        wh {
          name
        }
        whId
        whExistenceDts {
          id
          quantity
          product {
            id
            productName
          }
          batch {
            id
            cansales {
              id
              quantity
              batchId
              totalRemaining
            }
          }
        }
      }
    }
  }
`
export const GET_WH_EXISTENCEDTS = gql`
  query getWhExistenceDt($skip: Int, $take: Int) {
    getWhExistenceDt(where: { deleteYn: { eq: false } }, skip: $skip, take: $take, order: { createAt: DESC }) {
      items {
        id
        quantity
        product {
          id
          productName
        }
        batch {
          id
          cansales {
            id
            quantity
            batchId
          }
        }
      }
    }
  }
`

export const GET_CANSALE = gql`
  query getCansale($input: CansaleFilterInput, $skip: Int, $take: Int) {
    getCansale(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      items {
        id
        quantity
        batchId
      }
    }
  }
`
export const GET_WH_CUSRETURN = gql`
  query {
    getWhCustReturn {
      items {
        id
        whCustReturnDts {
          id
          finalAmount
          quantity
          totalRemaining
          totalSold
          totalVatAmount
          productId
          importPrice
          createAt
        }
      }
    }
  }
`
export const GET_WH_CUSRETURNDT = gql`
  query {
    getWhCustReturnDt {
      totalCount
      items {
        batchId
        clinicId
        createAt
        createBy
        deleteYn
        discountAmount
        discountPercent
        dueDate
        finalAmount
        id
        importPrice
        modifyAt
        modifyBy
        parentClinicId
        productId
        quantity
        totalRemaining
        totalSold
        totalVatAmount
        unitId
        vat
        whCustReturnId
      }
    }
  }
`
export const GET_WH_EXPCANCEL = gql`
query{
  getWhExpCancel {
    totalCount
    items {
      clinicId
      createAt
      createBy
      deleteYn
      id
      modifyAt
      modifyBy
      note
      parentClinicId
      status
      totalAmount
      whId
      whPersionId
    }
  }
}
`
export const GET_WH_EXPCANCELDT = gql`
query{
  getWhExpCancelDt {
    totalCount
    items {
      batchId
      capitalPrice
      clinicId
      createAt
      createBy
      deleteYn
      id
      modifyAt
      modifyBy
      parentClinicId
      productId
      quantity
      reasonCancel
      totalCancelPrice
      unitId
      whExpCancelId
    }
  }
}
`
export const GET_WH_IMPORTSUP = gql`
query{
  getWhImportSup {
    items {
      clinicId
      createAt
      createBy
      debt
      deleteYn
      finalAmount
      id
      modifyAt
      modifyBy
      note
      parentClinicId
      paymentTypeId
      status
      supplierId
      totalAmount
      totalDiscount
      totalPaid
      totalVatAmount
      whId
      whPersionId
    }
  }
}
`
export const GET_WH_IMPORTSUPDT = gql`
query{
  getWhImportSupDt {
    totalCount
    items {
      batchId
      clinicId
      createAt
      createBy
      deleteYn
      discountAmount
      discountPercent
      dueDate
      finalAmount
      id
      importPrice
      modifyAt
      modifyBy
      parentClinicId
      productId
      quantity
      totalRemaining
      totalSold
      totalVatAmount
      unitId
      vat
      whImportSupId
    }
  }
}
`

export const GET_WH_OTHEREXP = gql`
query{
  getWhOtherExp {
    items {
      clinicId
      createAt
      createBy
      deleteYn
      finalAmount
      id
      modifyAt
      modifyBy
      note
      parentClinicId
      patId
      status
      totalAmount
      totalDiscount
      totalVatAmount
      whId
      whPersionId
    }
  }
}
`
export const GET_WH_OTHEREXPDT = gql`
query{
  getWhOtherExpDt {
    items {
      batchId
      clinicId
      createAt
      createBy
      deleteYn
      discountAmount
      discountPercent
      dueDate
      exportPrice
      finalAmount
      id
      modifyAt
      modifyBy
      parentClinicId
      productId
      quantity
      totalVatAmount
      unitId
      vat
      whOtherExpId
    }
  }
}
`
export const GET_WH_RETURNSUP = gql`
query{
  getWhReturnSup {
    totalCount
    items {
      clinicId
      createAt
      createBy
      deleteYn
      finalAmount
      id
      modifyAt
      modifyBy
      note
      parentClinicId
      paymentTypeId
      status
      supplierId
      totalAmount
      totalDiscount
      totalRefund
      totalVatAmount
      whId
      whImportSupId
      whPersionId
    }
  }
}
`
export const GET_WH_RETURNSUPDT = gql`
query{
  getWhReturnSupDt {
    items {
      batchId
      clinicId
      createAt
      createBy
      deleteYn
      discountAmount
      discountPercent
      dueDate
      finalAmount
      id
      importPrice
      modifyAt
      modifyBy
      parentClinicId
      productId
      quantity
      totalVatAmount
      unitId
      vat
      whReturnSupId
    }
  }
}
`
export const GET_WH_TRANSFER = gql`
query{
  getWhTransfer {
    totalCount
    items {
      clinicId
      createAt
      createBy
      deleteYn
      id
      modifyAt
      modifyBy
      note
      parentClinicId
      placeReceivingId
      placeReleaseId
      status
      statusPlaceReceiving
      statusPlaceRelease
      totalAmount
      whPersionId
      whReceivingId
      whReleaseId
    }
  }
}
`
export const GET_WH_TRANSFERDT = gql`
query{
  getWhTransferDt {
    items {
      batchId
      clinicId
      createAt
      createBy
      deleteYn
      dueDate
      id
      modifyAt
      modifyBy
      parentClinicId
      productId
      totalAmount
      transAmount
      transQuantity
      unitId
      whTransferId
    }
  }
}
`
export const GET_PRODUCT_WAREHOUSE = gql`
query getProduct {
  getProduct {
    items {
      id
      whCustReturnDts {
        discountAmount
        discountPercent
        finalAmount
        id
        createAt
        importPrice
        productId
        quantity
        totalAmount
        totalRemaining
        totalSold
        totalVatAmount
        unitId
        vat
        whCustReturnId
        batchId
        whCustReturn {
          wh {
            name
          }
        }
      }
      whExistenceDts {
        batchId
        id
        createAt
        finalAmount
        importPrice
        quantity
        totalRemaining
        totalSold
        totalVatAmount
        whExistence {
          wh {
            id
            name
          }
        }
      }
      whExpCancelDts {
        batchId
        id
        createAt
        quantity
        whExpCancel {
          wh {
            id
            name
          }
        }
      }
      whImportSupDts {
        batchId
        id
        discountAmount
        discountPercent
        finalAmount
        importPrice
        createAt
        quantity
        totalRemaining
        totalSold
        totalVatAmount
        whImportSup {
          wh {
            id
            name
          }
        }
      }
      whOtherExpDts {
        batchId
        id
        createAt
        discountAmount
        discountPercent
        exportPrice
        finalAmount
        quantity
        totalVatAmount
        whOtherExp {
          wh {
            id
            name
          }
        }
      }
      whReturnSupDts {
        batchId
        id
        discountAmount
        discountPercent
        finalAmount
        importPrice
        createAt
        quantity
        totalVatAmount
        whReturnSup {
          wh {
            id
            name
          }
        }
      }
      whTransferDts {
        batchId
        createAt
        id
        totalAmount
        transAmount
      }
    }
  }
}
`
