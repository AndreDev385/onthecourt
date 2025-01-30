import { useLoaderData } from "@remix-run/react";
import { X } from "lucide-react";
import { useState } from "react";
import invariant from "tiny-invariant";
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
  invariant(products, "Ha ocurrido un error al cargar los productos");

  const { data: landingInfo, errors: landingErrors } = await getLandingInfo();
  if (landingErrors && Object.values(landingErrors).length > 0)
    throw new Response(
      "Ha ocurrido un error al cargar la información de inicio",
      {
        status: 500,
      }
    );
  invariant(
    landingInfo,
    "Ha ocurrido un error al cargar la información de inicio"
  );
  return { products, ...landingInfo };
}

export default function LandingPage() {
  const { products, carouselImages, promotions, banner } =
    useLoaderData<typeof loader>();

  const [showBanner, setShowBanner] = useState(banner.active)

  return (
    <div>
      <SportsBanner message={banner.text} visible={showBanner} />
      <section className="" id="hero">
        <Hero />
      </section>
      <section id="brands">
        <div className="max-w-4xl mx-auto my-24">
          <div className="grid grid-cols-4">
            <div className="flex justify-center items-center">
              <img className="w-20 h-20" src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Everlast-logo-2011.svg" alt="everlast logo" />
            </div>
            <div className="flex justify-center items-center">
              <img className="w-20 h-20" src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Everlast-logo-2011.svg" alt="everlast logo" />
            </div>
            <div className="flex justify-center items-center">
              <img className="w-20 h-20" src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Everlast-logo-2011.svg" alt="everlast logo" />
            </div>
            <div className="flex justify-center items-center">
              <img className="w-20 h-20" src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Everlast-logo-2011.svg" alt="everlast logo" />
            </div>
          </div>
        </div>
      </section>
      <section id="carousel">
        <Carousel carouselImages={carouselImages} />
      </section>
      <section id="popular">
        <HomeProducts products={products} />
      </section>
      <section id="banner">
        <Carousel carouselImages={promotions} />
      </section>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
