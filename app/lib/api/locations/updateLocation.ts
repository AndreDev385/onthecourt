import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateLocation(
  record: UpdateLocationInput | ToggleActiveLocation
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_LOCATION,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

type ToggleActiveLocation = {
  _id?: string;
  active: boolean;
};

type UpdateLocationInput = {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  shippingOptions: string[];
};

export const UPDATE_LOCATION = `#graphql
  mutation UPDATE_LOCATION(
    $record: UpdateOneLocationInput!
    $filter: FilterUpdateOneLocationInput!
  ) {
    updateLocation(record: $record, filter: $filter) {
      record {
        _id
      }
    }
  }
`;
