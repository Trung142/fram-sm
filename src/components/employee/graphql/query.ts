import { gql } from '@apollo/client'

export const GET_USER = gql`
  query getUser($input: UserFilterInput, $skip: Int, $take: Int) {
    getUser(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        address
        bod
        branchesId
        clinicId
        createAt
        createBy
        departmentId
        email
        fristName
        gender
        id
        isParentClinic
        lastName
        modifyAt
        modifyBy
        parentClinicId
        password
        phone
        practicingCertificate
        specialistId
        status
        userCccd
        userName
        userTypeId
        userVneid
      }
    }
  }
`

export const GET_CLINIC = gql`
  query getClinic($input: ClinicFilterInput, $skip: Int, $take: Int) {
    getClinic(where: $input, skip: $skip, take: $take, order: { createAt: ASC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        address
        city {
          name
        }
      }
    }
  }
`

export const GET_ROLE = gql`
  query getRole($input: RoleFilterInput, $skip: Int, $take: Int) {
    getRole(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        name
      }
    }
  }
`
export const GET_USER_ROLE = gql`
  query getUserRole($input: UserRoleFilterInput, $skip: Int, $take: Int) {
    getUserRole(where: $input, skip: $skip, take: $take, order: { createAt: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        clinicId
        createAt
        createBy
        id
        modifyAt
        modifyBy
        parentClinicId
        roleId
        userId
        role {
          name
        }
      }
    }
  }
`
