export type RequestType = {
    keySearch: string
    skip: number
    take: number
}

export type WareHouseType = {
    id?: string
    name?: string
    phone?: string
    email?: string
    address?: string
    clinicId?: string
    warehouseTypeId?: string
    parentClinicId?: string
    deleteYn?: boolean
}
