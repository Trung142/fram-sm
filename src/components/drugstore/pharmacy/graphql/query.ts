import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query GetProducts($input: ProductFilterInput, $skip: Int, $take: Int) {
  getProduct(
    where: $input
    skip: $skip
    take: $take
    order: {id: ASC}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
        id
        stopYn
        batchYn
        bhytYn
        resNumber
        productName
        unitId
        price
        vat
        bhytId
        bhytName
        bhytPrict
        insurancePaymentRate
        ingredients
        specifications
        describe
        cansales{
          id
          batchId
          quantity
          createAt
          whId
          productId
          wh{
            id
            name
          }
          batch{
            id
            startDate
            endDate
          }
          totalRemaining
      }
        whExistenceDts{
          id
          totalRemaining
          quantity
          batchId
          createAt
          batch{
            id
            startDate
            endDate
          }
        }
        
        whImportSupDts{
          id
          totalRemaining
          quantity
          batchId
          batch{
            id
            startDate
            endDate
          }
        }
        prescribingUnit{
          id
          name
      }
        prescribingUnitId
        instructions {
            id
            name
            note
        }
        manufacturer
        manufacturerContry
        minimumInventory
        maximumInventory
        commodities {
            id
            name
            note
        }
        commodityGroup {
            id
            name
            note
        }
    }
  }
}
`;

export const GET_COMMODITY = gql`
  query{
    getCommodity(where: {deleteYn: {eq:false}}){
      items{
        id
        name
        note
        deleteYn
      }
    }
  }
`

export const GET_WARE_HOUSE = gql`
  query{
    getWarehouse(where: {deleteYn: {eq:false}}){
      items{
        id
        name
        deleteYn
      }
    }
  }
`
export const GET_COMMODITY_GROUP = gql`
  query{
    getCommodityGroup(where: {deleteYn: {eq:false}}){
      items{
        id
        name
        note
        deleteYn
      }
    }
  }
`

export const GET_WH_TRANSFER = gql`
  query{
    getWhTransfer(where: {deleteYn: {eq:false}}){
      items{
        id
        placeReleaseId
        whReceivingId
        placeReceivingId
        whPersionId
        whReleaseId
        status
        statusPlaceRelease
        statusPlaceReceiving
        whTransferDts{
          id
          productId
        }
        note
        createAt
        clinicId
        parentClinicId
      }
    }
}`

export const GET_ORDERS = gql`
  query GetOrder{
    getOrder(where: {deleteYn: {eq:false}}){
      items{
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
           orderDts{
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
       }
    }
}`

export const GET_PAYMENT_TYPE = gql`
  query GetPaymentType{
    getPaymentType(where: {deleteYn: {eq:false}}){
      items{
        id
        name
        note
      }
    }
}`