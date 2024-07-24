import { useSearchParams } from 'next/navigation'
import React from 'react'
import EcgProc from 'src/components/subclinical/ecg/service_index_proc'

const EcgProcPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return <EcgProc id={id as string}/>
}

export default EcgProcPage
