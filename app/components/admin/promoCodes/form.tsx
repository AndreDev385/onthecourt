import { Form, useNavigation } from "@remix-run/react";
import React from "react";
import { DatePicker } from "~/components/shared/datePicker";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useToast } from "~/hooks/use-toast";
import { FORM_INTENTS } from "~/lib/constants";
import { PromoCode } from "~/types";

export function PromoCodeForm({ isUpdate = false, promoCode, errors }: Props) {
  const navigation = useNavigation();
  const { toast } = useToast();

  const isToggleing =
    navigation.formData?.get("intent") === FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === FORM_INTENTS.deactivate &&
      navigation.state === "submitting");

  const isUpdating =
    navigation.formData?.get("intent") === FORM_INTENTS.update &&
    navigation.state === "submitting";

  React.useEffect(() => {
    if (errors?.apiError) {
      toast({
        variant: "destructive",
        title: "Algo salió mal",
        description: "Ha ocurrido un error al crear el código de promoción",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return (
    <Form method="post">
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Nombre</Label>
          <Input
            name="name"
            type="text"
            placeholder="Black Friday"
            defaultValue={promoCode?.name}
          />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="code">Código</Label>
          <Input
            name="code"
            type="text"
            placeholder="A2xasF"
            defaultValue={promoCode?.code}
          />
          {errors?.code ? <p className="text-red-500">{errors.code}</p> : null}
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="type">Tipo de promoción</Label>
          <RadioGroup
            defaultValue={promoCode?.fixed ? "fixed" : "percentage"}
            name="type"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fijo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Porcentaje</Label>
            </div>
          </RadioGroup>
          {errors?.isFixed ? (
            <p className="text-red-500">{errors.isFixed}</p>
          ) : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="discount">Descuento</Label>
          <Input
            name="discount"
            type="number"
            placeholder="5"
            defaultValue={promoCode?.discount}
          />
          {errors?.discount ? (
            <p className="text-red-500">{errors.discount}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="expirationDate">Fecha de expiración</Label>
          <DatePicker
            name="expirationDate"
            defaultValue={promoCode?.expirationDate}
          />
          {errors?.expirationDate ? (
            <p className="text-red-500">{errors.expirationDate}</p>
          ) : null}
        </div>
      </div>
      <input type="hidden" name="_id" value={promoCode?._id} />
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isUpdating || isToggleing}
              type="submit"
              variant={promoCode?.active ? "destructive" : "outline"}
              name="intent"
              value={
                promoCode?.active
                  ? FORM_INTENTS.deactivate
                  : FORM_INTENTS.activate
              }
            >
              {promoCode?.active
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
  isUpdate?: boolean;
  promoCode?: PromoCode;
  errors?: PromoCodeFormErrors;
};

export type PromoCodeFormErrors = {
  name?: string;
  code?: string;
  discount?: string;
  isFixed?: string;
  expirationDate?: string;
  apiError?: boolean;
};
