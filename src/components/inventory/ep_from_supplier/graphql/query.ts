import { gql } from '@apollo/client'
export const GET_WH_EP_RETURN_SUPPLIER = gql`
query getWhReturnSup($input:WhReturnSupFilterInput, $skip: Int,$take: Int){
  getWhReturnSup(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  )
  {
    items{
      id
      wh {
        id
        name
      
      }
      whPersion{
        id
        fristName
        lastName
      }
      
      whPersionId
      whId
      supplierId
      supplier {
        id
        name
      }
      paymentTypeId
      whImportSupId
      totalAmount
      totalVatAmount
      finalAmount
      totalDiscount
      totalRefund
      note
      status
      createAt
      whReturnSupDts {
        id
        unitId
          unit {
            name
          }
        batchId
        whReturnSupId
        vat
        quantity
        importPrice
        totalVatAmount
        discountPercent
        discountAmount
        finalAmount
        productId
        product {
          id
          productName
          price
          unit{
            id
            name
          }
          vat
          price
          maximumInventory
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

export const GET_WH_EP_RETURN_SUPPLIER_DT = gql`
query GetWhReturnSupDt($input:WhReturnSupDtFilterInput, $skip: Int,$take: Int){
  getWhReturnSupDt(
    where: $input, skip: $skip, take: $take, order: {createAt: DESC}
  )
  {
    totalCount
    items{
      id
      
      batchId
      batch{
        startDate
        endDate
        batch1
      }
      dueDate
      unitId
      unit {
        name
      }
      whReturnSupId
      whReturnSup {
        wh {
          name
        }
        whPersion{
          fristName
          lastName
        }
        supplier {
          name
        }
        paymentTypeId
        whImportSupId
        totalAmount
        totalVatAmount
        finalAmount
        totalDiscount
        totalRefund
        note
        status
        createAt
      }
      productId
      quantity
      vat
      importPrice
      totalVatAmount
      discountPercent
      discountAmount
      finalAmount
      createBy
      createAt
      
      product{
        id
        productName
        unit{
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

export const GET_SUPPLIER = gql`
query{
  getSupplier{
      items{
          id
          label: name

      }
  }
} 

`


//kho xuat
export const GET_WH = gql` 
query{
  getWarehouse{
      items{
          id
          label: name

      }
  }
}  `

//
export const GET_UNIT = gql` 
query{
  getUnit{
      items{
          id
          label:  name

      }
  }
}  `

export const GET_WAREHOUSE_PS = gql` 
query{
  getWarehouse{
      items{
          id
          label: name

      }
  }
}  `
export const GET_PRODUCT_LIST = gql` 
query{
  getProduct{
    items{
      id
       productName
       unit{
         name
       }
       price
       vat
       bhytPrict
       ingredients
       specifications
       maximumInventory
       cansales {
        id
        totalRemaining
        quantity
        batchId
        whId
      }

       barId
   
   
    }
      
       
     }
}  `
export const GET_PRODUCT_GROUP = gql`
  query GetProductGroup {
    getProductGroup {
      items {
        id
        name
      }
    }
  }
`
export const GET_SERVICE = gql`
  query GetService {
    getService {
      items {
        id
        name
        price
        bhytId
        bhytPrice
        bhytName
        chooseSpecIndex
        clinicId
        cost
        createAt
        createBy
        describe
        gender
        insurancePaymentRate
        serviceGroupId
        serviceTypeId
        status
      }
    }
  }
`
export const GET_PRODUCTS_RETURNSUPPLIER = gql`
query {
  getWhImportSupDt{
      items{
          product{
            id
            productName
            unitId
            barId
            ingredients
            specifications
            price
            vat
            bhytPrict
            maximumInventory
            cansales {
              id
              totalRemaining
              quantity
              batchId
              whId
              }
          }
      }
      
  }
}
`
export const GET_PRODUCT = gql`
query {
  getProduct{
      items{
          id
          productName
          unitId
          barId
         ingredients
         specifications
         price
         vat
         bhytPrict
        maximumInventory
        cansales {
          id
          totalRemaining
          quantity
          batchId
          whId
        }
        batches{
          id
          batch1
          startDate
          endDate
        }
      }
  }
}
`


export const GET_BATCH = gql`
query {
  getBatch{
      items{
          id
          startDate
          endDate
          modifyAt
          parentClinicId
          clinicId
          batch1
      }
  }
}
`
export const GET_BATCH_NAME = gql`
query {
  getBatch{
      items{
          id
          
          label: batch1
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
query ($input: CansaleFilterInput, $skip: Int, $take: Int) {
  getCansale(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ){
    totalCount
      items{
        id
        batchId
        quantity
        createAt
        whId
        productId
        product{
          productName
        }
        wh{
          id
          name
        }
        batch{
          id
          
          batch1
        }
        totalRemaining
        clinicId
        parentClinicId
      }
  }
}
`
