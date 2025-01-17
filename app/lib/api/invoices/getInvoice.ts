import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getInvoice(
  controlNumber: string
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_BILL,
      variables: {
        filter: {
          controlNumber,
        },
      },
    }),
  });
  const { data, errors } = await response.json();
  return { data: data?.bill, errors };
}

type Response = {
  _id: string;
  controlNumber: string;
  currency: {
    name: string;
    symbol: string;
  };
  paid: boolean;
  charges: {
    ref: string;
    method: string;
    bank: string;
    amount: number;
  }[];
  createdAt: string;
  rate: number;
  order: {
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
      photo: string;
      location: {
        name: string;
      };
    }[];
  };
};

const GET_BILL = `#graphql
  query GET_BILL($filter: FilterFindOneBillInput!) {
    bill(filter: $filter) {
      _id
      controlNumber
      currency {
        name
        symbol
      }
      paid
      charges {
        ref
        method
        bank
        amount
      }
      paymentMetadata
      createdAt
      rate
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
