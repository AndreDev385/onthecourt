import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import { Loader2, Minus, Plus } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import { ProductPhotoSlider } from "~/components/store/products/productPhotoSlider";
import { ProductRating } from "~/components/store/products/productRating";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { addItemToCart } from "~/lib/api/cart/addItemToCart";
import { getProduct } from "~/lib/api/products/getProduct";
import { CurrentUser } from "~/lib/api/users/getCurrentUser";
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
    shopCartId: String(shopCartId),
    variantValueId: String(variantValueId),
    productId: String(productId),
    quantity: Number(quantity),
  };

  const errors: FormErrors = {};

  invariant(productId, "Ha ocurrido un error al agregar al carrito");
  invariant(shopCartId, "Ha ocurrido un error al agregar al carrito");

  if (!variantValueId) errors.variantValueId = "Selecciona una variante";
  if (!quantity) errors.quantity = "Ingresa una cantidad";
  if (isNaN(Number(quantity))) errors.quantity = "Ingresa un número válido";
  if (Number(quantity) < 1) errors.quantity = "Ingresa un número mayor a 0";

  if (Object.keys(errors).length > 0) return { errors, success: false };

  const { errors: apiErrors } = await addItemToCart(item);

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiErrors = "Error al agregar al carrito";
    return { errors, success: false };
  }

  return { success: true };
}

export default function ProductDetailPage() {
  const currentUser: CurrentUser | null | undefined =
    useRouteLoaderData("routes/store");
  const { product } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";

  const { toast } = useToast();

  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariantOptions, setSelectedVariantOptions] = React.useState<
    string[]
  >([]);
  const [selectedVariant, setSelectedVariant] =
    React.useState<SelectedVariant | null>(null);
  const [total, setTotal] = React.useState(0);
  const [compareTotal, setCompareTotal] = React.useState(0);

  function updateQuantity(value: "increase" | "decrease") {
    if (value === "increase") {
      setQuantity(quantity + 1);
    } else {
      if (quantity === 1) return;
      setQuantity(quantity - 1);
    }
  }

  function changeVariantsValue(value: string, variantIndex: number) {
    const values: Array<string> = [...selectedVariantOptions];
    values.splice(variantIndex, 1, value);
    setSelectedVariantOptions(values);
  }

  const findVariantValue = React.useCallback(
    () =>
      product.variantValues.find((variantValue) =>
        Object.values(variantValue.value).every((v, idx) =>
          v ? v == selectedVariantOptions[idx] : true
        )
      ),
    [product.variantValues, selectedVariantOptions]
  );

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "El producto ha sido agregado al carrito",
        });
      } else if (actionData?.errors?.apiErrors) {
        toast({
          variant: "destructive",
          title: "Error",
          description: actionData.errors.apiErrors,
        });
      }
    },
    [actionData, toast]
  );

  React.useEffect(
    function selectVariant() {
      const variantValue = findVariantValue();
      if (variantValue) {
        setSelectedVariant(variantValue);
      }
    },
    [findVariantValue, selectedVariantOptions]
  );

  React.useEffect(
    function calculateTotal() {
      if (selectedVariant) {
        setTotal(selectedVariant.price * quantity);
        setCompareTotal(selectedVariant.compareAtPrice * quantity);
      } else if (product.variantValues.length > 0) {
        setTotal(product.variantValues[0].price * quantity);
        setCompareTotal(product.variantValues[0].compareAtPrice * quantity);
      }
    },
    [selectedVariant, quantity, product]
  );

  return (
    <div className="my-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 px-4 container mx-auto">
        {/* Div for desktop */}
        <div className="col-span-8 hidden lg:block top-24 self-start md:sticky">
          <div className="flex justify-center">
            <ProductPhotoSlider isMobile={false} photos={product.photos} />
          </div>
        </div>
        {/* aside for desktop - mobile complete*/}
        <aside className="relative max-lg:mb-10 lg:col-span-4">
          {/* General Info */}
          <div className="mb-4">
            <div className="grid grid-cols-[1fr,auto] items-baseline gap-x-4 gap-y-2 lg:grid-cols-1">
              <h1 className="text-2xl font-bold lg:text-3.3xl">
                {product.title}
              </h1>
              <div className="lg:order-last font-bold flex gap-2">
                <div className="text-green-700">
                  $
                  {selectedVariant
                    ? formatMoney(selectedVariant.price)
                    : formatMoney(
                        product.variantValues.length > 0
                          ? product.variantValues[0].price
                          : 0
                      )}
                </div>
                <div className="text-red-500 line-through">
                  $
                  {selectedVariant
                    ? formatMoney(selectedVariant.compareAtPrice)
                    : formatMoney(
                        product.variantValues.length > 0
                          ? product.variantValues[0].compareAtPrice
                          : 0
                      )}
                </div>
              </div>
              <div>
                {product?.description ? (
                  <div
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
            <ProductPhotoSlider isMobile photos={product.photos} />
          </div>
          {/* Variants*/}
          <div className="mb-4">
            {product?.variants?.map((variant, index1) => (
              <>
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
                      <Button
                        variant={
                          selectedVariantOptions.includes(tag)
                            ? "default"
                            : "outline"
                        }
                        type="button"
                        onClick={() => changeVariantsValue(tag, index1)}
                      >
                        {tag}
                      </Button>
                    </li>
                  ))}
                </ul>
                {actionData?.errors?.variantValueId ? (
                  <p className="text-sm text-red-500">
                    {actionData.errors.variantValueId}
                  </p>
                ) : null}
              </>
            ))}
          </div>
          {/* Form */}
          <Form method="POST">
            <input
              type="hidden"
              name="shopCartId"
              value={currentUser?.client.shopCart._id}
            />
            <input
              type="hidden"
              name="variantValueId"
              value={selectedVariant?._id}
            />
            <input type="hidden" name="productId" value={product._id} />
            {/* Quantity */}
            <div className="mb-8">
              <Label className="text-lg font-normal" htmlFor="quantity">
                Cantidad
              </Label>
              <div className="flex items-center gap-2 my-2">
                <Button
                  variant="outline"
                  type="button"
                  onMouseDown={() => updateQuantity("decrease")}
                >
                  <Minus />
                </Button>
                <Input
                  id="quantity"
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
              <p className="text-sm text-gray-700">
                {selectedVariant?.quantity ?? 0} unidades disponibles
              </p>
              {selectedVariant && selectedVariant.quantity! < quantity ? (
                <p className="text-sm text-red-500">
                  No disponemos de la cantidad solicitada para este producto
                </p>
              ) : null}
              {actionData?.errors?.quantity ? (
                <p className="text-sm text-red-500">
                  {actionData.errors.quantity}
                </p>
              ) : null}
            </div>
            {/* ADD TO CART */}
            {currentUser ? (
              <Button
                disabled={!selectedVariant || submitting}
                className="w-full uppercase font-bold py-6"
                type="submit"
              >
                {submitting ? (
                  <>
                    Agregando...
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Agregar al carrito - ${formatMoney(total)}{" "}
                    <span className="line-through text-red-500">
                      ${formatMoney(compareTotal)}
                    </span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled={!selectedVariant}
                className="w-full uppercase font-bold py-6"
              >
                <Link to="/store/sign-in">
                  Agregar al carrito - ${formatMoney(total)}{" "}
                  <span className="line-through text-red-500">
                    ${formatMoney(compareTotal)}
                  </span>
                </Link>
              </Button>
            )}
          </Form>
        </aside>
      </div>
    </div>
  );
}

type SelectedVariant = {
  _id: string;
  value: {
    variant1: string;
    variant2?: string;
    variant3?: string;
  };
  price: number;
  compareAtPrice: number;
  location: { _id: string };
  quantity?: number;
};

type FormErrors = {
  variantValueId?: string;
  quantity?: string;
  apiErrors?: string;
};
