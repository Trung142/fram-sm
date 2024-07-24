import { DocumentNode, useLazyQuery } from "@apollo/client"
import { useCallback, useState } from "react"

export type QueryFnType = [any, (params: Record<string, any>) => Promise<any>]

const useGraphqlQuery = (query: DocumentNode, defaultValue = null): QueryFnType => {
  const [ getData ] = useLazyQuery(query)
  const [ processedData, setProcessedData ] = useState()

  const getProcessedData = useCallback(async (params: Record<string, any>) => {
    const data = await getData(params);
    const queryData: Record<string, any> = Object.values(data || {})[0] || {}
    setProcessedData(queryData.items)
    }, [getData, setProcessedData])

  return [processedData, getProcessedData]
}

export default useGraphqlQuery
