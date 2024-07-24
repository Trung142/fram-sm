import { gql } from "@apollo/client";


export const UPDATE_WAREHOUSE = gql`
mutation UpdateWareHouse($input:String!){
    updateWarehouse(data: $input){
        id
        name
    }
}
`

export const ADD_WAREHOUSE = gql`
mutation AddWareHouse($input:WarehouseInput!){
    addWarehouse(data: $input){
        id
        name
    }
}
`