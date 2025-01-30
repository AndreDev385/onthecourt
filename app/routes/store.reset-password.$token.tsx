import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";
import ErrorDisplay from "~/components/shared/error";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { changePassword } from "~/lib/api/auth/changePassword";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (String(form.password).length < 8) {
    return {
      errors: {
        password: "La contraseña debe tener al menos 8 caracteres",
      },
    };
  }

  if (String(form.rePassword) !== String(form.password)) {
    return {
      errors: {
        rePassword: "Las contraseñas no coinciden",
      },
    };
  }

  const { data, errors } = await changePassword({
    token: String(form.token),
    password: String(form.password),
  });

  if ((errors && Object.values(errors).length > 0) || !data?.success) {
    return {
      errors: {
        apiError: "Ha ocurrido un error al intentar reestablecer la contraseña",
      },
    };
  }

  return redirect("/store/sign-in");
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.token)
    throw new Response("Esta pagina no se encuentra disponible", {
      status: 404,
    });

  return { token: params.token };
}
export default function ResetPasswordPage() {
  const { token } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  return (
    <div className="px-4 lg:px-0 my-16">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Cambiar contraseña</h1>
        </CardHeader>
        <Form method="POST">
          <input type="hidden" name="token" value={token} />
          <CardContent className="flex flex-col gap-4">
            <div className="mb-4">
              <Label>Contraseña</Label>
              <Input name="password" type="password" required />
              {actionData?.errors?.password ? (
                <p className="text-sm text-red-500">
                  {actionData.errors.password}
                </p>
              ) : null}
            </div>
            <div className="mb-4">
              <Label>Repetir contraseña</Label>
              <Input name="rePassword" type="password" required />
              {actionData?.errors?.rePassword ? (
                <p className="text-sm text-red-500">
                  {actionData.errors.rePassword}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              name="intent"
              value="changePassword"
              disabled={submitting}
              className="w-full uppercase"
            >
              {submitting ? (
                <>
                  Cargando...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Aceptar"
              )}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
