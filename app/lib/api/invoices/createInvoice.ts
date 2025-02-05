import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createInvoice(
  input: CreateInvoiceInput
): Promise<ApiResponse<null>> {
  const updateInvoiceRes = await updateDeliveryNote(input.deliveryNoteId);

  if (
    updateInvoiceRes.errors &&
    Object.values(updateInvoiceRes.errors).length > 0
  ) {
    return { errors: updateInvoiceRes.errors, data: null };
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_BILL,
      variables: {
        data: input,
      },
    }),
  });

  const { errors } = await response.json();
  if (errors && Object.values(errors).length > 0) {
    await updateDeliveryNote(input.deliveryNoteId, false);
    return { errors, data: null };
  }

  return { errors, data: null };
}

type CreateInvoiceInput = {
  deliveryNoteId: string;
  currencyId: string;
  rate: number;
};

const CREATE_BILL = `#graphql
  mutation CREATE_BILL($data: CreateBillInput!) {
    createBill(data: $data) {
      controlNumber
    }
  }
`;

async function updateDeliveryNote(
  _id: string,
  value: boolean = true
): Promise<ApiResponse<null>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_DELIVERY_NOTE,
      variables: {
        record: {
          generateBill: value,
        },
        filter: { _id },
      },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

const UPDATE_DELIVERY_NOTE = `#graphql
mutation UPDATE_DELIVERY_NOTE($record: UpdateOneDeliveryNoteInput!, $filter: FilterUpdateOneDeliveryNoteInput) {
  updateDeliveryNote(record: $record, filter: $filter) {
    record {
      _id
      generateBill
    }
  }
}
`;
