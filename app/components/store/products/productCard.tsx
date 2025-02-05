import { Link } from "@remix-run/react";
import { ProductRating } from "./productRating";
import { formatMoney } from "~/lib/utils";

export function ProductCard({ product }: Props) {
  const getPrice = (values: { price: number }[]) => {
    const prices = new Set<number>();
    values?.forEach((val) => prices.add(val?.price ?? 0));
    const _prices = [...prices].sort((a, b) => b - a);
    return _prices?.[0];
  };

  return (
    <article className="flex flex-col items-center justify-center">
      <Link
        className="w-full aspect-square flex"
        to={`/store/product-detail/${product.slug}`}
        prefetch="viewport"
      >
        <img
          className="block h-auto w-full object-cover object-center"
          alt={`${product?.title}`}
          src={product?.photos![0]}
        />
      </Link>
      <div className="p-4 w-full">
        <h2 className="text-gray-800">{product?.title}</h2>
        <ProductRating rating={product.rating!} />
        {getPrice(product.variantValues!) ? (
          <p className="leading-normal my-1 font-bold">
            $ {formatMoney(getPrice(product.variantValues!))}
          </p>
        ) : null}
      </div>
    </article>
  );
}

type Props = {
  product: {
    slug: string;
    title: string;
    description: string;
    isService: boolean;
    rating: number;
    photos: string[];
    _id: string;
    variantValues: {
      price: number;
    }[];
  };
};
