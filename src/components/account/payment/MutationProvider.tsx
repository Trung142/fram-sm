import React from 'react'
import { useMutation } from '@apollo/client'
import { createContext, PropsWithChildren } from 'react'
import {
  ADD_APPOINTMENT_SCHEDULE,
  ADD_PATIENT,
  ADD_RES_EXAM,
  UPDATE_APPOINTMENT_SCHEDULE,
  DELETE_APPOINTMENT_SCHEDULE,
  ADD_RES_EXAM_SERVICE_DT,
  UPDATE_RES_EXAM
} from './graphql/mutation'

type MutationCtxKey =
  | 'addResExam'
  | 'addPatient'
  | 'addAppointmentSchedule'
  | 'updateAppointSchedule'
  | 'deleteAppointSchedule'
  | 'addResExamServiceDt'
  | 'updateResExam'
type MutationCtx = Record<MutationCtxKey, any>

export const MutationContext = createContext<Partial<MutationCtx>>({})

const MutationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [addResExam, {}] = useMutation(ADD_RES_EXAM)
  const [addPatient, {}] = useMutation(ADD_PATIENT)
  const [addAppointmentSchedule] = useMutation(ADD_APPOINTMENT_SCHEDULE, {})
  const [updateAppointSchedule] = useMutation(UPDATE_APPOINTMENT_SCHEDULE, {})
  const [deleteAppointSchedule] = useMutation(DELETE_APPOINTMENT_SCHEDULE, {})
  const [addResExamServiceDt] = useMutation(ADD_RES_EXAM_SERVICE_DT, {})
  const [updateResExam] = useMutation(UPDATE_RES_EXAM, {})

  const initialValue: MutationCtx = {
    addPatient,
    addResExam,
    addAppointmentSchedule,
    updateAppointSchedule,
    deleteAppointSchedule,
    addResExamServiceDt,
    updateResExam
  }
  return <MutationContext.Provider value={initialValue}>{children}</MutationContext.Provider>
}

export default MutationProvider
