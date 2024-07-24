import ManHinhCho from 'src/components/examination/measure-vital-signs/manhinhcho'
import WaitingScreenLayout from 'src/layouts/WaitingScreenLayout'

const ManHinhChoPage = () => {
  return <ManHinhCho />
}

ManHinhChoPage.getLayout = (page: any) => {
  const layoutStyle = {
    backgroundColor: '#171F30',
    height: '100vh',
    width: '100%'
  }

  return <WaitingScreenLayout style={layoutStyle}>{page}</WaitingScreenLayout>
}

export default ManHinhChoPage
