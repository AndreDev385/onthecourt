import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { CartItem } from "~/lib/api/cart/getCartInfo";
import { formatMoney } from "~/lib/utils";
import { Currency } from "~/types";

export default function CheckoutResume({
  items,
  currency,
  deliveryCost,
  discount,
}: Props) {
  const subTotal = items.reduce(
    (acc, item) => acc + item.price! * item.quantity,
    0
  );

  return (
    <div className="flex justify-center md:justify-start">
      <div className="max-w-lg w-full space-y-4">
        {/* Resumen productos */}
        <Card>
          <CardHeader className="text-2xl text-center">
            Resumen de productos
          </CardHeader>
          <CardContent>
            <ul>
              {items.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <span className="capitalize font-bold flex-1">
                    {item.product.title}
                  </span>
                  <span>
                    {currency?.symbol ?? "$"}{" "}
                    {formatMoney((item.price * (currency?.rate ?? 100)) / 100)}{" "}
                    x {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Resumen precios */}
        <Card>
          <CardContent className="pt-6">
            <ul className="flex flex-col gap-4">
              <li className="flex justify-between items-center">
                <span className="capitalize font-bold flex-1">Subtotal</span>
                <span>
                  {currency?.symbol ?? "$"}{" "}
                  {formatMoney((subTotal * (currency?.rate ?? 100)) / 100)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="capitalize font-bold flex-1">Descuento</span>
                <span className="text-red-500">
                  - {currency?.symbol ?? "$"}{" "}
                  {formatMoney(
                    ((discount ?? 0) * (currency?.rate ?? 100)) / 100
                  )}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="capitalize font-bold flex-1">
                  Servicio de envío
                </span>
                <span>
                  {currency?.symbol ?? "$"}{" "}
                  {formatMoney(
                    ((deliveryCost ?? 0) * (currency?.rate ?? 100)) / 100
                  )}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="capitalize font-bold flex-1">Total</span>
                <span className="font-bold">{`${
                  currency?.symbol ?? "$"
                } ${formatMoney(
                  (subTotal - (discount ?? 0) + (deliveryCost ?? 0)) *
                    (Number(currency?.rate ?? 100) / 100)
                )}`}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type Props = {
  items: CartItem[];
  currency?: Pick<Currency, "name" | "symbol" | "rate" | "_id">;
  discount?: number;
  deliveryCost?: number;
};
