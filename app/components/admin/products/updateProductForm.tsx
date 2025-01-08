import React, { Suspense } from "react";
import { v4 as uuid } from "uuid";
import NProgress from "nprogress";

import { Separator } from "~/components/ui/separator";
import { Brand, Product, Variant, VariantValue } from "~/types";
import { VariantTable } from "./variantTable";
import { Button } from "~/components/ui/button";
import { FORM_INTENTS } from "~/lib/constants";
import BasicInfoForm, { BasicInfo } from "./basicInfoForm";
import generateVariantValuesHook from "~/lib/variantValues";
import { checkProduct } from "~/lib/api/products/checkProduct";
import { updateProduct } from "~/lib/api/products/updateProduct";
import { useToast } from "~/hooks/use-toast";

export function UpdateProductForm({
  product,
  locations,
  brands,
  categories,
  TINY_KEY,
}: Props) {
  const { toast } = useToast();

  const [disabledButton, setDisabledButton] = React.useState(false);
  const [active, setActive] = React.useState(product?.active ?? true);
  const [basicInfo, setBasicInfo] = React.useState<BasicInfo>({
    title: product?.title ?? "",
    description: product?.description ?? "",
    dataSheet: product?.dataSheet ?? "",
    priority: product?.priority ?? 0,
    isService: product?.isService ?? false,
    volatileInventory: product?.volatileInventory ?? false,
    brand: (product?.brand as Brand)?._id ?? "none",
    extraInfo:
      product?.extraInfo?.map((extra) => ({ ...extra, id: uuid() })) ?? [],
    price: Number(product.price ? product.price / 100 : 0),
    compareAtPrice: Number(
      product.compareAtPrice ? product.compareAtPrice / 100 : 0
    ),
    categories:
      product?.categories?.map((c) => ({ _id: c._id, name: c.name })) ?? [],
  });
  const [images, setImages] = React.useState<Array<string>>(
    product?.photos ?? []
  );
  const [variants] = React.useState<Array<Variant>>(
    (product?.variants as Variant[]) ?? []
  );
  const [variantValues, setVariantValues] = React.useState<Array<VariantValue>>(
    generateVariantValuesHook(
      variants,
      locations.map((l) => ({ _id: l._id!, name: l.name! })),
      product?.variantValues!.slice().map((variantValue: VariantValue) => ({
        ...variantValue,
        price: (variantValue.price as number) / 100,
        compareAtPrice: (variantValue.compareAtPrice as number) / 100,
        location:
          (variantValue?.location as { _id: string })?._id ??
          (variantValue?.location as string) ??
          "",
      }))
    )
  );

  const updateBasicInfo = React.useCallback(setBasicInfo, [setBasicInfo]);
  const updateURLs = React.useCallback(setImages, [setImages]);
  const updateVariantValues = React.useCallback(setVariantValues, [
    setVariantValues,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ImageForm = React.useCallback(
    React.lazy(async () => {
      const module = await import("~/components/admin/images/imageForm");
      return { default: module.default };
    }),
    []
  );

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      NProgress.start();
      setDisabledButton(true);
      const check = checkProduct(basicInfo, images, variants, variantValues);
      if (check.success) {
        const data = {
          filter: { _id: product._id! },
          data: {
            title: basicInfo.title,
            description: basicInfo.description,
            dataSheet: basicInfo.dataSheet,
            priority: Number(basicInfo.priority),
            isService: basicInfo.isService ?? false,
            volatileInventory: basicInfo?.volatileInventory ?? false,
            price: (basicInfo.price as number) * 100,
            compareAtPrice: (basicInfo.compareAtPrice as number) * 100,
            photos: images,
            brand: basicInfo.brand as string,
            categories: basicInfo.categories.map((c) => c._id!),
            variants: {
              create: variants
                .filter((_variant) => _variant._id?.includes("-"))
                .map(({ tags, title }) => ({ tags, title })),
              update: variants
                .filter((_variant) => !_variant._id?.includes("-"))
                .map(({ tags, title, _id }) => ({ _id: _id!, tags, title })),
            },
            variantValues: {
              create: variantValues
                .filter((variantValue) => variantValue._id?.includes("-"))
                .map(
                  ({
                    value,
                    price,
                    compareAtPrice,
                    sku,
                    quantity,
                    location,
                    disabled: _disabled,
                    photo,
                  }) => ({
                    value: {
                      variant1: value!.variant1!,
                      variant2: value?.variant2,
                      variant3: value?.variant3,
                    },
                    price: parseInt(String((price as number) * 100), 10),
                    compareAtPrice: parseInt(
                      String((compareAtPrice as number) * 100),
                      10
                    ),
                    sku: sku as string,
                    quantity: quantity as number,
                    location: location as string,
                    disabled: _disabled as boolean,
                    photo: photo,
                  })
                ),
              update: variantValues
                .filter((variantValue) => !variantValue._id?.includes("-"))
                .map(
                  ({
                    value,
                    price,
                    compareAtPrice,
                    sku,
                    quantity,
                    location,
                    disabled: _disabled,
                    photo,
                    _id,
                  }) => ({
                    _id: _id as string,
                    value: {
                      variant1: value!.variant1,
                      variant2: value?.variant2,
                      variant3: value?.variant3,
                    },
                    price: (price as number) * 100,
                    compareAtPrice: (compareAtPrice as number) * 100,
                    sku,
                    quantity: quantity as number,
                    location: location as string,
                    disabled: _disabled as boolean,
                    photo,
                  })
                ),
            },
            extraInfo:
              basicInfo.extraInfo?.map(({ name, value }) => ({
                name,
                value,
              })) ?? [],
          },
        };

        const { errors } = await updateProduct(data);
        if (errors && Object.values(errors).length > 0)
          throw new Error("Error al actualizar producto");
        toast({
          title: "Éxito",
          description: "El producto ha sido actualizado!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: check.msg,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    } finally {
      NProgress.done();
      setDisabledButton(false);
    }
  };

  const toggleDisable = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      NProgress.start();
      setDisabledButton(true);
      await updateProduct({
        filter: { _id: product._id! },
        data: { active: !active },
      });
      setActive(!active);
      toast({
        title: `Producto ${active ? "desactivado" : "activado"} con éxito`,
      });
      setDisabledButton(false);
    } catch (err) {
      if (err instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    } finally {
      NProgress.done();
      setDisabledButton(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <BasicInfoForm
        {...basicInfo}
        updateBasicInfo={updateBasicInfo}
        isUpdate
        brands={brands}
        allCategories={categories}
        TINY_KEY={TINY_KEY}
      />
      <Separator className="my-8" />
      {/* Images */}
      <Suspense fallback={"...cargando"}>
        <ImageForm photos={images} updateURLs={updateURLs} />
      </Suspense>
      <Separator className="my-8" />
      {!basicInfo.isService && (
        <VariantTable
          productId={product._id!}
          variants={variants}
          variantValues={variantValues}
          locations={locations.map((l) => ({ _id: l._id, name: l.name }))}
          updateVariantValues={updateVariantValues}
        />
      )}
      <div className="flex flex-col flex-wrap w-full ml-auto mb-8 border-t border-gray-400">
        <div className="flex flex-col flex-wrap w-full mx-auto px-6 py-4 pr-0">
          <div className="flex flex-row flex-wrap w-full m-auto">
            <div className="ml-auto">
              <Button
                type="button"
                variant={active ? "destructive" : "outline"}
                name="intent"
                onClick={toggleDisable}
                value={active ? FORM_INTENTS.deactivate : FORM_INTENTS.activate}
              >
                {active
                  ? disabledButton
                    ? "Desactivando..."
                    : "Desactivar"
                  : disabledButton
                  ? "Activando..."
                  : "Activar"}
              </Button>
            </div>
            <div className="ml-4">
              <Button
                type="button"
                onClick={onSubmit}
                disabled={disabledButton}
                color="primary"
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

type Props = {
  TINY_KEY: string;
  product: Product;
  locations: Array<{ _id: string; name: string }>;
  brands: Array<{ _id: string; name: string }>;
  categories: Array<{ _id: string; name: string }>;
};
