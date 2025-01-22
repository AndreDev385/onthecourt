import { ProductRating } from "~/components/store/products/productRating";
import { formatMoney } from "~/lib/utils";

export function GeneralInfo({
  title,
  description,
  rating,
  variantValues,
  selectedVariant,
}: Props) {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-[1fr,auto] items-baseline gap-x-4 gap-y-2 lg:grid-cols-1">
        <h1 className="text-2xl font-bold lg:text-3.3xl">{title}</h1>
        <div className="lg:order-last font-bold flex gap-2">
          <div className="text-green-700">
            $
            {selectedVariant
              ? formatMoney(selectedVariant.price)
              : formatMoney(
                  variantValues.length > 0 ? variantValues[0].price : 0
                )}
          </div>
          <div className="text-red-500 line-through">
            $
            {selectedVariant
              ? formatMoney(selectedVariant.compareAtPrice)
              : formatMoney(
                  variantValues.length > 0 ? variantValues[0].compareAtPrice : 0
                )}
          </div>
        </div>
        <div>
          {description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: description ?? "",
              }}
            ></div>
          ) : null}
        </div>
      </div>
      <ProductRating rating={rating} />
    </div>
  );
}

type Props = {
  title: string;
  description: string;
  rating: number;
  variantValues: {
    value: {
      variant1: string;
      variant2: string;
      variant3: string;
    };
    location: {
      _id: string;
    };
    price: number;
    compareAtPrice: number;
    quantity: number;
    _id: string;
  }[];
  selectedVariant: {
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
  } | null;
};
