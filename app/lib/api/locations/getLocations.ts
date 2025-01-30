import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getLocations(): Promise<
  ApiResponse<
    {
      _id: string;
      name: string;
      address: string;
      active: boolean;
    }[]
  >
> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_LOCATIONS,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.locations, errors };
}

export const GET_LOCATIONS = `#graphql
  query GET_LOCATIONS($skip: Int, $limit: Int) {
    locations(skip: $skip, limit: $limit) {
      _id
      name
      address
      active
    }
  }
`;
