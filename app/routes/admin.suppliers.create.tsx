import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  SupplierForm,
  SupplierFormErrors,
} from "~/components/admin/suppliers/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getProducts } from "~/lib/api/products/getProductsDashboard";
import { createSupplier } from "~/lib/api/suppliers/createSupplier";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const name = form.get("name");
  const products = form.getAll("products");

  const errors: SupplierFormErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (products.length === 0)
    errors.selectedProducts = "Seleccione al menos un producto";

  if (Object.values(errors).length > 0) return { errors, success: false };

  const { data, errors: apiErrors } = await createSupplier({
    name: String(name),
    products: products.map(String),
  });

  if (apiErrors && Object.values(apiErrors).length > 0)
    return { errors: apiErrors, success: false };

  invariant(data, "Error al crear proveedor");
  return redirect(`/admin/suppliers/${data?._id}`);
}

export async function loader() {
  const { data: products, errors } = await getProducts();

  if (errors && Object.values(errors).length > 0)
    throw new Error("Error al cargar productos");
  invariant(products, "Error al cargar productos");

  return products.map((p) => ({ value: p._id, text: p.title }));
}

export default function CreateSupplierPage() {
  const actionData = useActionData<typeof action>();
  const products = useLoaderData<typeof loader>();
  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear proveedor</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/suppliers/list">
              <Icon icon="arrow-left" />
              PROVEEDORES
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <SupplierForm
            errors={actionData?.errors}
            products={products}
            isUpdate={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
