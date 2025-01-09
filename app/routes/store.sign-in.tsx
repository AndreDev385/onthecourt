import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  ShouldRevalidateFunctionArgs,
  useActionData,
  useNavigation,
} from "@remix-run/react";
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
import { signIn } from "~/lib/api/auth/signIn";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const errors: SignInFormErrors = {};
  if (!email) errors.email = "El email es obligatorio";
  if (!password) errors.password = "La contraseña es obligatoria";

  if (Object.values(errors).length > 0) return { errors };

  const { data, errors: apiErrors } = await signIn(
    String(email).toLowerCase(),
    String(password)
  );

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = "Ha ocurrido un error. No ha sido posible iniciar sesión";
    return { errors };
  }

  invariant(data, "Error al iniciar sesión");
  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", data.token);
  const headers = new Headers();
  headers.set("Set-Cookie", await commitSession(session));
  return redirect("/store", {
    headers,
  });
}

export function shouldRevalidate({ nextUrl }: ShouldRevalidateFunctionArgs) {
  return nextUrl.pathname === "/store";
}

export default function SignInPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const submitting = navigation.state === "submitting";

  return (
    <div className="px-4 lg:px-0 my-16">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        </CardHeader>
        <Form method="POST">
          <CardContent className="flex flex-col gap-4">
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
              <div className="w-full mb-2">
                <span className="text-sm">
                  <button type="submit" className="font-bold p-0 hover:bg-none">
                    Has olvidado tu contraseña?
                  </button>
                </span>
              </div>
              <span className="text-sm">
                No tienes cuenta?
                <Link
                  className="ml-2 font-bold underline hover hover:text-gray-600"
                  to="/store/sign-up"
                >
                  Regístrate
                </Link>
              </span>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full uppercase"
            >
              {submitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

type SignInFormErrors = {
  email?: string;
  password?: string;
  apiError?: string;
};
