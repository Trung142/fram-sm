import { gql } from "@apollo/client";

export const UPDATE_RES_EXAM = gql`
mutation UpdateResExam($input: String!) {
  updateResExam(data: $input) {
    id
    stt
    status
    patId
    patName
  }
}`;
