import React from "react";
import { VariantValue } from "~/types";
import { validateNumber } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface VariantValueFormProps {
  _id: string;
  variant1?: string;
  variant2?: string;
  variant3?: string;
  updateVariantValues?: React.Dispatch<React.SetStateAction<VariantValue[]>>;
  defaultPrice: number;
  defaultCompareAtPrice: number;
  defaultInventory: number;
  defaultSku: string;
}

function VariantValueForm({
  _id = "",
  variant1 = "",
  variant2 = "",
  variant3 = "",
  defaultPrice,
  defaultCompareAtPrice,
  defaultInventory,
  defaultSku,
  updateVariantValues,
}: VariantValueFormProps) {
  const [id] = React.useState(_id);
  const variant = React.useMemo(
    () => ({ variant1, variant2, variant3 }),
    [variant1, variant2, variant3]
  );
  const [price, setPrice] = React.useState(0);
  const [compareAtPrice, setCompareAtPrice] = React.useState(0);
  const [quantity, setQuantity] = React.useState(0);
  const [sku, setSku] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (defaultPrice) {
      setPrice(defaultPrice);
    }
  }, [defaultPrice]);

  React.useEffect(() => {
    if (defaultCompareAtPrice) {
      setCompareAtPrice(defaultCompareAtPrice);
    }
  }, [defaultCompareAtPrice]);

  React.useEffect(() => {
    if (defaultInventory) {
      setQuantity(defaultInventory);
    }
  }, [defaultInventory]);

  React.useEffect(() => {
    if (defaultSku) {
      setSku(defaultSku);
    }
  }, [defaultSku]);

  React.useEffect(
    function updateVariantValueHook() {
      updateVariantValues!((_variantValues) => {
        const [element] = _variantValues.filter((vv) => vv._id === id);
        return [
          ..._variantValues.filter((vv) => vv._id !== id),
          {
            ...element,
            price: Number(price),
            quantity: Number(quantity),
            compareAtPrice: Number(compareAtPrice),
            sku,
            disabled,
          } as VariantValue,
        ];
      });
    },
    [price, compareAtPrice, sku, disabled, id, quantity, updateVariantValues]
  );
  const toggle = () => setDisabled(!disabled);
  return (
    <div
      className={`w-auto flex flex-col lg:-mx-2 mb-4 ${
        disabled ? "bg-gray-100" : ""
      }`}
    >
      <h4 className="px-2 my-auto w-auto max-w-xs">
        Variante:{" "}
        {Object.values(variant)
          .filter((x) => !!x)
          .join("/")}
      </h4>
      <div className="block overflow-x-auto w-full">
        <Table className="text-gray-500">
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 py-1">Precio</TableHead>
              <TableHead className="px-2 py-1">Precio de Comparación</TableHead>
              <TableHead className="px-2 py-1">Cantidad</TableHead>
              <TableHead className="px-2 py-1">SKU</TableHead>
              <TableHead className="px-2 py-1">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="px-2 py-1">
                <Input
                  name="variantValuePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  placeholder="Ingrese un monto"
                  disabled={disabled}
                  onChange={(e) => {
                    e.preventDefault();
                    if (
                      validateNumber(Number(e.target.value)) &&
                      Number(e.target.value) >= 0
                    ) {
                      setPrice(Number(e.target.value));
                    }
                  }}
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  name="compareAtPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  placeholder="Ingrese un monto"
                  disabled={disabled}
                  onChange={(e) => {
                    e.preventDefault();
                    if (
                      validateNumber(Number(e.target.value)) &&
                      Number(e.target.value) >= 0
                    ) {
                      setCompareAtPrice(Number(e.target.value));
                    }
                  }}
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={quantity}
                  placeholder="Ingrese una cantidad"
                  disabled={disabled}
                  onChange={(e) => {
                    e.preventDefault();
                    if (
                      validateNumber(Number(e.target.value)) &&
                      Number(e.target.value) >= 0
                    ) {
                      setQuantity(Number(e.target.value));
                    }
                  }}
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  name="sku"
                  type="text"
                  value={sku}
                  placeholder="Ingrese un SKU"
                  disabled={disabled}
                  onChange={(e) => {
                    e.preventDefault();
                    if (String(e.target.value).length <= 127) {
                      setSku(e.target.value);
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  type="button"
                  className={`${disabled ? "text-green-700" : "text-red-700"}`}
                  onClick={toggle}
                >
                  {disabled ? (
                    <svg
                      fill="currentColor"
                      className="w-6 h-6"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <input
        type="hidden"
        name="variantValue"
        value={JSON.stringify({
          ...variant,
          price: price,
          compareAtPrice: compareAtPrice,
          quantity: quantity,
          sku,
          disabled,
        })}
      />
    </div>
  );
}

export default VariantValueForm;
