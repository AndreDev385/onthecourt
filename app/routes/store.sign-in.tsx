import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  ShouldRevalidateFunctionArgs,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import { commitSession, getSession } from "~/clientSessions";
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
import { useToast } from "~/hooks/use-toast";
import { resetPassword } from "~/lib/api/auth/resetPassword";
import { signIn } from "~/lib/api/auth/signIn";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (String(form.intent) === "forgotPassword") {
    return handleResetPassword(form);
  }

  return handleSignIn(request, form);
}

export function shouldRevalidate({ nextUrl }: ShouldRevalidateFunctionArgs) {
  return nextUrl.pathname === "/store";
}

export default function SignInPage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const submitting = navigation.state === "submitting";
  const { toast } = useToast();

  React.useEffect(
    function showToast() {
      if (actionData?.intent === "forgotPassword") {
        if (actionData.success) {
          toast({
            title: "Éxito",
            description:
              "Se te ha enviado un correo para reestablecer tu contraseña",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: actionData.errors?.apiError,
          });
        }
      }
    },
    [actionData, toast]
  );

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
                  <Button
                    variant="ghost"
                    type="submit"
                    name="intent"
                    value="forgotPassword"
                    className="font-bold p-0"
                  >
                    Has olvidado tu contraseña?
                  </Button>
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
              {submitting ? (
                <>
                  Ingresando...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

async function handleSignIn(request: Request, form: Record<string, FormDataEntryValue>) {
  const errors: SignInFormErrors = {};
  if (!String(form.email)) errors.email = "El email es obligatorio";
  if (!String(form.password)) errors.password = "La contraseña es obligatoria";

  if (Object.values(errors).length > 0)
    return { errors, intent: String(form.intent), success: false };

  const { data, errors: apiErrors } = await signIn(
    String(form.email).toLowerCase(),
    String(form.password)
  );

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = "Ha ocurrido un error. No ha sido posible iniciar sesión";
    return { errors, intent: String(form.intent), success: false };
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

async function handleResetPassword(form: {
  [key: string]: FormDataEntryValue;
}) {
  const formErrors: SignInFormErrors = {};
  if (!String(form.email)) {
    formErrors.email = "Ingresa tu email y vuelve a intentarlo";
    return {
      success: false,
      intent: String(form.intent),
      errors: formErrors,
    };
  }

  const { data, errors } = await resetPassword(
    String(form.email).toLowerCase()
  );

  if (errors && Object.values(formErrors).length > 0) {
    formErrors.apiError = "Ha ocurrido un error";
    return {
      success: false,
      errors: formErrors,
      intent: String(form.intent),
    };
  }
  invariant(data);

  if (!data.success) {
    formErrors.apiError = "Ha ocurrido un error";
    return {
      success: false,
      errors: formErrors,
      intent: String(form.intent),
    };
  }

  return {
    success: true,
    intent: String(form.intent),
  };
}

type SignInFormErrors = {
  email?: string;
  password?: string;
  apiError?: string;
};

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
