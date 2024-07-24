import { useSearchParams } from 'next/navigation'
import React from 'react'
import OtherServiceProc from 'src/components/subclinical/other-service/service_index_proc'

const OtherServiceProcPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return <OtherServiceProc id={id as string}/>
}

export default OtherServiceProcPage
