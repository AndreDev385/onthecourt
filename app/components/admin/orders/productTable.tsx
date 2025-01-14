import { formatMoney } from "~/lib/utils";
import { ItemSummary } from "./itemSummary";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function ProductTable({ order }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="mb-4 text-xl font-bold">Detalles de Orden</h2>
      </CardHeader>
      <CardContent>
        {order.products.map((product, idx) => (
          <ItemSummary
            key={idx}
            title={product?.title ?? ""}
            variant1={product?.variant1 ?? ""}
            variant2={product?.variant2 ?? ""}
            variant3={product?.variant3 ?? ""}
            photo={product?.photo ?? ""}
            price={product?.price ?? 0}
            quantity={product?.quantity ?? 0}
          />
        ))}
        <div className="ml-auto table table-auto">
          <div className="table-row-group text-xs">
            <div className="table-row">
              <div className="table-cell text-right px-2 py-1">Subtotal</div>
              <div className="table-cell text-right px-2 py-1">
                {formatMoney(order?.subtotal)}
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell text-right px-2 py-1">Descuentos</div>
              <div className="table-cell text-right px-2 py-1">
                {formatMoney(order?.discount)}
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell text-right px-2 py-1">Impuestos</div>
              <div className="table-cell text-right px-2 py-1">
                {formatMoney(order?.tax)}
              </div>
            </div>
            <div className="table-row text-sm">
              <div className="table-cell text-right px-2 py-1 text-gray-700">
                Total
              </div>
              <div className="table-cell text-right px-2 py-1 text-gray-700">
                <strong>{formatMoney(order?.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type Props = {
  order: {
    _id: string;
    status: number;
    paid: boolean;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    commission: number;
    phone: string;
    products: {
      title: string;
      photo: string;
      variant1: string;
      variant2: string;
      variant3: string;
      price: number;
      quantity: number;
      location: {
        name: string;
      };
    }[];
    client: {
      name: string;
      email: string;
    };
    charges: {
      ref: string;
      bank: string;
      method: string;
      amount: number;
      createdAt: string;
    }[];
    updatedAt: string;
    createdAt: string;
  };
};
