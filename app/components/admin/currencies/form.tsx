import React from "react";
import { Form, useNavigation } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { Currency } from "~/types";
import { FORM_INTENTS } from "~/lib/constants";

export function CurrencyForm({ errors, isUpdate = false, currency }: Props) {
  const navigation = useNavigation();
  const { toast } = useToast();

  const isToggleing =
    navigation.formData?.get("intent") === FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === FORM_INTENTS.deactivate &&
      navigation.state === "submitting");

  const isUpdating =
    navigation.formData?.get("intent") === FORM_INTENTS.update &&
    navigation.state === "submitting";

  React.useEffect(
    function showResponseError() {
      if (errors?.apiError) {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: "Ha ocurrido un error al crear moneda",
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
            placeholder="Dollar Americano"
            defaultValue={currency?.name}
          />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Símbolo</Label>
          <Input
            name="symbol"
            type="text"
            placeholder="USD"
            defaultValue={currency?.symbol}
          />
          {errors?.name ? (
            <p className="text-red-500">{errors.symbol}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Tasa</Label>
          <Input
            name="rate"
            type="number"
            placeholder="1.00"
            min="0"
            step="0.01"
            defaultValue={currency?.rate}
          />
          {errors?.rate ? <p className="text-red-500">{errors.rate}</p> : null}
        </div>
      </div>
      <input type="hidden" name="_id" value={currency?._id} />
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isUpdating || isToggleing}
              type="submit"
              variant={currency?.active ? "destructive" : "outline"}
              name="intent"
              value={
                currency?.active
                  ? FORM_INTENTS.deactivate
                  : FORM_INTENTS.activate
              }
            >
              {currency?.active
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
  errors?: CurrencyFormErrors;
  isUpdate?: boolean;
  currency?: Currency;
};

export type CurrencyFormErrors = {
  name?: string;
  symbol?: string;
  rate?: string;
  apiError?: boolean;
};
