import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  CategoryForm,
  CategoryFormErrors,
} from "~/components/admin/categories/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createCategory } from "~/lib/api/categories/createCategory";
import { getCategories } from "~/lib/api/categories/getCategories";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");

  const errors: CategoryFormErrors = {};
  if (!name) errors.name = "El nombre es obligatorio";

  // check if category already exists
  const { data: categories } = await getCategories();
  if (
    categories?.find(
      (category) => category.name.toLowerCase() === String(name).toLowerCase()
    )
  ) {
    errors.name = "Ya existe una categoria con ese nombre";
  }

  if (Object.values(errors).length > 0) {
    return errors;
  }

  // call endpoint
  const { data, errors: apiErrors } = await createCategory(String(name)); //

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = true;
    return errors;
  }

  invariant(data, "Error al crear categoría");
  return redirect(`/admin/categories/${data._id}`);
}

export default function CreateCategoryPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear Categoría</h1>
          <Link to="/admin/categories/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              CATEGORÍAS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <CategoryForm isUpdate={false} errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
