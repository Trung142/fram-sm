import { useSearchParams } from 'next/navigation'
import React from 'react'
import XRayProc from 'src/components/subclinical/xray/service_index_proc'

const XRayProcPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return <XRayProc id={id as string}/>
}

export default XRayProcPage
