import { Form, useNavigation } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { FORM_INTENTS } from "~/lib/constants";
import { Category } from "~/types";

export function CategoryForm({ category, errors, isUpdate = false }: Props) {
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
          description: "Ha ocurrido un error al crear la categoría",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errors]
  );

  return (
    <Form method="post">
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full px-4 mb-4">
          <Label htmlFor="name">Nombre</Label>
          <Input
            required
            name="name"
            type="text"
            placeholder="Caballeros"
            defaultValue={category?.name}
          />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
      </div>
      <input type="hidden" name="_id" value={category?._id} />
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isUpdating || isToggleing}
              type="submit"
              variant={category?.active ? "destructive" : "outline"}
              name="intent"
              value={
                category?.active
                  ? FORM_INTENTS.deactivate
                  : FORM_INTENTS.activate
              }
            >
              {category?.active
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

export type CategoryFormErrors = {
  _id?: string;
  name?: string;
  apiError?: boolean;
};

type Props = {
  isUpdate: boolean;
  category?: Category;
  errors?: CategoryFormErrors;
};
