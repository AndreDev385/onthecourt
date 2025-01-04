import React from "react";
import { Variant, VariantValue } from "~/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { validateNumber } from "~/lib/utils";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

interface VariantTableProps {
  variants: Array<Variant>;
  variantValues: Array<VariantValue>;
  updateVariantValues: React.Dispatch<React.SetStateAction<VariantValue[]>>;
  locations: Array<{ _id: string; name: string }>;
  productId: string;
}

export function VariantTable({
  variants = [],
  locations = [],
  variantValues = [],
  updateVariantValues,
  productId,
}: VariantTableProps) {
  const content = React.useMemo(
    () =>
      variantValues.map((variantValue) => (
        <VariantValueForm
          key={variantValue?._id}
          _id={variantValue?._id ?? ""}
          productId={productId}
          location={
            locations.filter(
              (location) => location._id === variantValue?.location
            )[0]?.name ?? "-"
          }
          variant1={variantValue?.value?.variant1}
          variant2={variantValue?.value?.variant2 ?? ""}
          variant3={variantValue?.value?.variant3 ?? ""}
          price={variantValue?.price ?? 0}
          compareAtPrice={variantValue?.compareAtPrice ?? 0}
          quantity={variantValue?.quantity ?? 0}
          sku={variantValue?.sku ?? ""}
          disabled={variantValue?.disabled ?? false}
          updateVariantValues={updateVariantValues}
        />
      )),
    [variantValues, productId, updateVariantValues, locations]
  );
  const headers = [
    "Sucursal",
    ...variants
      .map(({ title }) => title)
      .filter((x) => !!x)
      .flat(Infinity),
    "Precio",
    "Precio Comparativo",
    "Cantidad",
    "SKU",
    "Acciones",
  ];

  return (
    <div className="flex flex-col flex-wrap w-full px-4">
      <h3 className="mb-4 text-gray-700 text-xl">Variantes</h3>
      <div className="block overflow-x-auto w-full">
        <Table className="w-full border-collapse mb-4 text-gray-600">
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead
                  className="p-3 border-b-2 border-gray-900 text-left text-gray-700"
                  key={header}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{content}</TableBody>
        </Table>
      </div>
    </div>
  );
}

type VariantValueFormProps = {
  _id: string;
  productId?: string;
  location?: string;
  variant1?: string;
  variant2?: string;
  variant3?: string;
  price?: number;
  compareAtPrice?: number;
  quantity?: number;
  sku?: string;
  disabled?: boolean;
  updateVariantValues?: React.Dispatch<React.SetStateAction<VariantValue[]>>;
};

function VariantValueForm({
  _id = "",
  productId = "",
  location = "",
  variant1 = "",
  variant2 = "",
  variant3 = "",
  price: _price,
  compareAtPrice: _compareAtPrice,
  quantity: _quantity,
  sku: _sku,
  disabled: _disabled,
  updateVariantValues,
}: VariantValueFormProps) {
  const [id] = React.useState(_id);
  const [price, setPrice] = React.useState(_price ?? 0);
  const [compareAtPrice, setCompareAtPrice] = React.useState(
    _compareAtPrice ?? 0
  );
  const [quantity, setQuantity] = React.useState(_quantity ?? 0);
  const [sku, setSku] = React.useState(_sku ?? "");
  const [disabled, setDisabled] = React.useState(_disabled ?? false);
  const mount = React.useRef(false);
  React.useEffect(
    function updateVariantValueHook() {
      if (mount.current) {
        updateVariantValues!((_variantValues) => {
          const [element] = _variantValues.filter((vv) => vv._id === id);
          const idx = _variantValues.findIndex((vv) => vv._id === id);
          return [
            ..._variantValues.slice(0, idx),
            {
              ...element,
              price: Number(price),
              quantity: Number(quantity),
              compareAtPrice: Number(compareAtPrice),
              sku,
              disabled,
            } as VariantValue,
            ..._variantValues.slice(idx + 1),
          ];
        });
      } else {
        mount.current = true;
      }
    },
    [price, compareAtPrice, sku, disabled, id, quantity, updateVariantValues]
  );
  const toggle = () => setDisabled(!disabled);
  return (
    <TableRow className={`${disabled ? "bg-gray-200" : "hover:bg-gray-100"}`}>
      <TableCell className="align-middle p-3 border-t border-gray-300">
        {location}
      </TableCell>
      <TableCell className="align-middle p-3 border-t border-gray-300">
        {variant1}
      </TableCell>
      {variant2 ? (
        <TableCell className="align-middle p-3 border-t border-gray-300">
          {variant2}
        </TableCell>
      ) : null}
      {variant3 ? (
        <TableCell className="align-middle p-3 border-t border-gray-300">
          {variant3}
        </TableCell>
      ) : null}
      <TableCell className="align-middle p-3 border-t border-gray-300">
        <Input
          name="price"
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
      <TableCell className="align-middle p-3 border-t border-gray-300">
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
      <TableCell className="align-middle p-3 border-t border-gray-300">
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
      <TableCell className="align-middle p-3 border-t border-gray-300">
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
      <TableCell className="align-middle p-3 border-t border-gray-300">
        <div className="float-right flex">
          <Button
            type="button"
            variant="ghost"
            className="bg-transparent p-0 m-0 mr-2 focus:outline-none outline-none text-red-700"
            onClick={toggle}
          >
            <span className="sr-only">Eliminar</span>
            <svg
              fill="none"
              className="w-6 h-6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
          {_id && !_id.includes("-") ? (
            <Button variant="ghost">
              <Link
                to={`/admin/products/${productId}/variant/${_id ?? ""}`}
                className="bg-transparent p-0 m-0 focus:outline-none outline-none text-indigo-700"
              >
                <svg
                  fill="currentColor"
                  className="w-6 h-6"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              disabled
              className="bg-transparent p-0 m-0 focus:outline-none outline-none text-indigo-400"
            >
              <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
