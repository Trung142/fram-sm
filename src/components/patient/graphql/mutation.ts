import { gql } from "@apollo/client";

export const ADD_PATIENT = gql`
mutation AddPatient($input: PatientInput!) {
  addPatient(data: $input) {
    id
    name
  }
}`;

export const UPDATE_PATIENT = gql`
mutation UpdatePatient($input: String!) {
  updatePatient(data: $input) {
    id
    name
    status
  }
}`;
