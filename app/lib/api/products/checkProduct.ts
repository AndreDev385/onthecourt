import { BasicInfo } from "~/components/admin/products/basicInfoForm";
import { Variant, VariantValue } from "~/types";

export function checkProduct(
  basicInfo: BasicInfo,
  images: Array<string>,
  variants: Array<Variant>,
  variantsValues: Array<VariantValue>
): TCheckErrorMessage {
  const infoCheck = checkBasicInfo(basicInfo);
  const imagesCheck = checkArray(images, "Imágenes");
  const variantCheck = checkArray(variants, "Variantes");
  const variantCheckInternal = checkVariant(variants);
  const variantValuesCheck = checkArray(
    variantsValues,
    "Inventario de las Variantes"
  );
  if (
    infoCheck.success &&
    imagesCheck.success &&
    variantCheck.success &&
    variantValuesCheck.success &&
    variantCheckInternal.success
  ) {
    return { success: true };
  }
  if (!infoCheck.success) {
    return infoCheck;
  }
  if (!imagesCheck.success) {
    return imagesCheck;
  }
  if (basicInfo.isService) {
    return { success: true };
  }
  if (!variantCheck.success) {
    return variantCheck;
  }
  if (!variantCheckInternal.success) {
    return variantCheckInternal;
  }

  return variantValuesCheck;
}

function checkBasicInfo(info: BasicInfo): TCheckErrorMessage {
  const { title, priority } = info;
  if (checkString(title)) {
    return { success: false, msg: "Titulo Inválido" };
  }
  if (
    Number.isNaN(Number(priority)) ||
    ![1, 2, 3].includes(priority as number)
  ) {
    return { success: false, msg: "Prioridad Invalida" };
  }
  return { success: true };
}

function checkArray<T>(array: Array<T>, name: string): TCheckErrorMessage {
  if (Array.isArray(array) && array.length > 0) {
    return { success: true };
  }
  return { success: false, msg: `${name} Invalidas` };
}

function checkVariant(variants: Array<Variant>): TCheckErrorMessage {
  const preCheck = checkArray(variants, "Variantes");
  if (preCheck.success) {
    for (const variant of variants) {
      console.log(variant.tags, "VARIANT TAGS");
      const tagsCheck = checkArray(variant.tags, "Valores de las Variantes");
      if (!tagsCheck.success) {
        return tagsCheck;
      }
      if (checkString(variant.title)) {
        return { success: false, msg: "Variantes Invalidas" };
      }
    }
    return { success: true };
  }
  return preCheck;
}

type TCheckErrorMessage = {
  success: boolean;
  msg?: string;
};

function checkString(candidate?: string): boolean {
  if (
    candidate === undefined ||
    candidate === null ||
    candidate.length === 0 ||
    candidate.replace(/( )/gi, "").length === 0 ||
    candidate.trim().length <= 0
  ) {
    return true;
  }
  return false;
}
