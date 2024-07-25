import { gql } from '@apollo/client'
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

export const GET_EXAM_DEFAULT_TYPE = gql`
  query getExamDefaultType($input: ExamDefaultTypeFilterInput, $skip: Int, $take: Int) {
    getExamDefaultType(where: $input, skip: $skip, take: $take, order: { createAt: ASC }) {
      totalCount
      items {
        id
        clinicId
        name
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
        name
        city {
          name
        }
      }
    }
  }
`
