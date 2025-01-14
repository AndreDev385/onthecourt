import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ProductCardSlider } from "~/components/store/products/productSlider";
import { getProducts } from "~/lib/api/products/getProducts";

export async function loader() {
  const { data, errors } = await getProducts();

  if (errors && Object.values(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  invariant(data, "Error al buscar productos");
  return data;
}

export default function LandingPage() {
  const { items, pageInfo } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto">
      <section id="hero">Hero Section</section>
      <section id="promotions">Promotions Section</section>
      <section id="popular">Popular Section</section>
      <section className="px-4">
        <ProductCardSlider products={items} />
      </section>
    </div>
  );
}
