import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getDeliveryNote(
  order: string
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_DELIVERY_NOTE,
      variables: {
        filter: {
          order,
        },
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
    rate: number;
  }[];
  deliveryNote: {
    _id: string;
    controlNumber: string;
    paid: boolean;
    generateBill: boolean;
    paymentMetadata: string;
    createdAt: string;
  };
};

const GET_DELIVERY_NOTE = `#graphql
  query GET_DELIVERY_NOTE($filter: FilterFindOneDeliveryNoteInput!) {
    currencies(filter: { active: true }) {
      _id
      name
      rate
    }
    deliveryNote(filter: $filter) {
      _id
      controlNumber
      paid
      generateBill
      paymentMetadata
      createdAt
    }
  }
`;
