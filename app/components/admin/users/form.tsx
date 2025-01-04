import { Form as RemixForm, useNavigation } from "@remix-run/react";
import { Input } from "../../ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DNI_TYPES, FORM_INTENTS, PRIVILEGES } from "~/lib/constants";
import { Label } from "~/components/ui/label";
import React from "react";
import { useToast } from "~/hooks/use-toast";
import { User } from "~/types";

export function UserForm({ user, errors, isUpdate = false }: Props) {
  const navigation = useNavigation();

  const isToggleing =
    navigation.formData?.get("intent") === FORM_INTENTS.activate ||
    (navigation.formData?.get("intent") === FORM_INTENTS.deactivate &&
      navigation.state === "submitting");
  const isUpdating =
    navigation.formData?.get("intent") === FORM_INTENTS.update &&
    navigation.state === "submitting";

  const { toast } = useToast();

  React.useEffect(
    function showResponseError() {
      if (errors?.error) {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: errors.error,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errors]
  );

  return (
    <RemixForm method="post">
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="name">Nombre</Label>
          <Input
            required
            name="name"
            type="text"
            placeholder="Jonh Doe"
            defaultValue={user?.name}
          />
          {errors?.name ? <p className="text-red-500">{errors.name}</p> : null}
        </div>
        <div className="w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            required
            name="email"
            type="email"
            placeholder="john@doe.com"
            defaultValue={user?.email}
          />
          {errors?.email ? (
            <p className="text-red-500">{errors.email}</p>
          ) : null}
        </div>
      </div>
      {!isUpdate ? (
        <div className="flex flex-row flex-wrap lg:-mx-4">
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              required
              name="password"
              type="password"
              placeholder="********"
            />
            {errors?.password ? (
              <p className="text-red-500">{errors.password}</p>
            ) : null}
          </div>
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <Label htmlFor="rePassword">Repita la Contraseña</Label>
            <Input
              required
              name="rePassword"
              type="password"
              placeholder="********"
            />
            {errors?.rePassword ? (
              <p className="text-red-500">{errors.rePassword}</p>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="dniType">Tipo de Documento</Label>
          <Select
            required
            name="dniType"
            defaultValue={user?.dniType ? `${user?.dniType}` : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DNI_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={String(value)}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.dniType ? (
            <p className="text-red-500">{errors.dniType}</p>
          ) : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="dni">Documento de Identidad</Label>
          <Input
            required
            name="dni"
            placeholder="26985902"
            defaultValue={user?.dni}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label>Privilegio</Label>
          <Select
            required
            name="privilege"
            defaultValue={user?.privilege ? String(user?.privilege) : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un privilegio" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIVILEGES)
                .filter(([, value]) => value !== 0)
                .map(([key, value]) => (
                  <SelectItem key={key} value={String(value)}>
                    {key}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors?.privilege ? (
            <p className="text-red-500">{errors.privilege}</p>
          ) : null}
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label>Comisión</Label>
          <Input
            required
            name="commission"
            min="0"
            step="0.01"
            type="number"
            placeholder="0.05"
            defaultValue={
              user?.commission ? String(user?.commission) : undefined
            }
          />
          {errors?.commission ? (
            <p className="text-red-500">{errors.commission}</p>
          ) : null}
        </div>
      </div>
      <input type="hidden" name="_id" value={user?._id} />
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          {isUpdate ? (
            <Button
              disabled={isUpdating || isToggleing}
              type="submit"
              variant={user?.active ? "destructive" : "outline"}
              name="intent"
              value={
                user?.active ? FORM_INTENTS.deactivate : FORM_INTENTS.activate
              }
            >
              {user?.active
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
    </RemixForm>
  );
}

export type UserFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  rePassword?: string;
  dni?: string;
  dniType?: string;
  privilege?: string;
  commission?: string;
  error?: boolean;
};

type Props = {
  user?: User;
  isUpdate: boolean;
  errors?: UserFormErrors | null;
};
