import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ErrorDisplay from "~/components/shared/error";
import { ProductCard } from "~/components/store/products/productCard";
import { getBrands } from "~/lib/api/brands/getBrands";
import { getCategories } from "~/lib/api/categories/getCategories";
import { getProducts } from "~/lib/api/products/getProducts";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.page, "Página no encontrada");
  invariant(!isNaN(Number(params.page)), "Página no es un numero");

  const url = new URL(request.url);
  const brand = url.searchParams.get("brand");
  const categories = url.searchParams.getAll("category");

  const { data: brands, errors: brandErrors } = await getBrands();
  const { data: categoriesData, errors: categoryErrors } =
    await getCategories();

  const { data, errors } = await getProducts(Number(params.page), {
    brand,
    categories,
  });

  if (errors && Object.values(errors).length > 0)
    throw new Response("Ha ocurrido un error al buscar productos", {
      status: 500,
    });
  if (brandErrors && Object.values(brandErrors).length > 0)
    throw new Response("Ha ocurrido un error al buscar productos", {
      status: 500,
    });
  if (categoryErrors && Object.values(categoryErrors).length > 0)
    throw new Response("Ha ocurrido un error al buscar productos", {
      status: 500,
    });

  invariant(data, "Ha ocurrido un error al buscar productos");
  invariant(brands, "Ha ocurrido un error al buscar productos");
  invariant(categoriesData, "Ha ocurrido un error al buscar productos");

  return { ...data, brands, categories: categoriesData };
}

export default function Page() {
  const { items } = useLoaderData<typeof loader>();

  return (
    <div className="my-16 px-2 grid grid-cols-1 gap-4 md:grid-cols-[auto,1fr]">
      <div></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.slug} product={item} />
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
