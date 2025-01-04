import { Form, useNavigation } from "@remix-run/react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MultipleSelect from "~/components/ui/multi-select";
import { useToast } from "~/hooks/use-toast";
import { FORM_INTENTS } from "~/lib/constants";
import { Location } from "~/types";

export function LocationForm({
  errors,
  location,
  shippingOptions,
  isUpdate = false,
}: Props) {
  const navigation = useNavigation();
  const { toast } = useToast();

  const [selected, setSelected] = React.useState<string[]>(
    location?.shippingOptions?.map((shipping) => shipping._id) ?? []
  );

  const isToggleing =
    navigation.formData?.get("intent") === FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === FORM_INTENTS.deactivate &&
      navigation.state === "submitting");

  const isUpdating =
    navigation.formData?.get("intent") === FORM_INTENTS.update &&
    navigation.state === "submitting";

  const updateShippingOptions = React.useCallback(setSelected, [setSelected]);

  React.useEffect(
    function showResponseError() {
      if (errors?.apiError) {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: "Ha ocurrido un error al crear sucursal",
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
            placeholder="San Juan"
            defaultValue={location?.name}
          />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="address">Dirección</Label>
          <Input
            name="address"
            type="text"
            placeholder="Calle 2, Campo Alegre, Maracay 2103 Distrito Capital, VEN"
            defaultValue={location?.address}
          />
          {errors?.address ? (
            <p className="text-red-500">{errors.address}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Opciones de envío</Label>
          <MultipleSelect
            name="shippingOptions"
            placeholder="Seleccione al menos 1 opción de envió"
            onChange={updateShippingOptions}
            values={shippingOptions}
            selected={selected}
          />
          {errors?.shippingOptions ? (
            <p className="text-red-500">{errors.shippingOptions}</p>
          ) : null}
        </div>
      </div>
      <input type="hidden" name="_id" value={location?._id} />
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isUpdating || isToggleing}
              type="submit"
              variant={location?.active ? "destructive" : "outline"}
              name="intent"
              value={
                location?.active
                  ? FORM_INTENTS.deactivate
                  : FORM_INTENTS.activate
              }
            >
              {location?.active
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
            value={isUpdate ? FORM_INTENTS.update : FORM_INTENTS.create}
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
  errors?: LocationFormErrors;
  isUpdate?: boolean;
  location?: Location;
  shippingOptions: { text: string; value: string }[];
};

export type LocationFormErrors = {
  apiError?: boolean;
  name?: string;
  address?: string;
  shippingOptions?: string;
};
