export type PatientInput = {
  id?: string;
  name?: string;
  phone?: string;
  patCccd?: string;
  patBhyt?: string;
  birthday: string;
  age: number;
  monthsOld: number;
  gender?: number;
  status?: boolean;
  address?: string;
  patGroupId?: string;
  patTypeId?: string;
  presenterId?: string;
  oldPlaceTreatmentId?: string;
  startDate: string;
  endDate: string;
  personalMedHistory?: string;
  familyMedHistory?: string;
  personalAllergicHistory?: string;
  otherDisease?: string;
  note?: string;
  email?: string;
  taxId?: string;
  ethnicId?: string;
  nationId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  jobId?: string;
  workPlace?: string;
  famlilyName?: string;
  relationshipId?: string;
  famlilyPhone?: string;
  famlilyCccd?: string;
  patImages?: PatImage[];
  urlImage?: string;
  clinicId?:string;
  parentClinicId?:string;
}

export type PatImage = {
  id?: string;
  urlImage?: string;
}
