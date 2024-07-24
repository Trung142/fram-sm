import { Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
type Props = {
  width?: string
  height?: string
  pictureCount: number
  imageSrc: [any[], React.Dispatch<React.SetStateAction<any[]>>]
}
const AllCamera = (props: Props) => {
  const videoConstraints = {
    width: props.width ?? 500,
    height: props.height ?? 300
  }
  const webcamRef = useRef<any>(null)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    props.imageSrc[1]((prev: any[]) => [{ src: imageSrc, checked: false }, ...prev])
  }, [webcamRef])
  useEffect(() => {
    if (props.pictureCount !== 0) {
      capture()
    }
  }, [props.pictureCount])
  return (
      <Webcam
        audio={false}
        ref={webcamRef}
        imageSmoothing
        width={'100%'}
        height={props.height}
        screenshotFormat='image/jpeg'
        // videoConstraints={videoConstraints}
      />
  )
}
export default AllCamera
