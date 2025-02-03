import { Form, Link, useNavigation } from "@remix-run/react";
import { Loader2, Minus, Plus } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CurrentUser } from "~/lib/api/users/getCurrentUser";
import { formatMoney } from "~/lib/utils";

export function AddToCartForm({
  currentUser,
  selectedVariant,
  product,
  actionData,
}: Props) {
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  const [total, setTotal] = React.useState(0);
  const [compareTotal, setCompareTotal] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const STOCK_UNAVAILABLE = Boolean(
    selectedVariant && selectedVariant.quantity! < quantity
  );

  function updateQuantity(value: "increase" | "decrease") {
    if (value === "increase") {
      setQuantity(quantity + 1);
    } else {
      if (quantity === 1) return;
      setQuantity(quantity - 1);
    }
  }

  React.useEffect(
    function calculateTotal() {
      if (selectedVariant) {
        setTotal(selectedVariant.price * quantity);
        setCompareTotal(selectedVariant.compareAtPrice * quantity);
      } else if (product.variantValues.length > 0) {
        setTotal(product.variantValues[0].price * quantity);
        setCompareTotal(product.variantValues[0].compareAtPrice * quantity);
      }
    },
    [selectedVariant, quantity, product]
  );

  return (
    <Form method="POST">
      <input
        type="hidden"
        name="shopCartId"
        value={currentUser?.client.shopCart._id}
      />
      <input type="hidden" name="variantValueId" value={selectedVariant?._id} />
      <input type="hidden" name="productId" value={product._id} />
      {/* Quantity */}
      <div className="mb-8">
        <Label className="text-lg font-normal" htmlFor="quantity">
          Cantidad
        </Label>
        <div className="flex items-center gap-2 my-2">
          <Button
            variant="outline"
            type="button"
            onMouseDown={() => updateQuantity("decrease")}
          >
            <Minus />
          </Button>
          <Input
            id="quantity"
            name="quantity"
            className="w-16 text-center"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            type="number"
            min={1}
            max={10}
          />
          <Button
            variant="outline"
            type="button"
            onMouseDown={() => updateQuantity("increase")}
          >
            <Plus />
          </Button>
        </div>
        <p className="text-sm text-gray-700">
          {selectedVariant?.quantity ?? 0} unidades disponibles
        </p>
        {STOCK_UNAVAILABLE ? (
          <p className="text-sm text-red-500">
            No disponemos de la cantidad solicitada para este producto
          </p>
        ) : null}
        {actionData?.errors?.quantity ? (
          <p className="text-sm text-red-500">{actionData.errors?.quantity}</p>
        ) : null}
      </div>
      {/* ADD TO CART */}
      {currentUser ? (
        <Button
          disabled={!selectedVariant || submitting || STOCK_UNAVAILABLE}
          className="w-full uppercase font-bold py-6"
          type="submit"
          variant="client"
        >
          {submitting ? (
            <>
              Agregando...
              <Loader2 className="animate-spin" />
            </>
          ) : (
            <>
              Agregar al carrito - ${formatMoney(total)}{" "}
              <span className="line-through text-red-500">
                ${formatMoney(compareTotal)}
              </span>
            </>
          )}
        </Button>
      ) : (
        <Button
          disabled={!selectedVariant}
          variant="client"
          className="w-full uppercase font-bold py-6"
        >
          <Link to="/store/sign-in">
            Agregar al carrito - ${formatMoney(total)}{" "}
            <span className="line-through text-red-500">
              ${formatMoney(compareTotal)}
            </span>
          </Link>
        </Button>
      )}
    </Form>
  );
}

export type FormErrors = {
  variantValueId?: string;
  quantity?: string;
  apiErrors?: string;
};

type Props = {
  currentUser?: CurrentUser | null;
  selectedVariant: VariantValue | null;
  product: {
    _id: string;
    variantValues: VariantValue[];
  };
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

type VariantValue = {
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
};
