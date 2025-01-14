import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { formatMoney, mapStatusToClientText } from "~/lib/utils";

export default function OrderSummary({ order }: Props) {
  return (
    <Link to={`/store/orders/${order._id}`} className="block">
      <Card className="rounded-none">
        <CardHeader className="aspect-square p-0">
          <img
            className="w-full h-full -px-6"
            src={order.products[0].photo}
            alt={order.products[0].title}
          />
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-2">
          <h3 className="text-lg font-bold">{order.products[0].title}</h3>
          <p className="text-lg">
            Estado: {mapStatusToClientText(order.status)}
          </p>
          <Separator />
        </CardContent>
        <CardFooter>
          <p className="text-lg font-bold">
            Total: ${formatMoney(order.total)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

type Props = {
  order: {
    _id: string;
    status: number;
    shipping: {
      name: string;
    };
    total: number;
    products: {
      photo: string;
      title: string;
    }[];
  };
};
