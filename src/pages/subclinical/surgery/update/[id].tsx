import { useSearchParams } from 'next/navigation'
import React from 'react'
import SurgeryProc from 'src/components/subclinical/surgery/service_index_proc'

const SurgeryProcPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return <SurgeryProc id={id as string}/>
}

export default SurgeryProcPage
