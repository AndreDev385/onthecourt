import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  CategoryForm,
  CategoryFormErrors,
} from "~/components/admin/categories/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getCategories } from "~/lib/api/categories/getCategories";
import { getCategory } from "~/lib/api/categories/getCategory";
import { updateCategory } from "~/lib/api/categories/updateCategory";
import { FORM_INTENTS } from "~/lib/constants";
import { Category } from "~/types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const intent = formData.get("intent");

  const errors: CategoryFormErrors = {};

  if (!_id) errors.apiError = true;
  if (!name) errors.name = "El nombre es obligatorio";

  const { data: categories } = await getCategories();
  if (
    (intent === FORM_INTENTS.create || intent === FORM_INTENTS.update) &&
    categories?.find(
      (category) => category.name.toLowerCase() === String(name).toLowerCase()
    )
  ) {
    errors.name = "Ya existe una categoria con ese nombre";
  }

  if (Object.values(errors).length > 0) {
    return { errors, intent: String(intent) };
  }

  // call endpoint
  try {
    if (intent === FORM_INTENTS.activate) {
      await updateCategory({
        _id: _id as string,
        active: true,
      });
    } else if (intent === FORM_INTENTS.deactivate) {
      await updateCategory({
        _id: _id as string,
        active: false,
      });
    } else if (intent === FORM_INTENTS.update) {
      await updateCategory({
        _id: _id as string,
        name: name as string,
      });
    }
  } catch (error) {
    errors.apiError = true;
    return { errors, intent: String(intent) };
  }

  return { errors, intent: String(intent) };
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Error al buscar datos del usuario");

  const { data: category, errors } = await getCategory(params.id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al buscar datos del usuario");
  }

  invariant(category, "Error al buscar datos del usuario");
  return category;
}

export default function EditCategoryPage() {
  const category = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar categoría</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/categories/list">
              <Icon icon="arrow-left" />
              CATEGORÍAS
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <CategoryForm
            isUpdate={true}
            category={category as Category}
            errors={actionData?.errors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
