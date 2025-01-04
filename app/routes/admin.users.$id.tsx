import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { UserForm, UserFormErrors } from "~/components/admin/users/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useToast } from "~/hooks/use-toast";
import { getUser } from "~/lib/api/users/getUser";
import { updateUser } from "~/lib/api/users/updateUser";
import { FORM_INTENTS } from "~/lib/constants";
import { validateDni, validateEmail } from "~/lib/utils";

type UpdateUserErrors = Omit<UserFormErrors, "password" | "rePassword">;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const email = formData.get("email");
  const dni = formData.get("dni");
  const dniType = formData.get("dniType");
  const privilege = formData.get("privilege");
  const commission = formData.get("commission");
  const intent = formData.get("intent");

  const errors: UpdateUserErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (!email) errors.email = "El correo electrónico es obligatorio";
  if (!validateEmail(email as string))
    errors.email = "Ingresa un correo válido";
  if (!dniType) errors.dniType = "El dniType es obligatorio";
  if (!dni) errors.dni = "El dni es obligatorio";
  if (!validateDni(dni as string))
    errors.dni = "Ingresa un número de documento válido";
  if (!privilege) errors.privilege = "El privilegio es obligatorio";
  if (!privilege) errors.privilege = "El privilegio es obligatorio";
  if (!commission) errors.commission = "La comisión es obligatorio";

  if (!_id) errors.error = true;

  // call endpoint
  try {
    if (intent === FORM_INTENTS.activate) {
      await updateUser({
        _id: _id as string,
        active: true,
      });
    } else if (intent === FORM_INTENTS.deactivate) {
      await updateUser({
        _id: _id as string,
        active: false,
      });
    } else if (intent === FORM_INTENTS.update) {
      await updateUser({
        _id: _id as string,
        name: name as string,
        email: email as string,
        dni: dni as string,
        dniType: dniType as string,
        privilege: Number(privilege),
        commission: Number(commission),
      });
    }
  } catch (error) {
    errors.error = true;
    return { errors, intent: String(intent) };
  }

  return { errors, intent: String(intent) };
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, "Error al buscar datos del usuario");
  const { data: user, errors } = await getUser(params.id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al buscar datos del usuario");
  }

  invariant(user, "Error al buscar datos del usuario");
  return user;
};

export default function EditUserPage() {
  const user = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const { toast } = useToast();

  React.useEffect(() => {
    let action: string;

    if (actionData?.intent === "deactivate") {
      action = "desactivado";
    } else if (actionData?.intent === "activate") {
      action = "activado";
    } else {
      action = "actualizado";
    }

    if (actionData?.intent) {
      toast({
        title: "Éxito",
        description: `El usuario ha sido ${action}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar usuario</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/users/list">
              <Icon icon="arrow-left" />
              USUARIOS
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <UserForm user={user} isUpdate={true} errors={actionData?.errors} />
        </CardContent>
      </Card>
    </div>
  );
}
