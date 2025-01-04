import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { UpdateProductForm } from "~/components/admin/products/updateProductForm";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getEditProductInfo } from "~/lib/api/products/getProduct";
import { Product } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  invariant(id, "Error al cargar producto");

  const { data, errors } = await getEditProductInfo(id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar producto");
  }

  invariant(data, "Error al cargar producto");

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar productos");
  }

  invariant(process.env.TINY_KEY, "Error al cargar `TINY_KEY`");

  return {
    ...data,
    TINY_KEY: process.env.TINY_KEY,
  };
}

export default function EditProductPage() {
  const { product, locations, categories, brands, TINY_KEY } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <Card className="mt-16  mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar producto</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/products/list">
              <Icon icon="arrow-left" />
              PRODUCTOS
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <UpdateProductForm
            product={product as Product}
            brands={brands}
            categories={categories}
            locations={locations}
            TINY_KEY={TINY_KEY}
          />
        </CardContent>
      </Card>
    </div>
  );
}
