import Reception from 'src/components/reception'
import MutationProvider from 'src/components/reception/MutationProvider'
import QueryProvider from 'src/components/reception/QueryProvider'

const ReceptionPage = () => {
  return (
    <MutationProvider>
      <QueryProvider>
        <Reception />
      </QueryProvider>
    </MutationProvider>
  )
}

export default ReceptionPage
