import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  CURRENCY_FORM_INTENTS,
  CurrencyForm,
  CurrencyFormErrors,
} from "~/components/admin/currencies/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getCurrency } from "~/lib/api/currencies/getCurrency";
import { updateCurrency } from "~/lib/api/currencies/updateCurrency";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const _id = formData.get("_id");
  const name = formData.get("name");
  const symbol = formData.get("symbol");
  const rate = formData.get("rate");
  const intent = formData.get("intent");

  const errors: CurrencyFormErrors = {};

  invariant(_id, "Error al buscar datos del usuario");
  if (!name) errors.name = "El nombre es obligatorio";
  if (!symbol) errors.symbol = "El símbolo es obligatorio";
  if (!rate) errors.rate = "La tasa es obligatoria";
  const numberRate = Number(rate);
  if (isNaN(numberRate)) errors.rate = "La tasa debe ser un número";
  if (numberRate <= 0) errors.rate = "La tasa debe ser mayor a cero";

  if (Object.values(errors).length > 0) {
    return { errors, intent: String(intent) };
  }

  try {
    if (intent === CURRENCY_FORM_INTENTS.activate) {
      await updateCurrency({
        _id: _id as string,
        active: true,
      });
    } else if (intent === CURRENCY_FORM_INTENTS.deactivate) {
      await updateCurrency({
        _id: _id as string,
        active: false,
      });
    } else if (intent === CURRENCY_FORM_INTENTS.update) {
      await updateCurrency({
        _id: _id as string,
        name: name as string,
        symbol: symbol as string,
        rate: numberRate,
      });
    }
  } catch (_) {
    errors.apiError = true;
    return { errors, intent: String(intent) };
  }

  return { errors, intent: String(intent) };
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Error al buscar datos del usuario");
  const { data, errors } = await getCurrency(params.id);

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al buscar datos del usuario");
  }

  return data;
}

export default function EditCurrencyPage() {
  const currency = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Editar moneda</h1>
          <Link to="/admin/currencies/list">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              MONEDAS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <CurrencyForm
            isUpdate={true}
            currency={currency}
            errors={actionData?.errors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
