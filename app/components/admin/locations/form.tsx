import { Form, useNavigation } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { Location } from "~/types";

export function LocationForm({
  errors,
  location,
  shippingOptions,
  isUpdate = false,
}: Props) {
  const navigation = useNavigation();
  const { toast } = useToast();

  const isToggleing =
    navigation.formData?.get("intent") === LOCATION_FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === LOCATION_FORM_INTENTS.deactivate &&
      navigation.state === "submitting");

  const isUpdating =
    navigation.formData?.get("intent") === LOCATION_FORM_INTENTS.update &&
    navigation.state === "submitting";

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
          <Select required name="shippingOptions">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un privilegio" />
            </SelectTrigger>
            <SelectContent>
              {shippingOptions.map(([key, value]) => (
                <SelectItem key={key} value={String(value)}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
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
                  ? LOCATION_FORM_INTENTS.deactivate
                  : LOCATION_FORM_INTENTS.activate
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
            value={
              isUpdate
                ? LOCATION_FORM_INTENTS.update
                : LOCATION_FORM_INTENTS.create
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
  errors?: LocationFormErrors;
  isUpdate?: boolean;
  location?: Location;
  shippingOptions: string[];
};

export type LocationFormErrors = {
  apiError?: boolean;
  name?: string;
  address?: string;
};

export const LOCATION_FORM_INTENTS = {
  create: "create",
  update: "update",
  deactivate: "deactivate",
  activate: "activate",
};
