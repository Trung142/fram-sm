import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import EditWhImportSup from 'src/components/inventory/ip_from_supplier/EditWhImportSup'
import { useSearchParams } from 'next/navigation'

const EditWhImportSupplierPage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return id ? <EditWhImportSup id={id as string} /> : null
}
export default EditWhImportSupplierPage
