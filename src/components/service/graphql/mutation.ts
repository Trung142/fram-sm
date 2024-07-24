import { gql } from '@apollo/client'

export const ADD_SERVICE = gql`
  mutation AddService($input: ServiceInput!) {
    addService(data: $input) {
      id
      name
    }
  }
`

export const  ADD_SERVICE_INDEX=gql`
mutation AddServiceIndex($input: ServiceIndexInput!) {
  addServiceIndex(data:$input){
    id
    name
    serviceId
  }
}
`

export const ADD_SERVICE_INDEX_PROC=gql`
mutation AddServiceIndexProc($input: ServiceIndexProcInput!){
  addServiceIndexProc(data: $input){
    id
    serviceId
  }
}
`
export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: String!) {
    updateService(data: $input) {
      id
      name
      gender
      bhytName
    }
  }
`

export const UPDATE_SERVICE_INDEX = gql`
mutation UpdateServiceIndex($input: String!) {
  updateServiceIndex(data:$input){
    id
    name
  }
}
`
export const UPDATE_SERVICE_INDEX_PROC = gql`
mutation UpdateServiceIndexProc($input: String!) {
  updateServiceIndexProc(data:$input){
    id
    serviceId
  }
}
`

export const ADD_SERVICE_GROUP=gql`
mutation addServiceGroup($input: ServiceGroupInput!) {
  addServiceGroup(data: $input) {
    id
    name
  }
}
`
export const UPDATE_COMREFER_VALUE = gql`
mutation UpdateComReferValue($input:String!){
  updateComReferValue(data:$input){
    id
    deleteYn
  }
}
`

export const ADD_COMREFER_VALUE = gql`
mutation AddComreferValue($input: ComReferValueInput!){
  addComReferValue(data: $input){
     id
     deleteYn
  } 
 }
`

export const ADD_CONSUM_VALUE = gql`
mutation AddConSumProduct($input: ConsumProductInput!){
  addConsumProduct(data: $input){
    id
    name
  }
}
`

export const UPDATE_MANY_CONSUM_PRODUCT = gql`
mutation UpdateManyConSumProduct($input:String!){
  updateManyConsumProduct(data: $input){
    id
    unit
    quantity
    deleteYn
  }
}
`
export const UPDATE_CONSUM_PRODUCT = gql`
mutation UpdateConSumProduct($input:String!){
  updateConsumProduct(data: $input){
    id
    unit
    quantity
    deleteYn
  }
}
`

export const UPDATE_SERVICE_GROUP = gql`
mutation UpdateServiceGroup($input:String!){
  updateServiceGroup(data: $input){
    id
    name
    note
  }
}
`
export const ADD_SERVICE_EXAMPLE_VALUE=gql`
mutation AddServiceExampleValue($input:ServiceExampleValueInput!){
  addServiceExampleValue(data: $input){
    id
    name
  }
}
`

export const UPDATE_SERVICE_EXAMPLE_VALUE=gql`
mutation UpdateServiceExampleValue($input:String!){
  updateServiceExampleValue(data: $input){
    id
    name
  }
}
`