import { useSearchParams } from 'next/navigation'
import React from 'react'
import EditEpTransfer from 'src/components/inventory/ep_transfer/EditEpTransfer'

const EditEpTransferPage = () => {
    const params = useSearchParams()
    const id = params.get('id')
  
    return id ? <EditEpTransfer id={id as string} /> : null
}

export default EditEpTransferPage