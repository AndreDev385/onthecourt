import { Form, useNavigation } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { Shipping } from "~/types";

export function ShippingForm({ errors, shipping, isUpdate = false }: Props) {
  const navigation = useNavigation();
  const { toast } = useToast();

  const isToggleing =
    navigation.formData?.get("intent") === SHIPPING_FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === SHIPPING_FORM_INTENTS.deactivate &&
      navigation.state === "submitting");

  const isUpdating =
    navigation.formData?.get("intent") === SHIPPING_FORM_INTENTS.update &&
    navigation.state === "submitting";

  React.useEffect(
    function showResponseError() {
      if (errors?.apiError) {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: "Ha ocurrido un error al crear la opción de envio",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errors]
  );

  return (
    <Form method="post">
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Nombre</Label>
          <Input
            name="name"
            type="text"
            placeholder="Delivery"
            defaultValue={shipping?.name}
          />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Precio</Label>
          <Input
            name="price"
            type="text"
            placeholder="4.99"
            defaultValue={shipping?.price}
          />
          {errors?.price ? (
            <p className="text-red-500">{errors.price}</p>
          ) : null}
        </div>
      </div>
      <input type="hidden" name="_id" value={shipping?._id} />
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isUpdating || isToggleing}
              type="submit"
              variant={shipping?.active ? "destructive" : "outline"}
              name="intent"
              value={
                shipping?.active
                  ? SHIPPING_FORM_INTENTS.deactivate
                  : SHIPPING_FORM_INTENTS.activate
              }
            >
              {shipping?.active
                ? isToggleing
                  ? "Desactivando..."
                  : "Desactivar"
                : isToggleing
                ? "Activando..."
                : "Activar"}
            </Button>
          ) : null}
          <Button
            disabled={isUpdating || isToggleing}
            name="intent"
            value={
              isUpdate
                ? SHIPPING_FORM_INTENTS.update
                : SHIPPING_FORM_INTENTS.create
            }
            type="submit"
          >
            {isUpdate
              ? isUpdating
                ? "Actualizando..."
                : "Actualizar"
              : isUpdating
              ? "Creando..."
              : "Crear"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

type Props = {
  errors?: ShippingFormErrors;
  isUpdate?: boolean;
  shipping?: Shipping;
};

export type ShippingFormErrors = {
  apiError?: boolean;
  name?: string;
  price?: string;
};

export const SHIPPING_FORM_INTENTS = {
  create: "create",
  update: "update",
  deactivate: "deactivate",
  activate: "activate",
};
