import React from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ActionFunctionArgs } from "@remix-run/node";
import { getCarouselData } from "~/lib/api/cms/getCarouselData";
import { SlideForm } from "~/components/admin/cms/slideForm";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { updateCarouselData } from "~/lib/api/cms/updateCarouselData";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    title: formData.getAll("title"),
    description: formData.getAll("description"),
    url: formData.getAll("url"),
  };

  const carouselData: { title: string; description: string; url: string }[] =
    [];

  for (const idx in data.url) {
    if (String(data.url[idx]) == "") {
      return { error: "Todos los slides deben tener una imagen" };
    }
    carouselData.push({
      title: String(data.title[idx]),
      description: String(data.description[idx]),
      url: String(data.url[idx]),
    });
  }

  const { errors } = await updateCarouselData({ carouselImages: carouselData });

  if (errors && Object.values(errors).length > 0) {
    return {
      success: false,
      error: "Ha ocurrido un error al guardar el carousel",
    };
  }

  return { success: true };
}

export async function loader() {
  const { data, errors } = await getCarouselData();
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error cargando carousel");
  }
  return data;
}

export default function CarouselPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";
  const { toast } = useToast();

  const [carouselImages, setCarouselImages] = React.useState(data?.carouselImages ?? []);
  function addSlide() {
    setCarouselImages((prevState) => [
      ...prevState,
      { title: "", description: "", url: "" },
    ]);
  }
  function removeSlide(idx: number) {
    setCarouselImages((prevState) => prevState.filter((_, i) => i !== idx));
  }

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "El carousel ha sido guardado",
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
        <h2 className="text-gray-600 text-2xl font-semibold">Carousel</h2>
        <div>
          <Button onMouseDown={addSlide} variant="ghost">
            Agregar Slide <Plus />
          </Button>
        </div>
      </div>
      <Form method="POST">
        {carouselImages.map((item, idx) => (
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
