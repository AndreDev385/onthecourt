import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useToast } from "~/hooks/use-toast";
import { getBanner } from "~/lib/api/cms/getBanner";
import { updateBanner } from "~/lib/api/cms/updateBanner";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    text: String(formData.get("text")),
    active: !!formData.get("active"),
  };

  const { errors } = await updateBanner(data);

  if (errors && Object.values(errors).length > 0) {
    return {
      success: false,
      error: "Ha ocurrido un error al guardar los datos del banner",
    };
  }

  return { success: true, error: "" };
}

export async function loader() {
  const { data, errors } = await getBanner();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar datos del banner");
  }
  return data;
}

export default function BannerPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  const { toast } = useToast();

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "Datos del banner guardados!",
        });
      }
      if (actionData?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: actionData.error,
        });
      }
    },
    [actionData, toast]
  );

  return (
    <section className="mx-auto py-10 max-w-[800px]">
      <div className="flex justify-start items-center">
        <h2 className="text-gray-600 text-2xl font-semibold">Banner</h2>
      </div>
      <Form method="POST">
        <Card className="my-4 p-6">
          <div className="mb-4">
            <Label>Texto</Label>
            <Input
              placeholder="Banner"
              name="text"
              defaultValue={data?.banner.text}
            />
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <Switch id="active" name="active" defaultChecked={data?.banner.active ?? false} />
            <Label htmlFor="active">Activo</Label>
          </div>
          <div className="flex justify-end">
            <Button disabled={submitting} type="submit">
              {submitting ? (
                <>
                  Guardando...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </Card>
      </Form>
    </section>
  );
}
