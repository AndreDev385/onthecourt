import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { ShoppingCart } from "lucide-react";
import React from "react";
import invariant from "tiny-invariant";
import { getSession } from "~/clientSessions";
import ErrorDisplay from "~/components/shared/error";
import { CartItemCard } from "~/components/store/cart/cartItemCard";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { getCartInfo } from "~/lib/api/cart/getCartInfo";
import { removeItemFromCart } from "~/lib/api/cart/removeItemFromCart";
import { getCurrentUser } from "~/lib/api/users/getCurrentUser";
import { formatMoney } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const shopCartId = formData.get("shopCartId");
  const orderProductId = formData.get("orderProductId");

  const itemToDelete = {
    orderProductId: String(orderProductId),
    shopCartId: String(shopCartId),
  };

  const { errors } = await removeItemFromCart(itemToDelete);
  if (errors && Object.values(errors).length > 0) {
    return {
      error: "Ha ocurrido un error al remover el producto del carrito",
      success: false,
    };
  }

  return { success: true };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  if (!session.has("token")) {
    return redirect("/store/sign-in");
  }

  const { data } = await getCurrentUser(session.data.token!);
  invariant(data, "Error al cargar usuario");
  const { data: cartInfo } = await getCartInfo(data.client.shopCart._id);
  invariant(cartInfo, "Error al cargar datos del carrito");
  return cartInfo;
}

export default function CartPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { toast } = useToast();

  const total = formatMoney(
    data.items.reduce((acc, prod) => acc + prod.price! * prod.quantity!, 0)
  );

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "El producto ha sido eliminado del carrito",
        });
      } else if (actionData?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: actionData.error,
        });
      }
    },
    [actionData, toast]
  );

  const submitting = navigation.state === "submitting";

  return (
    <div className="container mx-auto px-4 lg:px-0 my-12 ">
      {data.items.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col gap-4 max-w-4xl w-full">
            {data.items.map((item) => (
              <CartItemCard
                loading={submitting}
                key={item._id}
                item={item}
                shopCartId={data._id}
              />
            ))}
          </div>
          <div className="border gray-200 max-w-4xl w-full p-4 flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="text-3xl font-bold">Total</div>
              <div className="text-2xl font-bold">${total}</div>
            </div>
            <div className="flex justify-end">
              <Button variant="client" className="px-8 uppercase font-bold">
                <Link to="/store/checkout">Pagar</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <h2 className="text-4xl font-bold text-center">
            Tu carrito está vacío
          </h2>
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-lg text-center">
              No hay ningún producto en tu carrito, añade algunos y empieza a
              comprar
            </p>
            <ShoppingCart className="w-24 h-24 text-primary" />
            <Button variant="client" className="p-6 uppercase font-bold">
              <Link to="/store/products">Empieza a comprar</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
