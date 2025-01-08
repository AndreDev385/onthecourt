import { Product } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getProductDashboard(
  id: string
): Promise<ApiResponse<Product>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCT,
      variables: {
        productID: id,
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data.product, errors };
}

const GET_PRODUCT = `#graphql
  query GET_PRODUCT($productID: MongoID!) {
    product(filter: { _id: $productID }) {
      title
      photos
      _id
      variants {
        title
      }
      variantValues {
        _id
        photo
        value {
          variant1
          variant2
          variant3
        }
      }
    }
}
`;
