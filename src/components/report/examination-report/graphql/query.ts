import { gql } from "@apollo/client";

export const GET_RES_EXAM=gql`
query GetResExam($input:ResExamFilterInput, $skip: Int, $take: Int){
    getResExam(
      where: $input
      skip: $skip
      take: $take
      order: {createAt: DESC}
    ){
      totalCount
      items{
        id 
        createAt
        status
        resExamServiceDts{
          totalPrice
        }
        prescriptions{
            status
            deleteYn
            prescriptionDts{
                totalPrice
            }
        }
        pat{
            gender
            id
            name
            phone
            birthday
            age
            patGroup{
                id
                name
            }
        }
        exploreObjects{
            id
            name
        }
        doctor{
            id
            fristName
            lastName
        }
        serviceIndexProcs{
            diagnostic
            symptom
        }
    }
    }
  }   
`
export const GET_PATIENT = gql`
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
      startDate
            endDate
            patType{
                id
                name
            }
            patGroup{
                id
                name
            }
            reasonExam
    }
  }
}
`

export const GET_EXPLORE_OBJECT=gql`
query{
    getExploreObject{
      items{
        id
        label: name
      }
    }
  }
`
