import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getProductDashboard } from "~/lib/api/products/getProductDashboard";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.productId, "Error al cargar datos del producto");

  const { data, errors } = await getProductDashboard(params.productId);
  if (errors && Object.values(errors).length > 0) throw new Error();

  invariant(data, "Error al cargar datos del producto");
  return data;
}

export default function ProductVariants() {
  const { pathname } = useLocation();
  return <Outlet key={pathname} />;
}
