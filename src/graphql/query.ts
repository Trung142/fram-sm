import { gql } from "@apollo/client";

export const GET_PK = gql`
  query GetPk($tablename: String!) {
    getPk(tablename: $tablename)
  }
`;
