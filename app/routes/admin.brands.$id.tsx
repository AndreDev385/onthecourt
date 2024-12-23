import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  BRAND_FORM_INTENTS,
  BrandFormErrors,
  BrandsForm,
} from "~/components/admin/brands/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getBrand } from "~/lib/api/brands/getBrand";
import { getBrands } from "~/lib/api/brands/getBrands";
import { updateBrand } from "~/lib/api/brands/updateBrand";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const intent = formData.get("intent");

  const errors: BrandFormErrors = {};

  if (!_id) errors.apiError = true;
  if (!name) errors.name = "El nombre es obligatorio";

  // check if brand already exists
  const { data: brands } = await getBrands();
  if (
    brands?.find(
      (brand) => brand.name.toLowerCase() === String(name).toLowerCase()
    )
  ) {
    errors.name = "Ya existe una marca con ese nombre";
  }

  if (Object.values(errors).length > 0) {
    return { errors, intent: String(intent) };
  }

  // call endpoint
  try {
    if (intent === BRAND_FORM_INTENTS.activate) {
      await updateBrand({
        _id: _id as string,
        active: true,
      });
    } else if (intent === BRAND_FORM_INTENTS.deactivate) {
      await updateBrand({
        _id: _id as string,
        active: false,
      });
    } else if (intent === BRAND_FORM_INTENTS.update) {
      await updateBrand({
        _id: _id as string,
        name: name as string,
      });
    }
  } catch (error) {
    errors.apiError = true;
    return { errors, intent: String(intent) };
  }

  return { errors, intent: String(intent) };
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Error al buscar datos del usuario");

  const { data: brand, errors } = await getBrand(params.id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al buscar datos del usuario");
  }

  invariant(brand, "Error al buscar datos del usuario");
  return brand;
}

export default function BrandsPage() {
  const brand = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Marca</h1>
          <Link to="/admin/brands/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              MARCAS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <BrandsForm
            isUpdate={true}
            brand={brand}
            errors={actionData?.errors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
