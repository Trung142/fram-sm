export type ResExamInput = {
  id?: string;
  resExamId?: string;
  patId?: string;
  patName?: string;
  gender?: number;
  dob?: string;
  year?: number;
  age?: number;
  paulse?: number;
  breathingRate?: number;
  temperature?: number;
  bp1?: number;
  bp2?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  body?: string;
  reasonExam?: string;
  personalMedHistory?: string;
  familyMedHistory?: string;
  personalAllergicHistory?: string;
  otherDisease?: string;
  medHistory?: string;
  part?: string;
  diagnosticId?: string;
  address?: string;
  createAt?: string;
  status?: string;
  exploreObjects?: {
    id?: string;
    name?: string
  }
  doctor?: {
    id?: string;
    userName?: string;
    fristName?: string;
    lastName?: string;
  }

  diagnostics?: {
    id?: string;
    idCode1?: string;
    idCode2?: string;
    idCode3?: string;
    idCode4?: string;
    idCode5?: string;
    clsSummary?: string;
    diagnose?: string;
    treatments?: string;
    examResultsId?: string;
    examTypeId?: string;
    advice?: string;
    checkAgainLater?: number;
    dateReExam?: Date;
    diseaseProgression?: string;
  }
  diagnostic?: {
    id?: string;
    idCode1?: string | null;
    idCode2?: string | null;
    idCode3?: string | null;
    idCode4?: string | null;
    idCode5?: string | null;
    idCode6?: string | null;
    idCode7?: string | null;
    idCode8?: string | null;
    idCode9?: string | null;
    idCode10?: string | null;
    idCode11?: string | null;
    idCode12?: string | null;
    clsSummary?: string;
    diagnose?: string;
    treatments?: string;
    examResultsId?: string;
    examTypeId?: string;
    advice?: string;
    checkAgainLater?: number;
    dateReExam?: Date;
    diseaseProgression?: string;

  }
}
