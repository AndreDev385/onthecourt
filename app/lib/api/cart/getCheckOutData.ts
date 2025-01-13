import { API_URL } from "../config";
import { ApiResponse } from "../response";

// TODO: When implementing locations, change this function
export async function getCheckOutData(
  locationId: string = ""
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CHECKOUT_DATA,
      variables: {
        filter: {},
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data, errors };
}

type Response = {
  currencies: {
    _id: string;
    name: string;
    symbol: string;
    rate: number;
  }[];
  location: {
    shippingOptions: {
      _id: string;
      name: string;
      price: number;
    }[];
  };
};

const GET_CHECKOUT_DATA = `#graphql
  query GET_CHECKOUT_DATA($filter: FilterFindOneLocationInput!) {
    currencies {
      _id
      name
      symbol
      rate
    }
    location(filter: $filter) {
      shippingOptions {
        _id
        name
        price
      }
    }
  }
`;
