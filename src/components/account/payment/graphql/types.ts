export interface ExpandedCardState {
  [key: string]: boolean
}

export interface Examination {
  id?: string | null
  appointmentTypeId?: string | null
  gender?: number | null
  dob?: Date | null
  age?: number | null
  monthsOld?: number | null
  patId?: string | null
  year?: number | null
  email?: string | null
  phone?: string | null
  appointmentDate?: string | null
  appointScheduleId?: string | null
  reasonExam?: string | null
  scheduleContent?: string | null
  receptionistId?: string | null
  presenterId?: string | null
  doctorId?: string | null
  patName?: string | null
  parentName?: string | null
  relationshipId?: string | null
  parentPhone?: string | null
  patCccd?: string | null
  address?: string | null
  patGroup?: string | null
  body?: string | null
  part?: string | null
  medHistory?: string | null
  personalMedHistory?: string | null
  familyMedHistory?: string | null
  otherDisease?: string | null
  personalAllergicHistory?: string | null
  familyAllergicHistory?: string | null
  paulse: number
  breathingRate: number
  temperature: number
  bp1: number
  bp2: number
  weight: number
  height: number
  bmi: number
  patGroupId?: string | null
  departmentId?: string | null
  oldPlaceTreatmentId?: string | null
  startDate?: Date | null
  endDate?: Date | null
  fiveYearFullDate?: Date | null
  exploreObjectsId?: string | null
  patBhyt?: string | null
  benefitLevelId?: string | null
  glandTypeId?: string | null
  areaId?: string | null
  fromInsuranceId?: string | null
  swElseComeId?: string | null
  clinicId?: string
  parentClinicId?: string
  createAt?: Date
  fristDayOfLastPeriod?: string | null
  dateOfConception?: string | null
}

export interface RegisterExamination {
  appointmentTypeId?: string | null
  gender?: number | null
  dob?: Date | null
  age?: number | null
  monthsOld?: number | null
  patId?: string | null
  year?: number | null
  email?: string | null
  phone?: string | null
  appointmentDate?: string | null
  reasonExam?: string | null
  scheduleContent?: string | null
  receptionistId?: string | null
  presenterId?: string | null
  doctorId?: string | null
  patName?: string | null
  parentName?: string | null
  relationshipId?: string | null
  parentPhone?: string | null
  patCccd?: string | null
  address?: string | null
  patGroup?: string | null
  body?: string | null
  part?: string | null
  medHistory?: string | null
  personalMedHistory?: string | null
  familyMedHistory?: string | null
  otherDisease?: string | null
  personalAllergicHistory?: string | null
  familyAllergicHistory?: string | null
  paulse: number
  breathingRate: number
  temperature: number
  bp1: number
  bp2: number
  weight: number
  height: number
  bmi: number
  patGroupId?: string | null
  departmentId?: string | null
  oldPlaceTreatmentId?: string | null
  startDate?: Date | null
  endDate?: Date | null
  fiveYearFullDate?: Date | null
  exploreObjectsId?: string | null
  patBhyt?: string | null
  benefitLevelId?: string | null
  glandTypeId?: string | null
  areaId?: string | null
  fromInsuranceId?: string | null
  swElseComeId?: string | null
}
export interface RegisterAppointmentExamination {
  age?: number | null
  appointmentDate?: Date | null
  appointmentTypeId?: string | null
  clinicId?: string | null
  dob?: Date | null
  doctorId?: string | null
  email?: string | null
  gender?: number | null
  monthsOld?: number | null
  note?: string | null
  parentClinicId?: string | null
  patId?: string | null
  patName?: string | null
  phone?: string | null
  presenterId?: string | null
  reasonExam?: string | null
  receptionistId?: string | null
  scheduleContent?: string | null
  year?: number | null
  status?: string | null
  address?: string | null
}

export type Service = {
  __typename: string
  id: string | null
  name?: string | null
  price?: number | null
  bhytId?: string | null
  bhytPrice?: number | null
  bhytName?: string | null
  chooseSpecIndex?: boolean | null
  clinicId?: string | null
  cost?: number | null
  createAt?: string | null
  createBy?: string | null
  describe?: string | null
  gender?: number | null
  insurancePaymentRate?: number | null
  serviceGroupId?: string | null
  serviceTypeId?: string | null
  status?: boolean | null
  quantity?: number | null
  departmentId?: string | null
}

export type ServiceGroup = {
  name?: string
  serviceGroupId: string
  services: Service[]
}

export type ResExamServiceDt = {
  serviceId?: string | null
  resExamId?: string | null
  departmentId?: string | null
  quantity?: number | null
  note?: string | null
  status?: string | null
  paymentStatus?: boolean | null
  clinicId?: string | null
  parentClinicId?: string | null
  deleteYn?: boolean | null
  bhytYn?: boolean | null
  createAt?: Date | null
  freeYn?: boolean | null
  price?: number | null
  totalPrice?: number | null
}

export type Payment = {
  id?: string | null
  actuallyReceivedAmount?: number | null
  bhytAmount?: number | null
  clinicId?: string | null
  couponAmount?: number | null
  createAt?: Date | null
  createBy?: string | null
  debtAmount?: number | null
  discountAmount?: number | null
  finalPrice?: number | null
  note?: string | null
  orderId?: string | null
  parentClinicId?: string | null
  patName?: string | null
  paymentDate?: Date | null
  paymentTypeId?: string | null
  promotionAmount?: number | null
  resExamId?: string | null
  resExamServiceId?: string | null
  status?: string | null
  totalAmount?: number | null
  vatAmount?: number | null
  seller?: string | null
  paymentDts?: PaymentDt[]
}

export type PaymentDt = {
  id?: string | null
  resExamServiceId?: string | null
  actuallyReceivedAmount?: number | null
  bhytAmount?: number | null
  clinicId?: string | null
  couponAmount?: number | null
  createAt?: Date | null
  createBy?: string | null
  debtAmount?: number | null
  discountAmount?: number | null
  finalPrice?: number | null
  note?: string | null
  orderId?: string | null
  parentClinicId?: string | null
  serviceId?: string | null
  patName?: string | null
  paymentDate?: Date | null
  promotionAmount?: number | null
  status?: string | null
  totalAmount?: number | null
  vatAmount?: number | null
}
