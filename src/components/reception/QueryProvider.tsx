import { useQuery } from '@apollo/client'
import { createContext, PropsWithChildren, useState } from 'react'
import * as queries from './graphql/query'

type QueryCtxKey =
  | 'getResExamData'
  | 'refetchResExam'
  | 'getExploreObject'
  | 'getPatGroupData'
  | 'getDepartmentData'
  | 'getUserData'
  | 'getServiceData'
  | 'getRelationshipData'
  | 'getBenefitLevelData'
  | 'getAreaData'
  | 'getFromInsuranceData'
  | 'getGlandTypeData'
  | 'getOldPlaceTreatmentData'
  | 'getServiceGroup'
  | 'getAppointSchedule'
  | 'toggleTriggerRefetchData'
  | 'triggerRefetchData'
  | 'refetchAppointSchedule'
type QueryCtx = Record<QueryCtxKey, any>

export const QueryContext = createContext<Partial<QueryCtx>>({})

const QueryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: getResExamData, refetch: refetchResExam } = useQuery(queries.GET_RES_EXAM, {})
  const { data: getExploreObject } = useQuery(queries.GET_EXPLORE_OBJECT, {})
  const { data: getPatGroupData } = useQuery(queries.GET_PAT_GROUP, {})
  const { data: getDepartmentData } = useQuery(queries.GET_DEPARTMENT, {})
  const { data: getUserData } = useQuery(queries.GET_USER, {})
  const { data: getServiceData } = useQuery(queries.GET_SERVICE, {})
  const { data: getRelationshipData } = useQuery(queries.GET_RELATIONSHIP, {})
  const { data: getBenefitLevelData } = useQuery(queries.GET_BENEFIT_LEVEL, {})
  const { data: getAreaData } = useQuery(queries.GET_AREA, {})
  const { data: getFromInsuranceData } = useQuery(queries.GET_FROM_INSURANCE, {})
  const { data: getGlandTypeData } = useQuery(queries.GET_GLAND_TYPE, {})
  const { data: getOldPlaceTreatmentData } = useQuery(queries.GET_OLD_PLACE_TREATMENT, {})
  const { data: getServiceGroup } = useQuery(queries.GET_SERVICE_GROUP, {})
  const { data: getAppointSchedule, refetch: refetchAppointSchedule } = useQuery(queries.GET_APPOINT_SCHEDULE, {})

  const [triggerRefetchData, setTriggerRefetchData] = useState(false)

  const toggleTriggerRefetchData = () => {
    setTriggerRefetchData((prev: any) => !prev)
  }

  const initialValue: QueryCtx = {
    getResExamData,
    refetchResExam,
    refetchAppointSchedule,
    getExploreObject,
    getPatGroupData,
    getDepartmentData,
    getUserData,
    getServiceData,
    getRelationshipData,
    getBenefitLevelData,
    getAreaData,
    getGlandTypeData,
    getFromInsuranceData,
    getOldPlaceTreatmentData,
    getServiceGroup,
    getAppointSchedule,
    triggerRefetchData,
    toggleTriggerRefetchData
  }

  return <QueryContext.Provider value={initialValue}>{children}</QueryContext.Provider>
}

export default QueryProvider
