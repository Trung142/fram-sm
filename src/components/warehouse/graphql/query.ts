import { gql } from "@apollo/client";


export const GET_WAREHOUSE = gql`
query GetWareHouseQuery($input: WarehouseFilterInput, $skip: Int, $take: Int){
    getWarehouse(
        where: $input
        skip: $skip
        take: $take
        order: {createAt: DESC}
      ){
      items{
        id
        name
        phone
        email
        address
        deleteYn
        warehouseTypeId
        warehouseType{
          id
          name
        }
        clinicId
        clinic{
          name
        }
      }
    }
  }
`

export const GET_WAREHOUSE_TYPE = gql`
query{
    getWarehouseType{
        items{
            id
            label: name
        }
    }
}
`

export const GET_USER = gql`
query{
  getUser{
      items{
          id
          lastName
          fristName
      }
  }
}
`
