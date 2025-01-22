import React from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { SlideForm } from "~/components/admin/cms/slideForm";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { getPromotions } from "~/lib/api/cms/getPromotions";
import { updatePromotions } from "~/lib/api/cms/updatePromotions";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    title: formData.getAll("title"),
    description: formData.getAll("description"),
    url: formData.getAll("url"),
  };

  const promotions: { title: string; description: string; url: string }[] = [];

  console.log({ data });

  for (const idx in data.url) {
    if (String(data.url[idx]) == "") {
      return { error: "Todos los slides deben tener una imagen" };
    }
    promotions.push({
      title: String(data.title[idx]),
      description: String(data.description[idx]),
      url: String(data.url[idx]),
    });
  }
  console.log({ promotions });

  const { errors } = await updatePromotions({ promotions });

  if (errors && Object.values(errors).length > 0) {
    return {
      success: false,
      error: "Ha ocurrido un error al guardar las promociones",
    };
  }

  return { success: true };
}

export async function loader() {
  const { data, errors } = await getPromotions();
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error cargando promociones");
  }
  invariant(data, "Error cargando promociones");
  return data;
}

export default function PromotionsPage() {
  const { promotions: _promotions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";
  const { toast } = useToast();

  const [promotions, setPromotions] = React.useState(_promotions);
  function addSlide() {
    setPromotions((prevState) => [
      ...prevState,
      { title: "", description: "", url: "" },
    ]);
  }
  function removeSlide(idx: number) {
    setPromotions((prevState) => prevState.filter((_, i) => i !== idx));
  }

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "Las promociones han sido guardadas",
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
      <div className="flex justify-between items-center">
        <h2 className="text-gray-600 text-2xl font-semibold">Promociones</h2>
        <div>
          <Button onMouseDown={addSlide} variant="ghost">
            Agregar Slide <Plus />
          </Button>
        </div>
      </div>
      <Form method="POST">
        {promotions.map((item, idx) => (
          <SlideForm
            removeSlide={removeSlide}
            key={item.url}
            idx={idx}
            item={item}
          />
        ))}
        <Separator className="my-4" />
        <div className="px-4 flex justify-end">
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
      </Form>
    </section>
  );
}
