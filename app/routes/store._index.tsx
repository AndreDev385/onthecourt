import { useLoaderData } from "@remix-run/react";
import ErrorDisplay from "~/components/shared/error";
import { Carousel } from "~/components/store/landing/carousel";
import Hero from "~/components/store/landing/hero";
import { HomeProducts } from "~/components/store/landing/homeProducts";
import SportsBanner from "~/components/store/layout/banner";
import { getLandingInfo } from "~/lib/api/cms/info";
import { getHomeProducts } from "~/lib/api/products/homeProducts";

export async function loader() {
  const { data: products, errors } = await getHomeProducts();
  if (errors && Object.values(errors).length > 0) {
    throw new Response("Ha ocurrido un error al cargar los productos", {
      status: 500,
    });
  }

  const { data: landingInfo, errors: landingErrors } = await getLandingInfo();
  if (landingErrors && Object.values(landingErrors).length > 0)
    throw new Response(
      "Ha ocurrido un error al cargar la información de inicio",
      {
        status: 500,
      }
    );

  return { products, ...landingInfo };
}

export default function LandingPage() {
  const { products, carouselImages, promotions, banner } =
    useLoaderData<typeof loader>();

  return (
    <div>
      {
        banner ? (
          <SportsBanner message={banner.text} visible={banner.active} />
        ) : null
      }
      <section className="" id="hero">
        <Hero />
      </section>
      <section className="my-24" id="brands">
        <div className="max-w-7xl px-6 mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex justify-start items-center">
              <img className="w-48" src="/kimbow_logo.svg" alt="kimbow logo" />
            </div>
            <div className="flex justify-center items-center">
              <img className="w-48" src="/everlast_logo.svg" alt="everlast logo" />
            </div>
            <div className="flex justify-end items-center">
              <img className="w-48" src="/prince_logo.png" alt="prince logo" />
            </div>
          </div>
        </div>
      </section>
      <section id="carousel">
        {
          carouselImages ? (
            <Carousel carouselImages={carouselImages} />
          ) : null
        }
      </section>
      <section className="my-24" id="popular">
        <HomeProducts products={products ?? []} />
      </section>
      <section id="banner">
        {
          promotions ? (
            <Carousel carouselImages={promotions} />
          ) : null
        }
      </section>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
