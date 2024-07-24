import { gql } from "@apollo/client";

export const UPDATE_SERVICE_INDEX = gql`
  mutation UpdateServiceIndex($input: String!) {
    updateServiceIndex(data: $input) {
      id
      name
      defaultValue
      referenceValue
      testers
    }
  }
`;

export const UPDATE_SERVICE_INDEX_PROC = gql`
  mutation UpdateServiceIndexProc($input: String!) {
    updateServiceIndexProc(data: $input) {
      id
      note
    }
  }
`;
