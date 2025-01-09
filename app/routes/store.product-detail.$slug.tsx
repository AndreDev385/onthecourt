import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Minus, Plus } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import { ProductRating } from "~/components/store/products/productRating";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getProduct } from "~/lib/api/products/getProduct";
import { formatMoney } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.slug, "Id de producto no encontrado");
  const { data, errors } = await getProduct(params.slug);

  if (errors && Object.values(errors).length > 0)
    throw new Error("Error al cargar producto");
  invariant(data, "Error al cargar producto");

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const shopCartId = form.get("shopCartId");
  const variantValueId = form.get("variantValueId");
  const productId = form.get("productId");
  const quantity = form.get("quantity");

  const item = {
    shopCartId,
    variantValueId,
    productId,
    quantity,
  };

  console.log(item);
}

export default function ProductDetailPage() {
  const { product } = useLoaderData<typeof loader>();

  const [quantity, setQuantity] = React.useState(1);

  function updateQuantity(value: "increase" | "decrease") {
    if (value === "increase") {
      setQuantity(quantity + 1);
    } else {
      if (quantity === 1) return;
      setQuantity(quantity - 1);
    }
  }

  return (
    <div className="my-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 px-6">
        {/* Div for desktop */}
        <div className="col-span-7 hidden lg:block top-24 self-start md:sticky"></div>
        {/* aside for desktop - mobile complete*/}
        <aside className="relative max-lg:mb-10 lg:col-span-5">
          {/* General Info */}
          <div className="mb-4">
            <div className="grid grid-cols-[1fr,auto] items-baseline gap-x-4 gap-y-2 lg:grid-cols-1">
              <h1 className="text-2xl font-bold lg:text-3.3xl">
                {product.title}
              </h1>
              <div className="lg:order-last font-bold">
                ${formatMoney(product.price)}
              </div>
              <div>
                {product?.description ? (
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: product?.description ?? "",
                    }}
                  ></div>
                ) : null}
              </div>
            </div>
            <ProductRating rating={product.rating} />
          </div>
          {/* Images in mobile for mobile */}
          <div className="lg:hidden -mx-6 mb-4">
            <img
              className="w-full h-full object-cover"
              src={product.photos[0]}
              alt="product"
            />
          </div>
          {/* Variants*/}
          <div className="mb-4">
            {product?.variants?.map((variant, index1) => (
              <ul className="mb-4" key={`${variant}__${index1}`}>
                <li className="text-lg leading-normal capitalize mb-2">
                  {variant.title}{" "}
                  <span className="text-base leading-normal font-semibold text-primary capitalize"></span>
                </li>
                {/* Variant values */}
                {variant?.tags?.map((tag, index2) => (
                  <li
                    className="inline-block mr-2 mb-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    key={`${tag}__${index2}`}
                  >
                    <Button variant="outline" type="button">
                      {tag}
                    </Button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          {/* Quantity */}
          <div className="mb-4">
            <Label className="text-lg font-normal" htmlFor="quantity">
              Cantidad
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                type="button"
                onMouseDown={() => updateQuantity("decrease")}
              >
                <Minus />
              </Button>
              <Input
                name="quantity"
                className="w-16 text-center"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                type="number"
                min={1}
                max={10}
              />
              <Button
                variant="outline"
                type="button"
                onMouseDown={() => updateQuantity("increase")}
              >
                <Plus />
              </Button>
            </div>
          </div>
          {/* ADD TO CART */}
          <Button className="w-full uppercase font-bold py-6" type="submit">
            Agregar al carrito - ${formatMoney(product.price * quantity)}
          </Button>
        </aside>
      </div>
    </div>
  );
}
