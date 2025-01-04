import React from "react";
import { VariantValue } from "~/types";
import VariantValueForm from "./variantValueForm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

type InventoryFormProps = {
  variantValues: Array<VariantValue>;
  locations: Array<{ _id: string; name: string }>;
  updateVariantValues: React.Dispatch<React.SetStateAction<VariantValue[]>>;
  defaultPrice: number;
  defaultCompareAtPrice: number;
  defaultInventory: number;
  defaultSku: string;
};

function InventoryForm({
  variantValues = [],
  locations = [],
  updateVariantValues,
  defaultPrice,
  defaultCompareAtPrice,
  defaultInventory,
  defaultSku,
}: InventoryFormProps) {
  const _variantValues = React.useMemo(
    () => [...variantValues],
    [variantValues]
  );

  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full flex flex-col flex-wrap">
      <h3 className="mb-4 text-gray-700 text-xl">Inventario</h3>
      {locations.map((location) => (
        <Collapsible key={location._id}>
          <CollapsibleTrigger
            onClick={() => setOpen(!open)}
            className="w-full"
            disabled={_variantValues.length === 0}
          >
            <div className="flex items-center justify-between p-4 bg-gray-100">
              <h5 className="font-bold text-gray-700 text-xl">
                {location.name}
              </h5>
              {open ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            {_variantValues.flatMap((variantValue) =>
              (variantValue.location as string) === location._id ? (
                <VariantValueForm
                  updateVariantValues={updateVariantValues}
                  _id={variantValue._id as string}
                  variant1={variantValue?.value?.variant1 ?? ""}
                  variant2={variantValue?.value?.variant2 ?? ""}
                  variant3={variantValue?.value?.variant3 ?? ""}
                  defaultPrice={defaultPrice}
                  defaultCompareAtPrice={defaultCompareAtPrice}
                  defaultInventory={defaultInventory}
                  defaultSku={defaultSku}
                  key={variantValue._id}
                />
              ) : (
                []
              )
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
export default InventoryForm;
