import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { UserForm, UserFormErrors } from "~/components/admin/users/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createUser } from "~/lib/api/users/createUser";
import { validateDni, validateEmail } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const rePassword = formData.get("rePassword");
  const dni = formData.get("dni");
  const dniType = formData.get("dniType");
  const privilege = formData.get("privilege");
  const commission = formData.get("commission");

  const errors: UserFormErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (!email) errors.email = "El correo electrónico es obligatorio";
  if (!validateEmail(email as string))
    errors.email = "Ingresa un correo válido";
  if (!password) errors.password = "La contraseña es obligatoria";
  else if (password && (password as string).length < 8)
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  if (password !== rePassword)
    errors.rePassword = "Las contraseñas no coinciden";
  if (!dniType) errors.dniType = "El dniType es obligatorio";
  if (!dni) errors.dni = "El dni es obligatorio";
  if (!validateDni(dni as string))
    errors.dni = "Ingresa un número de documento válido";
  if (!privilege) errors.privilege = "El privilegio es obligatorio";
  if (!privilege) errors.privilege = "El privilegio es obligatorio";
  if (!commission) errors.commission = "La comisión es obligatorio";

  // call endpoint
  let record;
  try {
    const { data, errors: apiErrors } = await createUser({
      name: name as string,
      email: email as string,
      password: password as string,
      dni: dni as string,
      dniType: dniType as string,
      privilege: Number(privilege),
      commission: Number(commission),
    });

    if (apiErrors && Object.values(errors).length > 0) {
      errors.error = true;
      return errors;
    }
    record = data;
  } catch (e) {
    errors.error = true;
    return errors;
  }

  invariant(record);
  return Object.keys(errors).length > 0
    ? errors
    : redirect(`/admin/users/${record._id}`);
}

export default function CreateUserPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear Usuario</h1>
          <Link to="/admin/users/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              USUARIOS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <UserForm isUpdate={false} errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
