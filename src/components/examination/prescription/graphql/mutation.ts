import { gql } from "@apollo/client";

export const UPDATE_PRESCRIPTION = gql`
mutation updatePrescription ($input: String!) {
    updatePrescription(data: $input) {
      id
      statusSignOnline
    }
}`