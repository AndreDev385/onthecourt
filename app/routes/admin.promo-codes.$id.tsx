import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { parse } from "date-fns";
import invariant from "tiny-invariant";
import {
  PromoCodeForm,
  PromoCodeFormErrors,
} from "~/components/admin/promoCodes/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getPromoCode } from "~/lib/api/promoCodes/getPromoCode";
import { updatePromoCode } from "~/lib/api/promoCodes/updatePromoCode";
import { FORM_INTENTS } from "~/lib/constants";
import { DATE_FORMAT } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const code = formData.get("code");
  const discount = formData.get("discount");
  const type = formData.get("type");
  const expirationDate = formData.get("expirationDate");
  const intent = formData.get("intent");

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
    return { errors: errors, intent: String(intent) };
  }

  try {
    const date = parse(String(expirationDate), DATE_FORMAT, new Date());
    if (intent === FORM_INTENTS.activate) {
      await updatePromoCode({
        _id: _id as string,
        active: true,
      });
    } else if (intent === FORM_INTENTS.deactivate) {
      await updatePromoCode({
        _id: _id as string,
        active: false,
      });
    } else if (intent === FORM_INTENTS.update) {
      await updatePromoCode({
        _id: _id as string,
        name: name as string,
        code: code as string,
        discount: Number(discount),
        fixed: type === "fixed",
        percentage: type === "percentage",
        expirationDate: date,
      });
    }
    return { errors, intent: String(intent) };
  } catch (e) {
    errors.apiError = true;
    return { errors, intent: String(intent) };
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Error al código de promoción");
  const { data, errors } = await getPromoCode(params.id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar datos del usuario");
  }

  invariant(data, "Error al cargar código de promoción");
  return data;
}

export default function EditPromoCodePage() {
  const promoCode = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar código de promoción</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/promo-codes/list">
              <Icon icon="arrow-left" />
              CÓDIGOS DE PROMOCIÓN
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <PromoCodeForm
            isUpdate={true}
            promoCode={promoCode}
            errors={actionData?.errors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
