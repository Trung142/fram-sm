import { Box, Dialog, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import MUIDialog from 'src/@core/components/dialog'

type props = {
  printType:
    | 'p_res_exam_bill_id'
    | 'p_order_id'
    | 'p_prescription_id'
    | 'p_res_ex_id'
    | 'p_res_id'
    | 'p_wh_existence_id'
    | 'p_wh_exp_cancel_id'
    | 'p_wh_import_sup_id'
    | 'p_wh_other_exp_id'
    | 'p_wh_return_sup_id'
    | 'p_res_service_id'
  printFunctionId: string
  printTypeId: string
  clinicId: string
  parentClinicId: string
  openPrint: boolean
  setOpenButtonDialog: any
  titlePrint: string
}
export default function PrintsComponent({
  printFunctionId,
  printType,
  printTypeId,
  clinicId,
  parentClinicId,
  openPrint,
  setOpenButtonDialog,
  titlePrint
}: props) {
  const [pdfUrl, setPdfUrl] = useState<string>('')

  const handlePrint = async () => {
    try {
      const response = await fetch('http://gateway.kalendula.vn/clinic-print/Print/Print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          printFunctionId: printFunctionId,
          paramList: {
            [printType]: printTypeId,
            p_cl_id: clinicId,
            p_parent_cl_id: parentClinicId
          }
        })
      })

      if (!response.ok) {
        toast.error('Đã có lỗi, Không thể mở file In')
        setOpenButtonDialog(false)
      }

      const blob = await response.blob()
      const pdfUrl = URL.createObjectURL(blob)
      setPdfUrl(pdfUrl)
    } catch (error) {
      toast.error('Không tìm thấy dữ liệu để thực hiện in ấn')
    }
  }

  useEffect(() => {
    if (openPrint) {
      handlePrint()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPrint])

  return (
    <MUIDialog maxWidth='lg' open={[openPrint, setOpenButtonDialog]} title={titlePrint}>
      <Box>
        {pdfUrl ? (
          <iframe src={pdfUrl} style={{ width: '100%', minHeight: '600px' }}></iframe>
        ) : (
          <Box sx={{ height: '200px' }}>
            <Typography textAlign='center' sx={{ lineHeight: '200px' }}>
              Đang lấy data...
            </Typography>
          </Box>
        )}
      </Box>
    </MUIDialog>
  )
}
