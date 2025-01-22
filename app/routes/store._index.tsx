import { useLoaderData, useRouteError } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Carousel } from "~/components/store/landing/carousel";
import Hero from "~/components/store/landing/hero";
import { HomeProducts } from "~/components/store/landing/homeProducts";
import { getLandingInfo } from "~/lib/api/cms/info";
import { getHomeProducts } from "~/lib/api/products/homeProducts";

export async function loader() {
  const { data: products, errors } = await getHomeProducts();
  if (errors && Object.values(errors).length > 0)
    throw new Error("Ha ocurrido un error al cargar los productos");
  invariant(products, "Ha ocurrido un error al cargar los productos");

  const { data: landingInfo, errors: landingErrors } = await getLandingInfo();
  if (landingErrors && Object.values(landingErrors).length > 0)
    throw new Error("Ha ocurrido un error al cargar la información de inicio");
  invariant(
    landingInfo,
    "Ha ocurrido un error al cargar la información de inicio"
  );
  return { products, ...landingInfo };
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  return <div>Ha ocurrido un error</div>;
}

export default function LandingPage() {
  const { products, carouselImages, promotions } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <section className="" id="hero">
        <Hero />
      </section>
      <section id="popular">
        <HomeProducts products={products} />
      </section>
      <section id="carousel">
        <Carousel carouselImages={carouselImages} />
      </section>
      <section id="banner">
        <Carousel carouselImages={promotions} />
      </section>
    </div>
  );
}
