import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import React from "react";
import { commitAdminSession, getAdminSession } from "~/adminSessions";
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
import { signIn } from "~/lib/api/auth/admin-access";
import { validateEmail } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getAdminSession(request.headers.get("Cookie"));
  // success
  if (session.has("token")) {
    return redirect("/admin/products/list");
  }
  // errors
  const data = { error: session.get("error") };
  return new Response(JSON.stringify(data), {
    headers: {
      "Set-Cookie": await commitAdminSession(session),
    },
  });
}

export async function action({ request }: LoaderFunctionArgs) {
  const session = await getAdminSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  const errors: { email?: string; password?: string; apiError?: string } = {};

  if (!email) errors.email = "El correo electrónico es obligatorio";
  if (!validateEmail(String(email)))
    errors.email = "El correo electrónico es inválido";
  if (!password) errors.password = "La contraseña es obligatoria";

  if (Object.values(errors).length > 0) return { errors, success: false };

  const { data, errors: signInErrors } = await signIn(
    String(email),
    String(password)
  );

  if (signInErrors) {
    errors.apiError = "Email o contraseña incorrectos";
    return { errors, success: false };
  }

  if (!data) {
    session.flash("error", "Email o contraseña incorrectos");
    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitAdminSession(session),
      },
    });
  }

  session.set("token", data.token);
  return redirect("/admin/products/list", {
    headers: {
      "Set-Cookie": await commitAdminSession(session),
    },
  });
}

export default function AdminAccessPage() {
  const navigation = useNavigation();
  const { error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();

  React.useEffect(() => {
    if (error?.error) {
      toast({
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  React.useEffect(() => {
    if (actionData) {
      if (actionData.errors?.apiError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: actionData.errors.apiError,
        });
      }
    }
  }, [actionData, toast]);

  const submitting = navigation.state === "submitting";

  return (
    <Form method="POST" className="p-4">
      <Card className="mt-16 max-w-[600px] mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Label>Correo electrónico</Label>
            <Input name="email" type="email" placeholder="john@doe.com" />
            {actionData?.errors?.email ? (
              <p className="text-sm text-red-500">{actionData.errors.email}</p>
            ) : null}
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input name="password" type="password" placeholder="*******" />
            {actionData?.errors?.password ? (
              <p className="text-sm text-red-500">
                {actionData.errors.password}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {submitting ? "Iniciando..." : "Iniciar sesión"}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
