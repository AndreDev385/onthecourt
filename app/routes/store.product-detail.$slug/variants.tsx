import { Button } from "~/components/ui/button";
import { FormErrors } from "./form";

export function Variants({
  product,
  actionData,
  selectedVariantOptions,
  changeVariantsValue,
}: Props) {
  return product?.variants?.map((variant, index1) => (
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
                selectedVariantOptions.includes(tag) ? "default" : "outline"
              }
              type="button"
              onMouseDown={() => changeVariantsValue(tag, index1)}
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
  ));
}

type Props = {
  product: {
    variants: {
      title: string;
      tags: string[];
    }[];
  };
  selectedVariantOptions: string[];
  changeVariantsValue: (value: string, variantIndex: number) => void;
  actionData:
    | {
        success: boolean;
        intent: string;
        errors?: {
          apiErrors: string;
        } & FormErrors;
      }
    | {
        errors: FormErrors;
        success: boolean;
        intent: string;
      }
    | undefined;
};
