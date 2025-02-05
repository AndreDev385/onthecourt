import { Link } from "@remix-run/react";
import { VariantValue } from "~/types";

type VariantListProps = {
  variantValues: Array<VariantValue>;
  _id: string;
};

export function VariantList({ variantValues = [], _id }: VariantListProps) {
  return (
    <div className="w-full p-4 rounded border border-gray-200 mb-6">
      <div className="w-full">
        <h3 className="text-center text-gray-800">Variantes</h3>
      </div>
      <div className="flex flex-col flex-wrap max-h-96 overflow-y-auto overflow-x-hidden">
        <ul className="">
          {variantValues?.map(({ _id: id, value, photo }) => (
            <li key={id} className="py-3 px-2">
              <div className="w-full flex flex-row flex-wrap -mx-2">
                <div className="px-2">
                  {photo ? (
                    <img className="w-10 h-10 rounded" src={photo} alt={id} />
                  ) : (
                    <div className="w-10 h-10 rounded border-gray-500 border-2 border-dashed" />
                  )}
                </div>
                <div className="px-2 flex-1 flex">
                  <Link
                    to={`/admin/product-variants/${_id}/${id}`}
                    className="my-auto text-gray-700"
                    prefetch="intent"
                  >
                    {[value?.variant1, value?.variant2, value?.variant3]
                      .filter((x) => !!x)
                      .join("/")}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
