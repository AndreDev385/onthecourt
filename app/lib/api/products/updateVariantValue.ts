import { VariantValue } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateVariantValue({
  variantId,
  record,
}: UpdateVariantValueInput): Promise<ApiResponse<null>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_VARIANT_VALUE,
      variables: {
        filter: { _id: variantId },
        record,
      },
    }),
  });

  const { errors } = await response.json();
  return { errors };
}

type UpdateVariantValueInput = {
  variantId: string;
  record: VariantValue | { disabled: boolean };
};

const UPDATE_VARIANT_VALUE = `#graphql
  mutation UPDATE_VARIANT_VALUE(
    $filter: FilterUpdateOneVariantValueInput
    $record: UpdateOneVariantValueInput!
  ) {
    updateVariantValue(filter: $filter, record: $record) {
      recordId
    }
  }
`;
