import { useSearchParams } from 'next/navigation'
import React from 'react'
import MicroSurgeryProc from 'src/components/subclinical/micro-surgery/service_index_proc'

const MicroSurgeryProcPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return <MicroSurgeryProc id={id as string}/>
}

export default MicroSurgeryProcPage
