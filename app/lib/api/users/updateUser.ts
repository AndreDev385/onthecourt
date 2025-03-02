import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateUser(
  record: UpdateUserInput | ToggleActiveUser
): Promise<ApiResponse<null>> {
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

  const { errors } = await response.json();
  return { data: null, errors };
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
