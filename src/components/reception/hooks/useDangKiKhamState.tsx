import { useState } from "react"

const useDangKiKhamState = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  })

  return  {
    paginationModel
  } as const
}

export default useDangKiKhamState
