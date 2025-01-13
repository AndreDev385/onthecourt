import { ActionFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import {
  SupplierForm,
  SupplierFormErrors,
} from "~/components/admin/suppliers/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { getProductsDashboard } from "~/lib/api/products/getProductsDashboard";
import { getSupplier } from "~/lib/api/suppliers/getSupplier";
import { updateSupplier } from "~/lib/api/suppliers/updateSupplier";
import { FORM_INTENTS } from "~/lib/constants";
import { mapIntentToMessage } from "~/lib/utils";
import { Supplier } from "~/types";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const _id = form.get("_id");
  const name = form.get("name");
  const products = form.getAll("products");
  const intent = form.get("intent");

  const errors: SupplierFormErrors = {};
  if (!name) errors.name = "El nombre es obligatorio";
  if (products.length === 0)
    errors.selectedProducts = "Seleccione al menos un producto";

  if (Object.values(errors).length > 0)
    return { errors, success: false, intent: String(intent) };

  if (intent === FORM_INTENTS.activate || intent === FORM_INTENTS.deactivate) {
    const { errors: apiErrors } = await updateSupplier({
      _id: String(_id),
      active: intent === FORM_INTENTS.activate,
    });

    if (apiErrors && Object.values(apiErrors).length > 0)
      errors.apiError = "Error al actualizar proveedor";
  }

  if (intent === FORM_INTENTS.update) {
    const { errors: apiErrors } = await updateSupplier({
      _id: String(_id),
      name: String(name),
      products: products.map(String),
    });

    if (apiErrors && Object.values(apiErrors).length > 0)
      errors.apiError = "Error al actualizar proveedor";
  }

  if (errors && Object.values(errors).length > 0)
    return { errors, success: false, intent: String(intent) };

  return { success: true, intent: String(intent) };
}

export async function loader({ params }: ActionFunctionArgs) {
  invariant(params.id, "Error al cargar datos del proveedor");
  const { data: products, errors } = await getProductsDashboard();

  if (errors && Object.values(errors).length > 0)
    throw new Error("Error al cargar productos");
  invariant(products, "Error al cargar productos");

  const { data: supplier, errors: supplierErrors } = await getSupplier(
    params.id
  );

  if (supplierErrors && Object.values(supplierErrors).length > 0)
    throw new Error("Error al cargar proveedor");

  invariant(supplier, "Error al cargar proveedor");
  return {
    products: products.map((p) => ({ value: p._id, text: p.title })),
    supplier,
  };
}

export default function UpdateSupplierPage() {
  const { toast } = useToast();
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  React.useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast({
          title: "Exito",
          description: `Se ha ${mapIntentToMessage(
            actionData.intent
          )} el proveedor.`,
        });
      } else if (actionData.errors?.apiError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `${
            actionData.errors?.apiError
          }\nNo se ha podido ${mapIntentToMessage(
            actionData.intent
          )} el proveedor.`,
        });
      }
    }
  }, [actionData, toast]);

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
            supplier={data.supplier as Supplier}
            errors={actionData?.errors}
            products={data.products}
            isUpdate={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
