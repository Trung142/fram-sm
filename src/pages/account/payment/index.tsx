// ** React Imports
import Payment from 'src/components/account/payment'
import MutationProvider from 'src/components/account/payment/MutationProvider'
import QueryProvider from 'src/components/account/payment/QueryProvider'

const PaymentPage = () => {
  return (
    <QueryProvider>
      <MutationProvider>
        <Payment />
      </MutationProvider>
    </QueryProvider>
  )
}
export default PaymentPage
