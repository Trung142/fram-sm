import { useSearchParams } from 'next/navigation'
import React from 'react'
import EditInventoryCheck from 'src/components/inventory/inventory_check/EditInventoryCheck'


const EditInventoryCheckPage = () => {
    const params = useSearchParams()
    const id = params.get('id')
  
    return id ? <EditInventoryCheck id={id as string} /> : null
}

export default EditInventoryCheckPage