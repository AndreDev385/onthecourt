import { Link } from "@remix-run/react/dist/components";
import { redirect, useActionData } from "@remix-run/react";

import {
  ShippingForm,
  ShippingFormErrors,
} from "~/components/admin/shipping/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createShipping } from "~/lib/api/shipping/createShipping";
import invariant from "tiny-invariant";
import { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const price = formData.get("price");

  const errors: ShippingFormErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (!price) errors.price = "El precio es obligatorio";
  const numberPrice = Number(price);
  if (isNaN(numberPrice)) errors.price = "El precio debe ser un número";
  if (numberPrice <= 0) errors.price = "El precio debe ser mayor a cero";

  if (Object.values(errors).length > 0) {
    return errors;
  }

  // call endpoint
  try {
    const { data, errors: apiErrors } = await createShipping(
      String(name),
      numberPrice * 100
    );

    if (apiErrors && Object.values(apiErrors).length > 0) {
      errors.apiError = true;
      return errors;
    }

    invariant(data);

    return redirect(`/admin/shippings/${data._id}`);
  } catch (_) {
    errors.apiError = true;
    return errors;
  }
}

export default function CreateShippingPage() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear opción de envío</h1>
          <Link to="/admin/shippings/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              OPCIONES DE ENVÍO
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ShippingForm isUpdate={false} errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
