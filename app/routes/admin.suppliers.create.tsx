import { ActionFunctionArgs } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export async function action({ request }: ActionFunctionArgs) {
  // TODO: finish this section after completing Product CRUD
  return null;
}

export default function CreateSupplierPage() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear proveedor</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/suppliers/list">
              <Icon icon="arrow-left" />
              OPCIONES DE ENVÍO
            </Link>
          </Button>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
