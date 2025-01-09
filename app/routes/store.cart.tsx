import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getSession } from "~/clientSessions";
import { CartItemCard } from "~/components/store/cart/cartItemCard";
import { getCartInfo } from "~/lib/api/cart/getCartInfo";
import { getCurrentUser } from "~/lib/api/users/getCurrentUser";

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
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.items.map((item) => (
        <CartItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}
