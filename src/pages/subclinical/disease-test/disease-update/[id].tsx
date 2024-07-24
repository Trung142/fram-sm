// ** React Imports
import { useRouter } from 'next/router'
import XetNghiemProc from 'src/components/subclinical/disease-test/service_index_proc'
import { useSearchParams } from 'next/navigation'

const ResExamUpdatePage = () => {
  const route = useRouter()
  // const { id } = route.query;
  const params = useSearchParams()
  const id = params.get('id')

  return id ? <XetNghiemProc id={id as string} /> : null
}
export default ResExamUpdatePage
