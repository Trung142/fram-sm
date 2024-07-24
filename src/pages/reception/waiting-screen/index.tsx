import WaitingScreen from 'src/components/reception/WaitingScreen'
import WaitingScreenLayout from 'src/layouts/WaitingScreenLayout'

const WaitingScreenPage = () => {
  return <WaitingScreen />
}

WaitingScreenPage.getLayout = (page: any) => {
  const layoutStyle = {
    backgroundColor: '#171F30',
    height: '100vh',
    width: '100%'
  }

  return <WaitingScreenLayout style={layoutStyle}>{page}</WaitingScreenLayout>
}

export default WaitingScreenPage
