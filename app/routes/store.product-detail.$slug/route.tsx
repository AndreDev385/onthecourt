import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { ProductCommentsSection } from "~/components/store/products/comments";
import { ProductPhotoSlider } from "~/components/store/products/productPhotoSlider";
import { useToast } from "~/hooks/use-toast";
import { addItemToCart } from "~/lib/api/cart/addItemToCart";
import { createComment } from "~/lib/api/products/createComment";
import { getProduct } from "~/lib/api/products/getProduct";
import { getProductComments } from "~/lib/api/products/getProductComments";
import { CurrentUser } from "~/lib/api/users/getCurrentUser";
import { GeneralInfo } from "./generalInfo";
import { AddToCartForm, FormErrors } from "./form";
import { Suggestions } from "./suggestions";
import { Variants } from "./variants";
import { Separator } from "~/components/ui/separator";
import ErrorDisplay from "~/components/shared/error";
import { MapPin } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.slug, "Id de producto no encontrado");
  const { data, errors } = await getProduct(params.slug);

  if (errors && Object.values(errors).length > 0)
    throw new Error("Error al cargar producto");
  invariant(data, "Error al cargar producto");

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.intent === "comment") {
    return await handleCreateComment(form);
  }
  return await handleAddProductToCart(form);
}

export default function ProductDetailPage() {
  const data: StoreLayoutData = useRouteLoaderData("routes/store");
  useRouteLoaderData("routes/store");
  const { product, suggestions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const { toast } = useToast();

  const [variantValues, setVariantValues] = React.useState(product.variantValues)
  const [selectedVariantOptions, setSelectedVariantOptions] = React.useState<
    string[]
  >([]);
  const [selectedVariant, setSelectedVariant] =
    React.useState<SelectedVariant | null>(null);

  function changeVariantsValue(value: string, variantIndex: number) {
    const values: Array<string> = [...selectedVariantOptions];
    values.splice(variantIndex, 1, value);
    setSelectedVariantOptions(values);
  }

  const findVariantValue = React.useCallback(
    () =>
      variantValues.find((variantValue) =>
        Object.values(variantValue.value).every((v, idx) =>
          v ? v == selectedVariantOptions[idx] : true
        )
      ),
    [variantValues, selectedVariantOptions]
  );

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description:
            actionData.intent === "comment"
              ? "Tu reseña ha sido publicada"
              : "El producto ha sido agregado al carrito",
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

  React.useEffect(function showLocationToast() {
    if (data?.selectedLocation && Object.values(data?.selectedLocation).length === 0) {
      toast({
        title: "Selecciona una sucursal",
        description: <div className="flex gap-2 justify-start items-center">
          <p>En la parte superior de la navegación</p>
          <MapPin />
        </div>
      })
    }
  }, [])

  React.useEffect(function updatePrice() {
    if (product) {
      if (!product?.isService && data?.selectedLocation) {
        setVariantValues(
          product.variantValues.filter(
            (variantValue) => variantValue.location._id === data?.selectedLocation
          )
        );
      }
    }
  }, [product, data?.selectedLocation]);

  return (
    <div className="my-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 px-4 mx-auto">
        {/* Div for desktop */}
        <div className="col-span-7 hidden lg:block top-24 self-start md:sticky">
          <div className="flex justify-center">
            <ProductPhotoSlider isMobile={false} photos={product.photos} selectedPhoto={selectedVariant?.photo} />
          </div>
        </div>
        {/* aside for desktop - mobile complete*/}
        <aside className="relative max-lg:mb-10 lg:col-span-5">
          {/* General Info */}
          <GeneralInfo
            title={product.title}
            description={product.description}
            rating={product.rating}
            variantValues={variantValues}
            selectedVariant={selectedVariant}
          />
          {/* Images in mobile for mobile */}
          <div className="lg:hidden -mx-6 mb-4">
            <ProductPhotoSlider isMobile photos={product.photos} selectedPhoto={selectedVariant?.photo} />
          </div>
          {/* Variants*/}
          <div className="mb-4">
            <Variants
              product={product}
              selectedVariantOptions={selectedVariantOptions}
              changeVariantsValue={changeVariantsValue}
              actionData={actionData}
            />
          </div>
          {/* Form */}
          <AddToCartForm
            currentUser={data?.user}
            selectedVariant={selectedVariant}
            product={product}
            actionData={actionData}
          />
          {/* TODO location section */}
          {/* Location */}
          {/* Suggestions */}
          <Suggestions suggestions={suggestions} />
        </aside>
      </div>
      {/* Rating and Reviews */}
      <Separator className="my-8" />
      <div className="px-4">
        <ProductCommentsSection
          user={data?.user ?? undefined}
          productId={product._id}
          comments={product.comments}
        />
      </div>
    </div>
  );
}

async function handleCreateComment(form: Record<string, FormDataEntryValue>) {
  const { data, errors } = await getProductComments(String(form.productId));
  if ((errors && Object.values(errors).length > 0) || !data) {
    return {
      errors: { apiErrors: "Error al agregar comentario" } as {
        apiErrors: string;
      } & FormErrors,
      success: false,
      intent: String(form.intent),
    };
  }
  const existingComment = data.comments.find(
    (comment) => comment.client._id === String(form.userId)
  );
  if (existingComment) {
    return {
      errors: { apiErrors: "Ya has agregado una reseña en este producto" },
      success: false,
      intent: String(form.intent),
    };
  }
  const { errors: createErrors } = await createComment({
    userId: String(form.userId),
    productId: String(form.productId),
    text: String(form.opinion),
    rating: Number(form.rating),
  });
  if (createErrors && Object.values(createErrors).length > 0) {
    return {
      errors: { apiErrors: "Error al agregar comentario" },
      success: false,
      intent: String(form.intent),
    };
  }
  return { success: true, intent: String(form.intent) };
}

async function handleAddProductToCart(
  form: Record<string, FormDataEntryValue>
) {
  const errors: FormErrors = {};

  invariant(form.productId, "Ha ocurrido un error al agregar al carrito");
  invariant(form.shopCartId, "Ha ocurrido un error al agregar al carrito");

  if (!form.variantValueId) errors.variantValueId = "Selecciona una variante";
  if (!form.quantity) errors.quantity = "Ingresa una cantidad";
  if (isNaN(Number(form.quantity)))
    errors.quantity = "Ingresa un número válido";
  if (Number(form.quantity) < 1)
    errors.quantity = "Ingresa un número mayor a 0";

  if (Object.keys(errors).length > 0)
    return { errors, success: false, intent: String(form.intent) };

  const { errors: apiErrors } = await addItemToCart({
    shopCartId: String(form.shopCartId),
    variantValueId: String(form.variantValueId),
    productId: String(form.productId),
    quantity: Number(form.quantity),
  });

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiErrors = "Error al agregar al carrito";
    return { errors, success: false, intent: String(form.intent) };
  }

  return { success: true, intent: String(form.intent) };
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
  photo?: string;
  quantity?: number;
};

export function ErrorBoundary() {
  return <ErrorDisplay />;
}

type StoreLayoutData =
  | {
    user: CurrentUser | null | undefined;
    locations: Location[];
    selectedLocation?: string;
  }
  | undefined;

type Location = {
  _id: string;
  name: string;
  address: string;
  active: boolean;
};
