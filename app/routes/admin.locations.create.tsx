import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  LocationForm,
  LocationFormErrors,
} from "~/components/admin/locations/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createLocation } from "~/lib/api/locations/createLocation";
import { getShippings } from "~/lib/api/shipping/getShippings";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const address = formData.get("address");
  const shippingOptions = formData.getAll("shippingOptions");

  console.log({
    name,
    address,
    shippingOptions,
  });

  const errors: LocationFormErrors = {};
  if (!name) errors.name = "El nombre es obligatorio";
  if (!address) errors.address = "La dirección es obligatoria";
  if (shippingOptions.length === 0)
    errors.shippingOptions = "Seleccione al menos 1 opción de envío";

  if (Object.values(errors).length > 0) {
    return errors;
  }

  const { data, errors: apiErrors } = await createLocation({
    name: String(name),
    address: String(address),
    lat: 0,
    lon: 0,
    shippingOptions: shippingOptions.map((s) => String(s)),
  });

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = true;
    return errors;
  }

  invariant(data, "Error al crear sucursal");

  return redirect(`/admin/locations/${data._id}`);
}

export async function loader() {
  const { data, errors } = await getShippings();
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error loading brands");
  }

  invariant(data, "Error loading shippings");

  return data.map((s) => ({ text: s.name, value: s._id }));
}

export default function LocationsCreatePage() {
  const shippingOptions = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear sucursal</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/locations/list">
              <Icon icon="arrow-left" />
              SUCURSALES
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <LocationForm shippingOptions={shippingOptions} errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
