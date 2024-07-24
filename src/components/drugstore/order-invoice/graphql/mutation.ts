import { gql } from "@apollo/client";

export const UPDATE_ORDER = gql`
mutation updateOrder($input: String!) {
    updateOrder(data: $input) {
      id
      status
      deleteYn
    }
  }
`