import { API_URL } from "../config";

export async function updateProduct(record: UpdateProductInput) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_PRODUCT,
      variables: record,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.updateProduct, errors };
}

type UpdateProductInput = {
  filter: { _id: string };
  data:
  | {
    title: string;
    description: string;
    dataSheet: string;
    priority: number;
    isService: boolean;
    volatileInventory: boolean;
    price: number;
    compareAtPrice: number;
    photos: string[];
    brand: string;
    categories: string[];
    variants: {
      create: {
        title: string;
        tags: string[];
      }[];
      update: {
        _id: string;
        title: string;
        tags: string[];
      }[];
    };
    variantValues: {
      create: Omit<UpdateVariantValue, "_id">[];
      update: UpdateVariantValue[];
    };
    extraInfo: { name: string; value: string }[];
  }
  | { active: boolean };
};

type UpdateVariantValue = {
  _id: string;
  value: {
    variant1: string;
    variant2?: string;
    variant3?: string;
  };
  price: number;
  compareAtPrice: number;
  sku?: string;
  quantity: number;
  location: string;
  disabled: boolean;
  photo?: string;
};

export const UPDATE_PRODUCT = `#graphql
  mutation UPDATE_PRODUCT(
    $data: UpdateProductInput!
    $filter: FilterOneProduct
  ) {
    updateProduct(data: $data, filter: $filter) {
      _id
    }
  }
`;
