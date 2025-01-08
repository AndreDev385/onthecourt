import { Link } from "@remix-run/react";
import { Icon } from "~/components/shared/icon";

export function VariantDetailHeader({
  productId,
  nextVariantId,
  prevVariantId,
}: Props) {
  return (
    <section className="flex flex-col flex-wrap w-full rounded-md mx-auto mb-4">
      <div className="w-full pb-3">
        <div className="flex flex-row flex-wrap -mx-4">
          <div className="px-4 w-1/2">
            <Link
              to={`/admin/products/${productId}`}
              className="bg-transparent py-1 cursor-pointer uppercase text-sm text-gray-500 font-semibold flex flex-row flex-wrap"
            >
              <Icon icon="arrow-left" />
              Producto
            </Link>
          </div>
          <div className="px-4 w-1/2 flex">
            <div className="ml-auto inline-flex">
              {prevVariantId ? (
                <Link
                  to={`/admin/product-variants/${productId}/${prevVariantId}`}
                  className="bg-transparent py-1 cursor-pointer uppercase text-sm text-gray-500 font-semibold flex flex-row flex-wrap"
                >
                  <Icon icon="arrow-left" />
                  <span className="sr-only">Previous</span>
                </Link>
              ) : null}
              {nextVariantId ? (
                <Link
                  to={`/admin/product-variants/${productId}/${nextVariantId}`}
                  className="bg-transparent py-1 cursor-pointer uppercase text-sm text-gray-500 font-semibold flex flex-row flex-wrap"
                >
                  <Icon icon="arrow-right" />
                  <span className="sr-only">Next</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Props = {
  productId: string;
  nextVariantId?: string;
  prevVariantId?: string;
};
