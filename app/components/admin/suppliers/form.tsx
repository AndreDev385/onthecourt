import { Form, useNavigation } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MultipleSelect from "~/components/ui/multi-select";
import { FORM_INTENTS } from "~/lib/constants";
import { Supplier } from "~/types";

export function SupplierForm({
  errors,
  products,
  supplier,
  isUpdate = false,
}: Props) {
  const navigation = useNavigation();
  const [selectedProducts, setSelectedProducts] = React.useState<
    { value: string; text: string }[]
  >(
    supplier?.products
      ? supplier.products.map((p) => ({ value: p._id, text: p.title }))
      : []
  );

  const updateProducts = React.useCallback(
    (values: string[]) => {
      setSelectedProducts(products.filter((p) => values.includes(p.value)));
    },
    [products]
  );

  const isToggleing =
    navigation.formData?.get("intent") === FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === FORM_INTENTS.deactivate &&
      navigation.state === "submitting");

  const isLoading =
    navigation.formData?.get("intent") === FORM_INTENTS.update ||
    (navigation.formData?.get("intent") === FORM_INTENTS.create &&
      navigation.state === "submitting");

  return (
    <Form method="post">
      <input type="hidden" name="_id" value={supplier?._id} />
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Nombre</Label>
          <Input name="name" type="text" defaultValue={supplier?.name} />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="products">Productos</Label>
          <MultipleSelect
            name="products"
            placeholder="Seleccione al menos 1 producto"
            onChange={updateProducts}
            values={products}
            selected={selectedProducts.map((p) => p.value)}
          />
          {errors?.selectedProducts ? (
            <p className="text-red-500">{errors.selectedProducts}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isLoading || isToggleing}
              type="submit"
              variant={supplier?.active ? "destructive" : "outline"}
              name="intent"
              value={
                supplier?.active
                  ? FORM_INTENTS.deactivate
                  : FORM_INTENTS.activate
              }
            >
              {supplier?.active
                ? isToggleing
                  ? "Desactivando..."
                  : "Desactivar"
                : isToggleing
                ? "Activando..."
                : "Activar"}
            </Button>
          ) : null}
          <Button
            disabled={isLoading || isToggleing}
            name="intent"
            value={isUpdate ? FORM_INTENTS.update : FORM_INTENTS.create}
            type="submit"
          >
            {isUpdate
              ? isLoading
                ? "Actualizando..."
                : "Actualizar"
              : isLoading
              ? "Creando..."
              : "Crear"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

type Props = {
  products: { value: string; text: string }[];
  supplier?: Supplier;
  errors?: SupplierFormErrors;
  isUpdate?: boolean;
};

export type SupplierFormErrors = {
  name?: string;
  selectedProducts?: string;
  apiError?: string;
};
