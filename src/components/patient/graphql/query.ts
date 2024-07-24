import { gql } from "@apollo/client";


export const GET_PATEINT = gql`
query GetPatient($input: PatientFilterInput, $skip: Int, $take: Int) {
  getPatient(
    where: $input
    skip: $skip
    take: $take
    order: {createAt: DESC}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      name
      phone
      patCccd
      patBhyt
      birthday
      age
      monthsOld
      gender
      status
      address
      patGroupId
      patTypeId
      presenterId
      oldPlaceTreatmentId
      startDate
      endDate
      personalMedHistory
      familyMedHistory
      personalAllergicHistory
      otherDisease
      note
      email
      taxId
      ethnicId
      nationId
      cityId
      districtId
      wardId
      jobId
      workPlace
      famlilyName
      relationshipId
      famlilyPhone
      famlilyCccd
      urlImage
    }
  }
}
`;

export const GET_PAT_GROUP = gql`
  query{
    getPatGroup {
      items {
        id
        label: name
      }
    }
  }
`;

export const GET_PAT_TYPE = gql`
  query{
    getPatType {
      items {
        id
        label: name
      }
    }
  }
`;

export const GET_SEARCH_DATA = gql`
query{
  user: getUser {
    items {
      id
      lastName
      fristName
    }
  }
  patGroup: getPatGroup {
    items {
      id
      label: name
      note
    }
  }
  patType: getPatType {
    items {
      id
      label: name
    }
  }
  ethnic: getEthnic {
    items {
      id
      label: name
    }
  }
  nation: getNation {
    items {
      id
      label: name
    }
  }
  city: getCity {
    items {
      id
      label: name
    }
  }
  district: getDistrict {
    items {
      id
      label: name
    }
  }
  ward: getWard {
    items {
      id
      label: name
    }
  }
  job: getJob {
    items {
      id
      label: name
    }
  }
  relationship: getRelationship {
    items {
      id
      label: name
    }
  }
  patient: getPatient {
    items {
      id
      label: name
    }
  }
  oldPlaceTreatment: getOldPlaceTreatment {
    items {
      id
      label: name
    }
  }
}`;
