import { gql } from "@apollo/client";

export const UPDATE_PATIENT = gql`
mutation UpdatePatient($input: String!) {
  updatePatient(data: $input) {
    id
    name
    status
  }
}`;

export const UPDATE_SERVICE = gql`
  mutation updateService($input: String!) {
    updateService(data: $input) {
      id
      name
      gender
      bhytName
    }
  }
`