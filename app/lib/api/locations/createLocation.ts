import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createLocation(
  record: CreateLocationInput
): Promise<ApiResponse<Location>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_LOCATION,
      variables: { record },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createLocation?.record, errors };
}

export type CreateLocationInput = {
  name: string;
  address: string;
  lat: number;
  lon: number;
  shippingOptions: string[];
};

export const CREATE_LOCATION = `#graphql
  mutation CREATE_LOCATION($record: CreateOneLocationInput!) {
    createLocation(record: $record) {
      record {
        _id
      }
    }
  }
`;
