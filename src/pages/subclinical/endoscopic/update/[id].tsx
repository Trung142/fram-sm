import { useSearchParams } from 'next/navigation'
import React from 'react'
import EndoscopicProc from 'src/components/subclinical/endoscopic/service_index_proc'


const EndoscopicProcPage = () => {
    const params = useSearchParams()
    const id = params.get('id')
  return <EndoscopicProc id={id as string}/>
}

export default EndoscopicProcPage