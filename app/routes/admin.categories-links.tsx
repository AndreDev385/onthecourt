import { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Loader2 } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { getCategories } from "~/lib/api/categories/getCategories";
import { getFeaturedCategories } from "~/lib/api/cms/getCategories";
import { updateFeaturedCategories } from "~/lib/api/cms/updateCategories";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const categories = formData
    .getAll("category")
    .filter((c) => c !== "none" && c !== "")
    .map(String);

  const { errors } = await updateFeaturedCategories({ categories });

  if (errors && Object.values(errors).length > 0) {
    return {
      success: false,
      error: "Ha ocurrido un error al actualizar las categorías destacadas",
    };
  }

  return { success: true, error: "" };
}

export async function loader() {
  const { data: categories, errors } = await getCategories();
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar categorías");
  }
  invariant(categories, "No se pudieron cargar las categorías");

  const { data: featuredCategories, errors: featuredCategoriesErrors } =
    await getFeaturedCategories();
  if (
    featuredCategoriesErrors &&
    Object.values(featuredCategoriesErrors).length > 0
  )
    throw new Error("Error al cargar categorías destacadas");

  return { categories, featuredCategories: featuredCategories?.categories ?? [] };
}

export default function CategoriesLinksPage() {
  const { categories, featuredCategories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  const { toast } = useToast();

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "Categorías destacadas actualizadas",
        });
      }
      if (actionData?.error) {
        toast({
          title: "Error",
          description: actionData.error,
        });
      }
    },
    [toast, actionData]
  );

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-bold">
            Configurar categorías destacadas
          </h1>
        </CardHeader>
        <CardContent>
          <Form method="POST">
            <div className="flex flex-col gap-4 lg:flex-row mb-8">
              <div className="flex flex-col gap-2 lg:w-1/2">
                <Label>Categoría 1</Label>
                <Select
                  name="category"
                  defaultValue={
                    featuredCategories[0] ? featuredCategories[0]._id : "none"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Seleccione una opción</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 lg:w-1/2">
                <Label>Categoría 2</Label>
                <Select
                  name="category"
                  defaultValue={
                    featuredCategories[1] ? featuredCategories[1]._id : "none"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Seleccione una opción</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row mb-8">
              <div className="flex flex-col gap-2 lg:w-1/2">
                <Label>Categoría 3</Label>
                <Select
                  name="category"
                  defaultValue={
                    featuredCategories[2] ? featuredCategories[2]._id : "none"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Seleccione una opción</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 lg:w-1/2">
                <Label>Categoría 4</Label>
                <Select
                  name="category"
                  defaultValue={
                    featuredCategories[3] ? featuredCategories[3]._id : "none"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Seleccione una opción</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row mb-8">
              <div className="flex flex-col gap-2 lg:w-1/2">
                <Label>Categoría 5</Label>
                <Select
                  name="category"
                  defaultValue={
                    featuredCategories[4] ? featuredCategories[4]._id : "none"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Seleccione una opción</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    Actualizando...
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Actualizar"
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
