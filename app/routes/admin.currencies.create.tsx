import { ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  CurrencyForm,
  CurrencyFormErrors,
} from "~/components/admin/currencies/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { createCurrency } from "~/lib/api/currencies/createCurrency";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const symbol = formData.get("symbol");
  const rate = formData.get("rate");

  const errors: CurrencyFormErrors = {};

  if (!name) errors.name = "El nombre es obligatorio";
  if (!symbol) errors.symbol = "El símbolo es obligatorio";
  if (!rate) errors.rate = "La tasa es obligatoria";
  const numberRate = Number(rate);
  if (isNaN(numberRate)) errors.rate = "La tasa debe ser un número";
  if (numberRate <= 0) errors.rate = "La tasa debe ser mayor a cero";

  if (Object.values(errors).length > 0) {
    return errors;
  }

  // call endpoint
  try {
    const { data, errors: apiErrors } = await createCurrency({
      name: name as string,
      symbol: symbol as string,
      rate: numberRate,
    });

    if (apiErrors && Object.values(apiErrors).length > 0) {
      errors.apiError = true;
      return errors;
    }

    invariant(data);

    return redirect(`/admin/currencies/${data._id}`);
  } catch (e) {
    errors.apiError = true;
    return errors;
  }
}

export default function CreateCurrencyPage() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear moneda</h1>
          <Button asChild variant="ghost" className="font-bold text-sm">
            <Link to="/admin/currencies/list">
              <Icon icon="arrow-left" />
              MONEDAS
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <CurrencyForm isUpdate={false} errors={actionData} />
        </CardContent>
      </Card>
    </div>
  );
}
