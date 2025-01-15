import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getDeliveryNote(
  controlNumber: string
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
          controlNumber,
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
    charges: {
      ref: string;
      method: string;
      bank: string;
      amount: number;
    }[];
    paymentMetadata: string;
    createdAt: string;
    order: {
      _id: string;
      status: number;
      paid: boolean;
      subtotal: number;
      discount: number;
      tax: number;
      total: number;
      commission: number;
      client: {
        name: string;
        email: string;
        client: {
          address: {
            municipality: string;
            neighborhood: string;
            street: string;
            state: string;
          };
          phone: string;
        };
      };
      products: {
        title: string;
        quantity: number;
        price: number;
        variant1: string;
        variant2?: string;
        variant3?: string;
        photo?: string;
        location: {
          name: string;
        };
      };
    };
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
      charges {
        ref
        method
        bank
        amount
      }
      paymentMetadata
      createdAt
      order {
        subtotal
        discount
        tax
        total
        commission
        client {
          name
          email
          client {
            address {
              municipality
              neighborhood
              street
              state
            }
            phone
          }
        }
        products {
          title
          quantity
          price
          variant1
          variant2
          variant3
          photo
          location {
            name
          }
        }
      }
    }
  }
`;
