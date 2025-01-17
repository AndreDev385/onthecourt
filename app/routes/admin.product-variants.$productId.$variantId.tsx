import React from "react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { ProductCard } from "~/components/admin/products/productCard";
import { VariantDetailHeader } from "~/components/admin/products/variantDetailHeader";
import { VariantList } from "~/components/admin/products/variantList";
import { InventoryEditForm } from "~/components/admin/products/variants/inventoryEditForm";
import { PricingForm } from "~/components/admin/products/variants/pricingForm";
import { ValueForm } from "~/components/admin/products/variants/valueForm";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getVariant } from "~/lib/api/products/getVariant";
import { FORM_INTENTS } from "~/lib/constants";
import { Product } from "~/types";
import { updateVariantValue } from "~/lib/api/products/updateVariantValue";
import { useToast } from "~/hooks/use-toast";
import { mapIntentToMessage } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const intent = form.get("intent");
  const variantId = form.get("variantId");
  const variant1 = form.get("variant1");
  const variant2 = form.get("variant2");
  const variant3 = form.get("variant3");
  const photo = form.get("photo");
  const price = form.get("price");
  const compareAtPrice = form.get("compareAtPrice");
  const sku = form.get("sku");
  const quantity = form.get("quantity");

  const formErrors: UpdateVariantActionErrors = {};

  /* Errors */
  if (!price) formErrors.price = "El precio es obligatorio";
  if (isNaN(Number(price))) formErrors.price = "El precio debe ser un número";
  if (Number(price) < 0)
    formErrors.price = "El precio debe ser mayor o igual a 0";
  if (!compareAtPrice)
    formErrors.compareAtPrice = "El precio comparativo es obligatorio";
  if (isNaN(Number(compareAtPrice)))
    formErrors.compareAtPrice = "El precio comparativo debe ser un número";
  if (Number(compareAtPrice) < 0)
    formErrors.compareAtPrice =
      "El precio comparativo debe ser mayor o igual a 0";

  if (!variant1)
    formErrors.variant1 = "El valor de la variante 1 es obligatorio";
  if (!quantity) formErrors.quantity = "La cantidad es obligatoria";
  if (isNaN(Number(quantity)))
    formErrors.quantity = "La cantidad debe ser un número";
  if (Number(quantity) < 0)
    formErrors.quantity = "La cantidad debe ser mayor o igual a 0";
  /* End Errors */

  if (intent === FORM_INTENTS.activate || intent === FORM_INTENTS.deactivate) {
    const { errors } = await updateVariantValue({
      variantId: String(variantId),
      record: { disabled: intent === FORM_INTENTS.deactivate },
    });

    if (errors && Object.values(errors).length > 0)
      formErrors.apiError = "Error al actualizar la variante";
  }

  if (intent === FORM_INTENTS.update) {
    const { errors } = await updateVariantValue({
      variantId: String(variantId),
      record: {
        value: {
          variant1: String(variant1),
          variant2: String(variant2),
          variant3: String(variant3),
        },
        price: Number(price) * 100,
        compareAtPrice: Number(compareAtPrice) * 100,
        quantity: Number(quantity),
        photo: photo ? String(photo) : undefined,
        sku: sku ? String(sku) : undefined,
      },
    });
    if (errors && Object.values(errors).length > 0)
      formErrors.apiError = "Error al actualizar la variante";
  }

  if (formErrors && Object.values(formErrors).length > 0)
    return { success: false, errors: formErrors, intent: String(intent) };

  return { success: true, intent: String(intent) };
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.variantId, "Error al cargar datos de la variante");

  const { data, errors } = await getVariant(params.variantId);

  if (errors && Object.values(errors).length > 0) throw new Error();
  invariant(data, "Error al cargar datos de la variante");

  return data;
}

export default function ProductVariants() {
  const actionData = useActionData<typeof action>();
  const variant = useLoaderData<typeof loader>();

  const { toast } = useToast();
  const navigation = useNavigation();
  const product: Product = useRouteLoaderData(
    "routes/admin.product-variants.$productId"
  )!;

  const [prev, setPrev] = React.useState<string>();
  const [next, setNext] = React.useState<string>();

  React.useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast({
          title: "Exito",
          description: `Se ha ${mapIntentToMessage(
            actionData.intent
          )} la variante.`,
        });
      } else if (actionData.errors?.apiError) {
        toast({
          title: "Error",
          description: `${
            actionData.errors?.apiError
          }\nNo se ha podido ${mapIntentToMessage(
            actionData.intent
          )} la variante.`,
          variant: "destructive",
        });
      }
    }
  }, [actionData, toast]);

  React.useEffect(() => {
    if (product.variantValues && product.variantValues.length > 1) {
      const idx = product.variantValues.findIndex(
        (vv) => vv._id === variant._id
      );
      if (idx - 1 >= 0 && idx + 1 < product.variantValues.length) {
        setPrev(product.variantValues[idx - 1]._id as string);
        setNext(product.variantValues[idx + 1]._id as string);
      } else if (idx - 1 >= 0) {
        setPrev(product.variantValues[idx - 1]._id as string);
      } else {
        setNext(product.variantValues[idx + 1]._id as string);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const isSaving =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") == FORM_INTENTS.update;

  const isToggling =
    navigation.state === "submitting" &&
    (navigation.formData?.get("intent") == FORM_INTENTS.activate ||
      navigation.formData?.get("intent") == FORM_INTENTS.deactivate);

  return (
    <div>
      <Card className="mt-4 max-w-[1200px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <VariantDetailHeader
            prevVariantId={prev}
            productId={product._id!}
            nextVariantId={next}
          />
        </CardHeader>
        <CardContent>
          <Form method="POST">
            <input type="hidden" name="variantId" value={variant._id} />
            <section className="flex flex-row flex-wrap -mx-4 mb-8">
              <article className="px-4 w-full md:w-1/3">
                <ProductCard
                  title={product.title}
                  image={product.photos![0] as string}
                  quantityVariants={product.variantValues!.length}
                />
                <VariantList
                  variantValues={product.variantValues!}
                  _id={product._id!}
                />
              </article>
              <article className="px-4 w-full md:w-2/3">
                <ValueForm
                  variant1={variant.value?.variant1 as string}
                  variant2={variant.value?.variant2 as string}
                  variant3={variant.value?.variant3 as string}
                  photo={variant.photo}
                  titles={product.variants?.map(({ title }) => title)}
                  errors={actionData?.errors}
                />
                <PricingForm
                  price={variant.price}
                  compareAtPrice={variant.compareAtPrice}
                />
                <InventoryEditForm
                  sku={variant.sku}
                  quantity={variant.quantity as number}
                />
              </article>
            </section>
            {/* Buttons */}
            <section className="flex flex-row flex-wrap -mx-4 mb-4">
              <div className="p-4 w-full flex flex-wrap flex-row justify-end gap-4">
                <Button
                  type="submit"
                  name="intent"
                  disabled={isToggling || isSaving}
                  value={
                    variant.disabled
                      ? FORM_INTENTS.activate
                      : FORM_INTENTS.deactivate
                  }
                  variant={variant.disabled ? "outline" : "destructive"}
                >
                  {variant.disabled
                    ? isToggling
                      ? "Activando"
                      : "Activar"
                    : isToggling
                    ? "Eliminando"
                    : "Eliminar"}
                </Button>
                <Button
                  disabled={isToggling || isSaving}
                  name="intent"
                  value={FORM_INTENTS.update}
                  type="submit"
                >
                  {isSaving ? "Guardando" : "Guardar"}
                </Button>
              </div>
            </section>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

type UpdateVariantActionErrors = {
  apiError?: string;
  price?: string;
  compareAtPrice?: string;
  variant1?: string;
  quantity?: string;
};
