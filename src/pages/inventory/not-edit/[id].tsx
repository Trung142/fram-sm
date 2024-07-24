import React, { useState, useEffect, useMemo, useRef } from 'react'
import NotEditWhExistence from 'src/components/inventory/ip_inventory/not-edit'
import { useRouter } from 'next/router'

const EditWhExistencePage = () => {
  const router = useRouter()
  console.log(router.query.id)

  return <NotEditWhExistence data={router.query.id} />
}
export default EditWhExistencePage
