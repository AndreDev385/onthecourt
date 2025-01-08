import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProduct } from "~/lib/api/products/getProductDashboard";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.productId, "Error al cargar datos del producto");

  const { data, errors } = await getProduct(params.productId);
  if (errors && Object.values(errors).length > 0) throw new Error();

  invariant(data, "Error al cargar datos del producto");
  return data;
}

export default function ProductVariants() {
  return <Outlet />;
}
