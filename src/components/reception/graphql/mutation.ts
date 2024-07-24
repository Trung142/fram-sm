import { gql } from '@apollo/client'

export const ADD_PATIENT = gql`
  mutation AddPatient($input: PatientInput!) {
    addPatient(data: $input) {
      id
      name
    }
  }
`

export const ADD_RES_EXAM = gql`
  mutation AddResExam($input: ResExamInput!) {
    addResExam(data: $input) {
      id
    }
  }
`

export const ADD_APPOINTMENT_SCHEDULE = gql`
  mutation AddAppointSchedule($input: AppointScheduleInput!) {
    addAppointSchedule(data: $input) {
      id
    }
  }
`

export const ADD_RES_EXAM_SERVICE_DT = gql`
  mutation AddResExamServiceDt($input: ResExamServiceDtInput!) {
    addResExamServiceDt(data: $input) {
      id
    }
  }
`

export const UPDATE_APPOINTMENT_SCHEDULE = gql`
  mutation UpdateAppointSchedule($input: String!) {
    updateAppointSchedule(data: $input) {
      id
    }
  }
`

export const UPDATE_RES_EXAM = gql`
  mutation UpdateResExam($input: String!) {
    updateResExam(data: $input) {
      id
    }
  }
`

export const DELETE_APPOINTMENT_SCHEDULE = gql`
  mutation DeleteAppointSchedule($input: String!) {
    deleteAppointSchedule(id: $input) {
      id
    }
  }
`
