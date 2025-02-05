import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData } from "@remix-run/react";
import { parse } from "date-fns";
import invariant from "tiny-invariant";
import {
  PromoCodeForm,
  PromoCodeFormErrors,
} from "~/components/admin/promoCodes/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createPromoCode } from "~/lib/api/promoCodes/createPromoCode";
import { DATE_FORMAT } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const code = formData.get("code");
  const discount = formData.get("discount");
  const type = formData.get("type");
  const expirationDate = formData.get("expirationDate");

  const errors: PromoCodeFormErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (!code) errors.code = "El código es obligatorio";
  if (!discount) errors.discount = "El descuento es obligatorio";
  if (isNaN(Number(discount)))
    errors.discount = "El descuento debe ser un número";
  if (Number(discount) <= 0)
    errors.discount = "El descuento debe ser mayor a cero";
  if (!expirationDate)
    errors.expirationDate = "La fecha de expiración es obligatoria";

  if (Object.values(errors).length > 0) {
    return errors;
  }

  try {
    const date = parse(String(expirationDate), DATE_FORMAT, new Date());

    const { data, errors: apiErrors } = await createPromoCode({
      name: String(name),
      code: String(code),
      discount: Number(discount),
      fixed: type === "fixed",
      percentage: type === "percentage",
      expirationDate: date,
    });

    if (apiErrors && Object.values(apiErrors).length > 0) {
      errors.apiError = true;
      return errors;
    }

    invariant(data, "Error al crear código de promoción");
    return redirect(`/admin/promo-codes/${data._id}`);
  } catch (e) {
    errors.apiError = true;
    return errors;
  }
}

export default function CreatePromoCodePage() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear código de promoción</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/promo-codes/list">
              <Icon icon="arrow-left" />
              CÓDIGOS DE PROMOCIÓN
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <PromoCodeForm errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
