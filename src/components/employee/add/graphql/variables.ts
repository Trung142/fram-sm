export type AddEmployeeVariables = {
  address?: string
  bod?: string
  branchesId?: string
  clinicId?: string
  createBy?: string
  departmentId?: string
  email?: string
  fristName?: string
  gender?: number
  id?: string
  isParentClinic?: string
  lastName?: string
  modifyAt?: Date
  modifyBy?: string
  parentClinicId?: string
  password?: string
  phone?: number
  practicingCertificate?: string
  specialistId?: string
  status?: boolean
  userCccd?: string
  userName?: string
  userTypeId?: string
  userVneid?: string
}

export type AddUserRole = {
  clinicId?: string
  createAt?: Date
  createBy?: string
  id?: string
  modifyAt?: Date
  modifyBy?: string
  parentClinicId?: string
  roleId?: string
  userId?: string
}
