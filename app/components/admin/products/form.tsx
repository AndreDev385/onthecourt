/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "@remix-run/react";
import React, { lazy, Suspense } from "react";
import NProgress from "nprogress";

import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { FORM_INTENTS } from "~/lib/constants";
import { Variant, VariantValue } from "~/types";
import { Separator } from "~/components/ui/separator";
import generateVariantValuesHook from "~/lib/variantValues";
import InventoryForm from "./inventoryForm";
import BasicInfoForm, { BasicInfo } from "./basicInfoForm";
import VariantForm from "./variantForm";
import { checkProduct } from "~/lib/api/products/checkProduct";
import { createProduct } from "~/lib/api/products/createProduct";
import invariant from "tiny-invariant";

export function ProductForm({
  brands,
  categories,
  locations,
  TINY_KEY,
}: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  /* other state */
  const [basicInfo, setBasicInfo] = React.useState<BasicInfo>({
    title: "",
    description: "",
    priority: 0,
    isService: false,
    volatileInventory: false,
    brand: "",
    categories: [],
    sku: "",
    price: 0,
    compareAtPrice: 0,
    dataSheet: "",
    extraInfo: [],
  });
  const [images, setImages] = React.useState<Array<string>>([]);
  const [variants, setVariants] = React.useState<Array<Variant>>([]);
  const [variantValues, setVariantValues] = React.useState<Array<VariantValue>>(
    []
  );

  const [disabledButton, setDisabledButton] = React.useState(false);
  const updateBasicInfo = React.useCallback(setBasicInfo, [setBasicInfo]);
  const updateVariants = React.useCallback(setVariants, [setVariants]);
  const updateURLs = React.useCallback(setImages, [setImages]);
  const updateVariantValues = React.useCallback(setVariantValues, [
    setVariantValues,
  ]);

  const _variantValues = React.useMemo(
    () => generateVariantValuesHook(variants, locations, variantValues),
    [variants, locations, variantValues]
  );

  React.useEffect(() => {
    if (_variantValues.length !== variantValues.length) {
      setVariantValues(_variantValues);
    }
  }, [_variantValues, variantValues]);
  /* end */

  const ImageForm = React.useCallback(
    lazy(async () => {
      const module = await import("~/components/admin/images/imageForm");
      return { default: module.default };
    }),
    []
  );

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      NProgress.start();
      setDisabledButton(true);
      const check = checkProduct(basicInfo, images, variants, variantValues);
      if (check.success) {
        const createProductData = {
          title: basicInfo.title as string,
          description: basicInfo?.description ?? "-",
          dataSheet: basicInfo?.dataSheet ?? "-",
          priority: basicInfo.priority as number,
          isService: basicInfo.isService ?? false,
          volatileInventory: basicInfo?.volatileInventory ?? false,
          photos: images,
          price: parseInt(String(basicInfo.price! * 100), 10),
          categories: basicInfo.categories?.map((c) => c._id) ?? [],
          compareAtPrice: parseInt(String(basicInfo.compareAtPrice! * 100), 10),
          brand: basicInfo.brand as string,
          variants: variants.map(({ tags, title }) => ({ tags, title })),
          variantValues: variantValues.map(
            ({
              value,
              price,
              compareAtPrice,
              sku,
              quantity,
              location,
              disabled,
              photo,
            }) => ({
              value,
              price: parseInt(String(price! * 100), 10),
              compareAtPrice: parseInt(String(compareAtPrice! * 100), 10),
              sku: sku as string,
              quantity: quantity as number,
              location: location as string,
              disabled: disabled ?? false,
              photo,
            })
          ),
          extraInfo:
            basicInfo.extraInfo?.map(({ name, value }) => ({
              name,
              value,
            })) ?? [],
        };
        const { data, errors } = await createProduct(createProductData);
        if (errors && Object.values(errors).length > 0) {
          throw new Error("Error al crear producto");
        }
        invariant(data, "Error al crear producto");
        toast({
          title: `Producto creado`,
          description: `El producto ha sido creado con éxito`,
        });
        return navigate(`/admin/products/${data._id}`, { replace: true });
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
      setDisabledButton(false);
      NProgress.done();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <BasicInfoForm
        {...basicInfo}
        updateBasicInfo={updateBasicInfo}
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
      {/* Variants */}
      {!basicInfo.isService && (
        <>
          {<VariantForm updateVariants={updateVariants} />}
          {variantValues.length > 0 ? (
            <InventoryForm
              locations={locations}
              variantValues={_variantValues}
              updateVariantValues={updateVariantValues}
              defaultPrice={basicInfo.price as number}
              defaultCompareAtPrice={basicInfo.compareAtPrice as number}
              defaultInventory={basicInfo.quantity as number}
              defaultSku={basicInfo.sku as string}
            />
          ) : null}
        </>
      )}
      {/* Buttons */}
      <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
        <div className="ml-auto flex gap-4">
          <Button
            onClick={onSubmit}
            type="button"
            disabled={disabledButton}
            name="intent"
            value={FORM_INTENTS.create}
          >
            {disabledButton ? "Creando..." : "Crear Producto"}
          </Button>
        </div>
      </div>
    </form>
  );
}

type Props = {
  TINY_KEY: string;
  brands: { _id: string; name: string }[];
  categories: { _id: string; name: string }[];
  locations: { _id: string; name: string }[];
};
