import { useSearchParams } from 'next/navigation'
import React from 'react'
import CTProc from 'src/components/subclinical/ct-scan/service_index_proc'


const CTProcPage = () => {
    const params = useSearchParams()
    const id = params.get('id')
  return <CTProc id={id as string}/>
}

export default CTProcPage