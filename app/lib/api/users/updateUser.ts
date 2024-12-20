import { API_URL } from "../config";

export async function updateUser(record: UpdateUserInput | ToggleActiveUser) {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_USER,
      variables: { record, filter: { _id } },
    }),
  });

  const res = await response.json();
  console.log({ data: res.data, errors: res.errors });
  return null;
}

type ToggleActiveUser = {
  _id: string;
  active: boolean;
};

type UpdateUserInput = {
  _id?: string;
  name: string;
  email: string;
  dni: string;
  dniType: string;
  privilege: number;
  commission: number;
};

export const UPDATE_USER = `#graphql
  mutation UPDATE_USER(
    $record: UpdateOneUserInput!
    $filter: FilterUpdateOneUserInput!
  ) {
    updateUser(record: $record, filter: $filter) {
      record {
        _id
      }
    }
  }
`;
