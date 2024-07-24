// ** React Imports
import { useRouter } from 'next/router'
import ResExamUpdate from 'src/components/examination/res_exam_update'
import { useSearchParams } from 'next/navigation'

const ResExamUpdatePage = () => {
  const params = useSearchParams()
  const id = params.get('id')

  return id ? <ResExamUpdate id={id as string} /> : null
}
export default ResExamUpdatePage
