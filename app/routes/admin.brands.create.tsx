import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { BrandFormErrors, BrandsForm } from "~/components/admin/brands/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createBrand } from "~/lib/api/brands/createBrand";
import { getBrands } from "~/lib/api/brands/getBrands";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");

  const errors: BrandFormErrors = {};
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

  // call endpoint
  const { data, errors: apiErrors } = await createBrand(String(name));

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = true;
    return errors;
  }

  invariant(data, "Error al crear marca");
  return redirect(`/admin/brands/${data._id}`);
}

export default function CreateBrandPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear Marca</h1>
          <Link to="/admin/brands/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              MARCAS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <BrandsForm isUpdate={false} errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
