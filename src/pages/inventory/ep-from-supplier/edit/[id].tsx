import React, { useState, useEffect, useMemo, useRef } from 'react'

import EditWhReturnSup from 'src/components/inventory/ep_from_supplier/EditWhReturnSup'
import { useSearchParams } from 'next/navigation'

const EditWhReturnSupplierPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return id ? <EditWhReturnSup id={id as string} /> : null
}
export default EditWhReturnSupplierPage
