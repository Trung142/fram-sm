import { DocumentNode, OperationVariables, TypedDocumentNode, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'

export const useResExamData = (query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  const { data } = useQuery(query, {})
  return data?.getResExam?.items ?? []
}

export const useExploreObjectData = (query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  const [doiTuongKham, setDoiTuongKham] = useState(null)
  const { data } = useQuery(query, {})

  useEffect(() => {
    if (data?.getExploreObject?.items?.[0]?.name) {
      setDoiTuongKham(data.getExploreObject.items[0].name)
    }
  }, [data])

  return { exploreObjectData: data?.getExploreObject?.items ?? [], doiTuongKham }
}

export const usePatGroupData = (query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  const { data } = useQuery(query, {})
  return data?.getPatGroup?.items ?? []
}
