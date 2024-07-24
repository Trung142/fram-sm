import React from 'react'
import EditWhExistence from 'src/components/inventory/ip_inventory/EditWhExistence'
import { useSearchParams } from 'next/navigation'

const EditWhExistencePage = () => {
  const params = useSearchParams()
  const id = params.get('id')
  console.log('id', id)

  return <EditWhExistence data={id as string} />
}
export default EditWhExistencePage
