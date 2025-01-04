import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ProductForm } from "~/components/admin/products/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getCreateProductInfo } from "~/lib/api/products/getCreateProductInfo";

export async function loader() {
  const { data, errors } = await getCreateProductInfo();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar productos");
  }

  invariant(data, "Error al cargar productos");
  invariant(process.env.TINY_KEY, "Error al cargar `TINY_KEY`");

  return {
    ...data,
    TINY_KEY: process.env.TINY_KEY,
  };
}

export default function CreateProductPage() {
  const { brands, categories, locations, TINY_KEY } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <Card className="mt-16 max-w-[1200px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear producto</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/products/list" replace>
              <Icon icon="arrow-left" />
              PRODUCTOS
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ProductForm
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
