import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return params.id;
}

export default function OrderDetailPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Order Detail Page {data}</h1>
    </div>
  );
}
