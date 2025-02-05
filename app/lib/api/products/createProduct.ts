import { API_URL } from "../config";

export async function createProduct(record: CreateProductInput) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_PRODUCT,
      variables: {
        data: record,
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createProduct, errors };
}

type CreateProductInput = {
  title: string;
  description: string;
  dataSheet: string;
  priority: number;
  isService: boolean;
  volatileInventory: boolean;
  photos: Array<string>;
  price: number;
  categories: Array<string>;
  compareAtPrice: number;
  brand: string;
  variants: Array<{ tags: Array<string>; title: string }>;
  variantValues: Array<{
    value:
    | { variant1: string; variant2?: string; variant3?: string }
    | undefined;
    price: number;
    compareAtPrice: number;
    sku: string;
    quantity: number;
    location: string;
    disabled: boolean;
    photo?: string;
  }>;
  extraInfo: Array<{ name: string; value: string }>;
};

export const CREATE_PRODUCT = `#graphql
  mutation CREATE_PRODUCT($data: CreateProductInput!) {
    createProduct(data: $data) {
      _id
    }
  }
`;
