import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  SHIPPING_FORM_INTENTS,
  ShippingForm,
  ShippingFormErrors,
} from "~/components/admin/shipping/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getShipping } from "~/lib/api/shipping/getShipping";
import { updateShipping } from "~/lib/api/shipping/updateShipping";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const price = formData.get("price");
  const intent = formData.get("intent");

  const errors: ShippingFormErrors = {};

  if (!_id) errors.apiError = true;
  if (!name) errors.name = "El nombre es obligatorio";
  if (!price) errors.price = "El precio es obligatorio";
  const numberPrice = Number(price);
  if (isNaN(numberPrice)) errors.price = "El precio debe ser un número";
  if (numberPrice <= 0) errors.price = "El precio debe ser mayor a cero";

  console.log(errors, "form errors");

  if (Object.values(errors).length > 0) {
    return { errors, intent: String(intent) };
  }

  try {
    if (intent === SHIPPING_FORM_INTENTS.activate) {
      await updateShipping({
        _id: _id as string,
        active: true,
      });
    } else if (intent === SHIPPING_FORM_INTENTS.deactivate) {
      await updateShipping({
        _id: _id as string,
        active: false,
      });
    } else if (intent === SHIPPING_FORM_INTENTS.update) {
      await updateShipping({
        _id: _id as string,
        name: name as string,
        price: numberPrice * 100,
      });
    }
  } catch (error) {
    console.log(error, "error");
    errors.apiError = true;
    return { errors, intent: String(intent) };
  }

  return { errors, intent: String(intent) };
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, "Error al buscar datos del usuario");
  const { data: shipping, errors } = await getShipping(params.id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al buscar datos del usuario");
  }

  invariant(shipping, "Error al buscar datos del usuario");
  // Reset price to display number for cents
  shipping.price = shipping.price / 100;
  return shipping;
};

export default function EditShippingPage() {
  const shipping = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar opción de envío</h1>
          <Link to="/admin/shippings/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              OPCIONES DE ENVÍO
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ShippingForm
            isUpdate={true}
            shipping={shipping}
            errors={actionData?.errors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
