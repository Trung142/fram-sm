import { gql, useLazyQuery, useQuery } from "@apollo/client";
import moment from "moment";
import { useState } from "react";

const GET_PREFIX = gql`
query GetPrefix($tableName: String) {
  getPkPrefix(
    where: {tableName: {eq: $tableName}}
  ) {
    items {
      id
      tableName
      prefixName
      note
    }
  }
}
`;
export type PrefixData = {
  id?: string;
  tableName?: string;
  prefixName?: string;
  note?: string;
};

export const usePrefix = (tableName: string) => {
  const [prefix, setPrefix] = useState<PrefixData | null>(null);
  const { data } = useQuery(GET_PREFIX, {
    variables: {
      tableName: tableName,
    },
    onCompleted: (x) => {
      console.log("data", x);
      if (x?.getPkPrefix?.items?.length > 0) {
        setPrefix(x.getPkPrefix?.items[0] as PrefixData);
      }
      else {
        setPrefix(null);
      }
    }
  });

  return prefix;
}

export const GetID = (prefix: string) => {
  // get today as YYYYMMDD by using moment library
  const today = moment().format("YYYYMMDD");

  // generate 4 last digits of the id
  const lastDigits = Math.floor(Math.random() * 10000);

  // combine all parts to generate the id
  const id = `${prefix}${today}${lastDigits}`;

  console.log("id", id);

  return id;
}
