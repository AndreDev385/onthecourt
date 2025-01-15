import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getDeliveryNotes(): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_DELIVERY_NOTES,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.deliveryNotes, errors };
}

type Response = {
  _id: string;
  controlNumber: string;
  paid: boolean;
  createdAt: string;
}[];

const GET_DELIVERY_NOTES = `#graphql
  query GET_DELIVERY_NOTES($skip: Int, $limit: Int) {
    deliveryNotes(skip: $skip, limit: $limit) {
      _id
      controlNumber
      paid
      createdAt
    }
  }
`;
