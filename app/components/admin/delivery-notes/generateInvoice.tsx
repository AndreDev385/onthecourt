import { Form, useNavigation } from "@remix-run/react";
import { CircleAlert, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Props = {
  deliveryNoteId: string;
  currencies: {
    _id: string;
    name: string;
    rate: number;
  }[];
  generateBill?: boolean;
};

export function GenerateInvoice({
  currencies,
  generateBill,
  deliveryNoteId,
}: Props) {
  const [rate, setRate] = React.useState(1);
  const [currency, setCurrency] = React.useState("none");

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === "string") {
      setCurrency(e);
      const [_currency] = currencies.filter((c) => c._id === e);
      setRate(_currency.rate ? _currency.rate / 100 : 1);
    } else {
      setRate(Number(e.target.value));
    }
  };

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Card className="p-4">
      <Form method="POST">
        <input type="hidden" name="deliveryNoteId" value={deliveryNoteId} />
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center">
              <CircleAlert className="text-yellow-500" />
              <p className="text-right text-sm">Sin facturar</p>
            </div>
          </div>
          <div>
            <Label htmlFor="rate">Tasa de Cambio</Label>
            <Input
              name="rate"
              type="number"
              min="1"
              step="0.01"
              value={rate}
              onChange={onChange}
              disabled={generateBill}
            />
          </div>
          <div>
            <Label htmlFor="currency">Moneda</Label>
            <Select name="currencyId" value={currency} onValueChange={onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione una Moneda" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((_currency) => (
                  <SelectItem value={_currency._id} key={_currency._id}>
                    {_currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              name="intent"
              value="createInvoice"
              type="submit"
              disabled={currency === "none" || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  Generando...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "Generar Factura"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}
