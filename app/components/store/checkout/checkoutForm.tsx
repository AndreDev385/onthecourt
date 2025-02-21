import React from "react";
import { Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useDebounce } from "~/hooks/use-debounce";
import { PromoCode } from "~/types";
import { getPromoCode } from "~/lib/api/promoCodes/getPromoCode";
import { Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { CurrentUser } from "~/lib/api/users/getCurrentUser";
import { PAYMENT_METHODS, PAYMETHODS_VALUES, requiresCapture } from "~/lib/constants";
import { UploadCapture } from "./uploadCapture";

export function CheckoutForm({
  user,
  errors,
  selectedCode,
  setSelectedCode,
  selectedCurrencyId,
  setSelectedCurrencyId,
  selectedShipping,
  setSelectedShipping,
  location,
  currencies,
}: Props) {
  const navigation = useNavigation();

  const submitting = navigation.state === "submitting";

  const [code, setCode] = React.useState<string>("");
  const debouncedCode = useDebounce(code, 500);

  const [image, setImage] = React.useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = React.useState<string>("")

  type AllowedPayMethods = typeof PAYMETHODS_VALUES[keyof typeof PAYMETHODS_VALUES]
  const [selectedPayMethod, setSelectedPayMethod] = React.useState<AllowedPayMethods>();

  React.useEffect(
    function validatePromoCode() {
      if (debouncedCode.trim() == "") return;
      getPromoCode({ code: debouncedCode, active: true }).then(
        ({ data, errors }) => {
          if (
            (errors && Object.values(errors).length > 0) ||
            !data ||
            new Date(data.expirationDate) <= new Date()
          ) {
            setSelectedCode(null);
            return;
          }
          setSelectedCode(data);
        }
      );
    },
    [debouncedCode, setSelectedCode]
  );

  const REQUIRES_CAPTURE = selectedPayMethod ? requiresCapture(selectedPayMethod) : false;

  const ENABLE_SUBMIT =
    Boolean(selectedCurrencyId) &&
    Boolean(selectedPayMethod) &&
    Boolean(selectedShipping) &&
    Boolean(phoneNumber) &&
    (REQUIRES_CAPTURE ? Boolean(image) : true);

  return (
    <div className="flex justify-center md:justify-end order-last md:order-first">
      <Card className="max-w-lg w-full">
        <Form method="POST">
          <input type="hidden" name="userId" value={user._id} />
          <input
            type="hidden"
            name="shopCartId"
            value={user.client.shopCart._id}
          />
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="mb-4 space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={selectedCurrencyId}
                onValueChange={(v) => setSelectedCurrencyId(v)}
                name="currency"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione una moneda" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency._id} value={currency._id}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.currency ? (
                <p className="text-sm text-red-500">{errors.currency}</p>
              ) : null}
            </div>
            <div className="mb-4 space-y-2">
              <Label
                htmlFor="promoCode"
                className={`${selectedCode === null ? "text-red-500" : ""}${selectedCode ? "text-green-500" : ""
                  }`}
              >
                Código de promoción
              </Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                name="promoCode"
                type="text"
                className={`${selectedCode === null ? "border-red-500" : ""}${selectedCode ? "border-green-500 text-green-500" : ""
                  }`}
              />
              {selectedCode === null ? (
                <p className="text-sm text-red-500">
                  El código de promoción no existe o no está activo
                </p>
              ) : null}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="shippingMethod">Tipo de envío</Label>
              <Select
                name="shippingMethod"
                value={selectedShipping}
                onValueChange={setSelectedShipping}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un tipo de envío" />
                </SelectTrigger>
                <SelectContent>
                  {location.shippingOptions.map((option) => (
                    <SelectItem key={option._id} value={option._id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.shipping ? (
                <p className="text-sm text-red-500">{errors.shipping}</p>
              ) : null}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="payMethod">Método de pago</Label>
              <Select
                name="payMethod"
                value={selectedPayMethod}
                onValueChange={(v) => setSelectedPayMethod(v as AllowedPayMethods)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.filter(
                    (m) =>
                      m.currency ===
                      currencies.find((c) => c._id == selectedCurrencyId)?.name
                  ).map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.paymentMethod ? (
                <p className="text-sm text-red-500">{errors.paymentMethod}</p>
              ) : null}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="phoneNumber">Número de teléfono</Label>
              <Input
                required
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="0414-1234567"
              />
              {errors?.phoneNumber ? (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input name="address" type="text" />
              {errors?.address ? (
                <p className="text-sm text-red-500">{errors.address}</p>
              ) : null}
            </div>
            {
              REQUIRES_CAPTURE ? (
                <UploadCapture image={image} setImage={setImage} />
              ) : null
            }
            <div className="space-y-2">
              <Label htmlFor="ref">Referencia</Label>
              <Input name="ref" type="text" />
              <small className="text-sm text-muted-foreground">
                Ingresa la referencia del pago si aplica
              </small>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              name="intent"
              value="createOrder"
              variant="client"
              disabled={!ENABLE_SUBMIT || submitting}
              className="w-full uppercase"
            >
              {submitting ? (
                <>
                  Cargando...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Pagar"
              )}
            </Button>
            <div className="block mt-4">
              {selectedPayMethod ? (
                <div className="text-center mb-4">
                  <p>
                    Gracias por comprar en On The Court
                  </p>
                </div>
              ) : null}
              {selectedPayMethod === PAYMETHODS_VALUES.zelle ? (
                <div className="text-center">
                  <p>
                    <strong>Zelle</strong>
                  </p>
                  <p className="">Correo: lgmacarilu@gmail.com</p>
                </div>
              ) : null}
              {selectedPayMethod === PAYMETHODS_VALUES.paypal ? (
                <div className="text-center">
                  <p>
                    <strong>PayPal</strong>
                  </p>
                  <p className="">Correo: onthecourt.online@gmail.com</p>
                </div>
              ) : null}
              {selectedPayMethod === PAYMETHODS_VALUES.transferencia ? (
                <div className="text-center">
                  <div className="my-2 flex flex-col gap-2">
                    <div>
                      <p>
                        <strong>Transferencia en Bs</strong>
                      </p>
                      <p>Banco:&nbsp;Banco Fondo Común (BFC)</p>
                      <p>Nro. de cuenta:&nbsp;0151 0100 81 1001568121</p>
                      <p>RIF:&nbsp;J50249928-8</p>
                    </div>
                    <div>
                      <p>
                        <strong>Cuenta custodia en divisas (Venezuela)</strong>
                      </p>
                      <p>Banco:&nbsp;Banco Fondo Común (BFC)</p>
                      <p>Nro. de cuenta:&nbsp;0151 0100 83 1001568139</p>
                      <p>RIF:&nbsp;J50249928-8</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {selectedPayMethod === PAYMETHODS_VALUES.pago_movil ? (
                <div className="text-center">
                  <div className="my-2">
                    <p>
                      <strong>Pago móvil</strong>
                    </p>
                    <p>Banco:&nbsp;Banco Fondo Común (BFC)</p>
                    <p>
                      Titular o razón social:&nbsp;Inversiones On The Court C.A.
                    </p>
                    <p>RIF:&nbsp;J50249928-8</p>
                    <p>Número telefónico:&nbsp;04242710248</p>
                  </div>
                </div>
              ) : null}
            </div>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}

type Props = {
  user: CurrentUser;
  selectedCurrencyId?: string;
  setSelectedCurrencyId: (id: string) => void;
  selectedCode: PromoCode | undefined | null;
  setSelectedCode: (code: PromoCode | null) => void;
  selectedShipping?: string;
  setSelectedShipping: (shipping: string) => void;
  currencies: {
    _id: string;
    name: string;
    symbol: string;
    rate: number;
  }[];
  location: {
    shippingOptions: {
      _id: string;
      name: string;
      price: number;
    }[];
  };
  errors?: CheckoutFormErrors;
};

export type CheckoutFormErrors = {
  currency?: string;
  paymentMethod?: string;
  shipping?: string;
  phoneNumber?: string;
  address?: string;
  apiError?: string;
};
