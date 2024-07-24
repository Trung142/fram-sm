import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
mutation AddProduct($input: ProductInput!) {
  addProduct(data: $input) {
    id
    productName
  }
}
`
export const UPDATE_PRODUCT = gql`
 mutation UpdateProduct($input: String!) {
  updateProduct(data: $input) {
    id
    productName
  }
}
`
export const ADD_PRODUCT_GROUP = gql`
mutation AddCommodityGroup($input: CommodityGroupInput!) {
    addCommodityGroup(data: $input) {
        id
        name
  }
}
`
 export const UPDATE_PRODUCT_GROUP = gql`
 mutation UpdateCommodityGroup($input: String!) {
    updateCommodityGroup(data: $input) {
        id
        name
  }
}
`
export const ADD_PRODUCT_UNIT = gql`
mutation addProductAddUnit($input: ProductAddUnitInput!) {
  addProductAddUnit(data: $input) {
       id
       price
 }
}
`
