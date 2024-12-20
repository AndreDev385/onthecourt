import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { validateEmail } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const errors: Record<string, string> = {};

  console.log(values);

  if (!values.email) errors.email = "Correo Electrónico es requerido";
  if (values.email && !validateEmail(values.email as string))
    errors.email = "Correo Electrónico no válido";
  if (!values.password) errors.password = "Contraseña es requerida";
  if (values.password && (values.password as string).length < 8)
    errors.password = "Contraseña debe tener al menos 8 caracteres";

  if (Object.values(errors).length > 0) {
    console.log(errors);
    return Response.json({ errors }, { status: 400 });
  }

  return redirect("/admin/users");
}

export default function SignIn() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center items-center h-screen">
      <Form method="POST">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 mb-4">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                />
                {actionData?.errors?.email ? (
                  <span className="text-red-500 text-sm">
                    {actionData.errors.email}
                  </span>
                ) : null}
              </div>
              {/* password */}
              <div className="flex flex-col gap-4 mb-4">
                <Label htmlFor="password" className="w-full block">
                  Contraseña
                </Label>
                <Input type="password" name="password" placeholder="********" />
                {actionData?.errors?.password ? (
                  <span className="text-red-500 text-sm">
                    {actionData.errors.password}
                  </span>
                ) : null}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="block w-full rounded transition duration-500 ease-out text-center bg-primary text-white cursor-pointer px-4 py-1 lg:p-2 lg:px-4"
              name="intent"
              value="signin"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando Sesión..." : "Iniciar Sesión"}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
