import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getProduct(slug: string): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCT,
      variables: {
        filter: { slug },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data.getProduct, errors };
}

type Response = {
  suggestions: {
    slug: string;
    title: string;
    photos: string[];
    createdAt: Date;
    variantValues: {
      price: number;
    }[];
  }[];
  product: {
    _id: string;
    title: string;
    description: string;
    photos: string[];
    price: number;
    rating: number;
    isService: boolean;
    compareAtPrice: number;
    volatileInventory: boolean;
    brand: {
      name: string;
    } | null;
    comments: {
      _id: string;
      text: string;
      rating: number;
      client: {
        name: string;
      };
    }[];
    variants: {
      title: string;
      tags: string[];
    }[];
    variantValues: {
      value: {
        variant1: string;
        variant2: string;
        variant3: string;
      };
      location: {
        _id: string;
      };
      price: number;
      compareAtPrice: number;
      quantity: number;
      _id: string;
    }[];
    categories: {
      slug: string;
      name: string;
    }[];
    extraInfo: {
      name: string;
      value: string;
    }[];
  };
};

const GET_PRODUCT = `#graphql
  query GET_PRODUCT($filter: FilterGetProductInput!) {
    getProduct(filter: $filter) {
      suggestions {
        slug
        title
        photos
        createdAt
        variantValues {
          price
        }
      }
      product {
        _id
        title
        description
        photos
        price
        rating
        isService
        compareAtPrice
        volatileInventory
        brand {
          name
        }
        comments {
          _id
          text
          rating
          client {
            name
          }
        }
        variants {
          title
          tags
        }
        variantValues {
          value {
            variant1
            variant2
            variant3
          }
          location {
            _id
          }
          price
          compareAtPrice
          quantity
          _id
        }
        categories {
          slug
          name
        }
        extraInfo {
          name
          value
        }
      }
    }
  }
`;
