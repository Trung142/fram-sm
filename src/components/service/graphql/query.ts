import { gql } from '@apollo/client'

export const GET_SERVICE_QUERY = gql`
query getServiceQuery($input: ServiceFilterInput, $skip: Int, $take: Int) {
  getService(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
    ) {
    totalCount
    items {
      id
      status
      name
      serviceGroup {
        id
        name
        note
      }
      serviceType {
        id
        label: name
      }
      price
      bhytPrice
      gender
      status
      unitId
      argeeBhyt
      agreeLis
      cost
      price
      bhytId
      bhytName
      insurancePaymentRate
      bhytPrice
      surchargePrice
      describe
      groupSubclinical
      chooseSpecIndex
      clinicId
      parentClinicId
      deleteYn
      departmentId
    }
  }
}
`

export const GET_SERVICE_TYPE = gql`
  query {
    getServiceType(where: { deleteYn: { eq: false } }) {
      items {
        id
        label: name
      }
    }
  }
`

export const GET_SERVICE_GROUP = gql`
  query {
    getServiceGroup(
      where: { deleteYn: { eq: false } }
      order: {createAt: ASC}
    ) {
      items {
        id
        label: name
      }
    }
  }
`
export const GET_SEARCH_DATA = gql`
query {
  getServiceType(where: { deleteYn: { eq: false } }) {
    items {
      id
      label: name
    }
  }
  getServiceGroup(where: { deleteYn: { eq: false } }) {
    items {
      id
      label: name
    }
  }
}
`
export const GET_GROUP_DATA = gql`
query{
  getService{
    items{
      id
      serviceGroup{
        id
        label:name
        note
      }
      serviceType{
        id
        label:name
      }
    }
  }
}
`
export const GET_SERVICE_INDEX = gql`
query GetServiceIndex($input: ServiceIndexFilterInput!){
  getServiceIndex(where: $input){
    items{
      id
      name
      indexType{
        name
      }
      normalIndex
      fatherIndex
      subIndex
      price
      cost
      unit
      referenceValue
      defaultValue
      serviceId
      testers
    }
  }
}
`
export const GET_INDEX_TYPE = gql`
query{
  getIndexType{
    items{
      id
      label:name
    }
  }
}
`

export const GET_SERVICE_INDEX_PROCS = gql`
query GetSeriveIndexProc($input:ServiceIndexProcFilterInput!) {
  getServiceIndexProc (
    where: $input 
    order: {createAt: ASC}
    ){
    items{
      id
      serviceIndexId
      serviceId
      serviceIndex{
        id
        referenceValue
        defaultValue
        unit
        testers
        indexTypeId
        normalIndex
        fatherIndex
        subIndex
        cost
        price
        rowIndex
        deleteYn
        indexType{
          id
          name
        }
        }
      service{
        id
        name
        cost
        price
      }
      }
    }
  }
`

export const GET_CONSUM_PRODUCT = gql`
query GetConSumProduct($input:ConsumProductFilterInput!){
  getConsumProduct(where: $input){
    items{
      id
      serviceId
      name
      quantity
      unit
      productId
      product{
        id
        productName
        ingredients
        price
        specifications
        whExistenceDts{
          totalRemaining
        }
      }
    }
  }
}
`

export const GET_COM_REFER_VALUE = gql`
query GetComReferValue($input:ComReferValueFilterInput){
  getComReferValue(
    where:$input
    order: {createAt: DESC}){
    items{
      fromAge
      toAge
      greatestValue
      smallestValue
      male
      female
      deleteYn
      byAge
      id
      allgender
      allAge
    }
  }
}
`
export const GET_PRODUCT = gql`
query GetProduct($input:ProductFilterInput){
  getProduct(where: $input){
    items{
      id
      productName
      ingredients
      price
      specifications
      cansales{
        totalRemaining
      }
      unit{
        name
      }
    }
  }
}
`

export const GET_UNIT=gql`
query{
  getUnit{
    items{
      id
      label:name
    }
  }
}
`

export const GET_SERVICE_EXAMPLE_VALUE=gql`
query GetServiceExampleValue($input:ServiceExampleValueFilterInput){
  getServiceExampleValue(where: $input){
    items{
      id
      name
      serviceId
      description
      valueExample
    }
  }
}
`
export const GET_DEPARTMENT=gql`
query{
  getDepartment{
    items{
      id
      label:name
    }
  }
}
`


