import { gql } from '@apollo/client'

export const DELETE_USER = gql`
  mutation UpdateUser($input: String!) {
    updateUser(data: $input) {
      id
    }
  }
`
