import { gql } from '@apollo/client'
export const GET_WH_EXISTENCE = gql`
query getWarehouseExistence($input: WhExistenceFilterInput, $skip: Int, $take: Int){
  getWhExistence(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ){
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
      totalAmount
      totalVatAmount
      finalAmount
      totalDiscount
      note
      status
      createAt
      deleteYn
      whExistenceDts{
        id
        batchId
        importPrice
        whExistenceId
        quantity
        finalAmount
        productId
        vat
        totalVatAmount
        createAt
        totalRemaining
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
         cansales{
            id
            batchId
            quantity
            createAt
            whId
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
        }
      }
   

    }
  }
}
`
export const GET_WH = gql` 
query{
  getWarehouse{
      items{
          id
          label: name

      }
  }
}  `
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
export const GET_PRODUCTS_IPINVENTORY = gql`
query {
  getWhExistence{
    items{
    
      whExistenceDts{
        product{
          id
          unitId
          price
          productName
          bhytPrict
          specifications
          ingredients
          vat
          maximumInventory
        }
      }

    }
  }
}
`
export const GET_PRODUCT = gql`
query {
  getProduct(
    order: {createAt: DESC}

  ){
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
         cansales{
            id
            batchId
            quantity
            createAt
            whId
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
          batch1
          modifyAt
          parentClinicId
          clinicId
      }
  }
}
`
export const GET_CANSALES = gql`
query GetCansale($input: CansaleFilterInput, $skip: Int, $take: Int) {
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
          startDate
          endDate
        }
        totalRemaining
        clinicId
        parentClinicId
      }
  }
}
`