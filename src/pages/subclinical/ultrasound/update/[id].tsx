import { useSearchParams } from 'next/navigation'
import React from 'react'
import UltraSoundProc from 'src/components/subclinical/ultrasound/service_index_proc'

const UltraSoundProcPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return <UltraSoundProc id={id as string}/>
}

export default UltraSoundProcPage
