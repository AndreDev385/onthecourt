import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { getSession } from "~/clientSessions";
import ErrorDisplay from "~/components/shared/error";
import {
  CheckoutForm,
  CheckoutFormErrors,
} from "~/components/store/checkout/checkoutForm";
import CheckoutResume from "~/components/store/checkout/resume";
import { useToast } from "~/hooks/use-toast";
import { getCartInfo } from "~/lib/api/cart/getCartInfo";
import { getCheckOutData } from "~/lib/api/cart/getCheckOutData";
import { createOrder } from "~/lib/api/orders/createOrder";
import { getPromoCode } from "~/lib/api/promoCodes/getPromoCode";
import { getCurrentUser } from "~/lib/api/users/getCurrentUser";
import { getDiscount } from "~/lib/utils";
import { PromoCode } from "~/types";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const { data: user } = await getCurrentUser(session.get("token")!);
  invariant(user);
  const { data: cartInfo } = await getCartInfo(user.client.shopCart._id);
  invariant(cartInfo);

  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  invariant(form.shopCartId, "Error al crear orden");
  invariant(form.userId, "Error al crear orden");

  const errors: CheckoutFormErrors = {};

  if (!form.currency) errors.currency = "Elige una moneda";
  if (!form.shippingMethod) errors.shipping = "Elige un método de envío";
  if (!form.payMethod) errors.paymentMethod = "Elige un método de pago";
  if (!form.phoneNumber)
    errors.phoneNumber = "El número de teléfono es obligatorio";

  if (Object.values(errors).length > 0) {
    return { success: false, errors };
  }

  const subTotal = cartInfo.items.reduce(
    (acc, item) => acc + item.price! * item.quantity,
    0
  );

  const { data: checkoutData } = await getCheckOutData();
  invariant(checkoutData);
  const { currencies, location } = checkoutData;

  const selectedShipping = location.shippingOptions.find(
    (s) => s._id === String(form.shippingMethod)
  );
  invariant(selectedShipping);

  let discount = 0;
  if (form.promoCode) {
    const { data } = await getPromoCode({
      code: String(form.promoCode),
      active: true,
    });
    if (data) {
      discount = getDiscount(subTotal, data);
    }
  }

  const selectedCurrency = currencies.find(
    (c) => c._id === String(form.currency)
  );
  const rate = (selectedCurrency?.rate ?? 100) / 100;

  const { data: orderData, errors: apiErrors } = await createOrder({
    shopCartId: String(form.shopCartId),
    userId: String(form.userId),
    charges: [
      {
        method: String(form.payMethod),
        bank: "",
        ref: form.payMethod === "efectivo" ? "efectivo" : String(form.ref),
        amount: (subTotal - discount + selectedShipping.price) * rate,
      },
    ],
    phone: String(form.phoneNumber),
    address: String(form.address ?? ""),
    rate,
    promoCode: String(form.promoCode).trim(), // user input
    shipping: String(form.shippingMethod), // _id
  });

  if (apiErrors && Object.values(apiErrors).length > 0) {
    errors.apiError = "Ha ocurrido un error al crear el pedido";
    return {
      success: false,
      errors,
    };
  }

  return redirect(`/store/orders/${orderData?._id}`);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  if (!session.has("token")) {
    return redirect("/store/sign-in");
  }

  const { data: user } = await getCurrentUser(session.data.token!);
  invariant(user, "Error al cargar usuario");
  const { data: cartInfo } = await getCartInfo(user.client.shopCart._id);
  invariant(cartInfo, "Error al cargar datos del carrito");

  const { data, errors } = await getCheckOutData();
  if (errors && Object.values(errors).length > 0)
    throw new Error("Error al cargar datos de para el pago");
  invariant(data, "Error al cargar datos para el pago");

  return { cartInfo, ...data, user };
}

// TODO: When implementing locations, update this page
export default function CheckoutPage() {
  const { location, currencies, cartInfo, user } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();

  const [selectedCurrencyId, setSelectedCurrencyId] = React.useState<string>();
  const [selectedCode, setSelectedCode] = React.useState<
    PromoCode | null | undefined
  >();
  const [selectedShipping, setSelectedShipping] = React.useState<string>();

  React.useEffect(
    function showErrorToast() {
      if (actionData?.errors?.apiError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: actionData.errors.apiError,
        });
      }
    },
    [actionData, toast]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 lg:px-0 my-16">
      {/* FORM */}
      <CheckoutForm
        user={user}
        errors={actionData?.errors}
        selectedCode={selectedCode}
        setSelectedCode={setSelectedCode}
        selectedCurrencyId={selectedCurrencyId}
        setSelectedCurrencyId={setSelectedCurrencyId}
        selectedShipping={selectedShipping}
        setSelectedShipping={setSelectedShipping}
        location={location}
        currencies={currencies}
      />
      {/* Info */}
      <CheckoutResume
        items={cartInfo.items}
        discount={getDiscount(
          cartInfo.items.reduce(
            (acc, item) => acc + item.price! * item.quantity,
            0
          ),
          selectedCode ?? null
        )}
        deliveryCost={
          location?.shippingOptions?.find((so) => so._id === selectedShipping)
            ?.price ?? 0
        }
        currency={currencies.find((c) => c._id === selectedCurrencyId)}
      />
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
