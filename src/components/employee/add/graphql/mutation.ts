import { gql } from '@apollo/client'

export const ADD_USER = gql`
  mutation AddUser($input: UserInput!) {
    addUser(data: $input) {
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
`
export const ADD_USER_ROLE = gql`
  mutation AddUserRole($input: UserRoleInput!) {
    addUserRole(data: $input) {
      clinicId
      createAt
      createBy
      id
      modifyAt
      modifyBy
      parentClinicId
      roleId
      userId
    }
  }
`
const DELETE_USER = gql`
  mutation updateUser($input: String!) {
    updateUser(data: $input) {
      id
      userName
    }
  }
`
