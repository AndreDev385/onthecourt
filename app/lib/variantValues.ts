import { v4 as uuid } from "uuid";
import { Variant, VariantValue } from "~/types";
import mixTags from "./mixTags";

function checkMixedLength<T>(mixed: T[][]): boolean {
  if (mixed.length > 0) {
    return mixed[0].length > 0;
  }
  return false;
}

function buildEmptyVariantValue(
  tags: string[],
  location: { _id: string }
): VariantValue {
  return {
    value: {
      variant1: tags[0] || "",
      variant2: tags[1] || "",
      variant3: tags[2] || "",
    },
    price: 0.0,
    compareAtPrice: 0.0,
    quantity: 0,
    photo: "",
    sku: "",
    disabled: false,
    location: location._id,
    _id: uuid(),
  };
}

function compareVariantValues(
  base: VariantValue,
  compareTo: VariantValue
): boolean {
  if ((base.location as string) !== (compareTo.location as string)) {
    return false;
  }
  return (
    base.value?.variant1 === compareTo.value?.variant1 &&
    base.value?.variant2 === compareTo.value?.variant2 &&
    base.value?.variant3 === compareTo.value?.variant3
  );
}

function generateVariantValuesHook(
  variants: Array<Variant>,
  locations: Array<{ _id: string; name: string }>,
  variantValues: Array<VariantValue>
) {
  const mixedTags = mixTags(
    variants
      .slice()
      .map(({ tags }) => tags)
      .filter((x) => !!x)
  );
  if (checkMixedLength(mixedTags)) {
    let generatedVariantValues = mixedTags
      .map((tags) =>
        locations.map((location) => buildEmptyVariantValue(tags, location))
      )
      .flat(Infinity) as Array<VariantValue>;

    generatedVariantValues = generatedVariantValues.map(
      (generatedVariantValue) => {
        const filtered = variantValues.filter((currentVariantValue) =>
          compareVariantValues(generatedVariantValue, currentVariantValue)
        );
        if (filtered.length > 0) {
          return filtered[0];
        }
        return generatedVariantValue;
      }
    );
    return generatedVariantValues;
  }
  return variantValues;
}

export default generateVariantValuesHook;
