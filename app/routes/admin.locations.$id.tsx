import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  LocationForm,
  LocationFormErrors,
} from "~/components/admin/locations/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getLocation } from "~/lib/api/locations/getLocation";
import { updateLocation } from "~/lib/api/locations/updateLocation";
import { getShippings } from "~/lib/api/shipping/getShippings";
import { FORM_INTENTS } from "~/lib/constants";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const address = formData.get("address");
  const shippingOptions = formData.getAll("shippingOptions");
  const intent = formData.get("intent");

  console.log({
    name,
    address,
    shippingOptions,
  });

  invariant(_id, "Error al cargar datos de la sucursal");

  const errors: LocationFormErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (!address) errors.address = "La dirección es obligatoria";
  if (shippingOptions.length === 0)
    errors.shippingOptions = "Seleccione al menos 1 opción de envío";

  if (Object.values(errors).length > 0) {
    return { errors, intent: String(intent) };
  }

  try {
    if (intent === FORM_INTENTS.activate) {
      await updateLocation({
        _id: _id as string,
        active: true,
      });
    } else if (intent === FORM_INTENTS.deactivate) {
      await updateLocation({
        _id: _id as string,
        active: false,
      });
    } else if (intent === FORM_INTENTS.update) {
      const { errors } = await updateLocation({
        _id: _id as string,
        name: name as string,
        address: address as string,
        lat: 0,
        lon: 0,
        shippingOptions: shippingOptions as string[],
      });

      if (errors && Object.values(errors).length > 0) {
        return { errors, intent: String(intent) };
      }
    }
  } catch (_) {
    errors.apiError = true;
    return { errors, intent: String(intent) };
  }

  return { errors, intent: String(intent) };
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Error al buscar datos del usuario");
  const { data: location, errors: locationErr } = await getLocation(params.id);

  if (locationErr && Object.keys(locationErr).length > 0) {
    throw new Error("Error al cargar sucursal");
  }

  const { data: shippingOptions, errors: shippingErr } = await getShippings();

  if (shippingErr && Object.keys(shippingErr).length > 0) {
    throw new Error("Error al cargar opciones de envío");
  }

  invariant(location, "Error al buscar datos de la sucursal");
  invariant(shippingOptions, "Error al buscar opciones de envío");

  return {
    location,
    shippingOptions: shippingOptions.map((s) => ({
      text: s.name,
      value: s._id,
    })),
  };
}

export default function EditLocationPage() {
  const { location, shippingOptions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar sucursal</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/locations/list">
              <Icon icon="arrow-left" />
              SUCURSALES
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <LocationForm
            isUpdate={true}
            location={location}
            shippingOptions={shippingOptions}
            errors={actionData?.errors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
