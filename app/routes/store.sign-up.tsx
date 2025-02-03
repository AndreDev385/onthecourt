import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";
import invariant from "tiny-invariant";
import { commitSession, getSession } from "~/clientSessions";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signUp } from "~/lib/api/auth/signUp";
import { validateEmail } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const errors: SignUpFormErrors = {};
  if (!name) errors.name = "El nombre es obligatorio";
  if (!email) errors.email = "El email es obligatorio";
  if (!validateEmail(String(email))) errors.email = "El email es invalido";
  if (!password) errors.password = "La contraseña es obligatoria";
  if (String(password).length < 8)
    errors.password = "La contraseña debe tener 8 caracteres o más";

  if (Object.values(errors).length > 0) return { errors };

  // call endpoint
  const { data, errors: apiErrors } = await signUp({
    name: String(name),
    email: String(email),
    password: String(password),
  });

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = true;
    return { errors };
  }

  invariant(data, "Error al crear usuario");
  session.set("token", data.token);
  return redirect(`/store`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SignUpPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const submitting = navigation.state === "submitting";

  return (
    <div className="px-4 lg:px-0 my-16">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
        </CardHeader>
        <Form method="POST">
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label>Nombre y Apellido</Label>
              <Input name="name" type="text" placeholder="John Doe" />
              {actionData?.errors?.name ? (
                <p className="text-sm text-red-500">{actionData.errors.name}</p>
              ) : null}
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <Input name="email" type="email" placeholder="john@doe.com" />
              {actionData?.errors?.email ? (
                <p className="text-sm text-red-500">
                  {actionData.errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input name="password" type="password" placeholder="******" />
              {actionData?.errors?.password ? (
                <p className="text-sm text-red-500">
                  {actionData.errors.password}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mb-4 w-full">
              <span className="text-sm">
                Ya tienes una cuenta?
                <Link
                  className="ml-2 font-bold underline hover hover:text-gray-600"
                  to="/store/sign-in"
                >
                  Inicia sesión
                </Link>
              </span>
            </div>
            <Button
              variant="client"
              type="submit"
              disabled={submitting}
              className="w-full uppercase"
            >
              {submitting ? (
                <>
                  Creando...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Crear"
              )}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

type SignUpFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  apiError?: boolean;
};
