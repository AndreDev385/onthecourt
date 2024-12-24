import { Location } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getLocation(id: string): Promise<ApiResponse<Location>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_LOCATION,
      variables: { filter: { _id: id } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.location, errors };
}

export const GET_LOCATION = `#graphql
  query GET_LOCATION($filter: FilterFindOneLocationInput!) {
    shippings(filter: { active: true }) {
      _id
      name
    }
    location(filter: $filter) {
      _id
      name
      address
      lat
      lon
      active
      shippingOptions {
        _id
      }
    }
  }
`;
