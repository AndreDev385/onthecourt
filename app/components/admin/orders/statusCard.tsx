import { Form, useNavigation } from "@remix-run/react";
import { CircleAlert, CircleCheckBig, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ORDER_STATUS } from "~/lib/constants";
import { UPDATE_ORDER_ACTIONS } from "~/routes/admin.orders.$id";

function deliverText(status: number) {
  if (status === 3 || status === 5) {
    return "Entregado";
  }
  if (status === 7) {
    return "ANULADO";
  }
  return "Por Entregar";
}

function paymentText(status: number, paid: boolean) {
  if (paid) {
    return "Pagado";
  }
  if (status === 4) {
    return "Crédito";
  }
  if (status === 7) {
    return "ANULADO";
  }
  return "Por pagar";
}

export function StatusCard({ status, paid, _id }: Props) {
  const navigation = useNavigation();

  const markingOrderAsPaid =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === UPDATE_ORDER_ACTIONS.markPaid;

  const markingOrderAsDelivered =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === UPDATE_ORDER_ACTIONS.markDelivered;

  return (
    <section className="w-full flex flex-col flex-wrap gap-4">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="w-8 mr-1 flex">
            {paid ? (
              <CircleCheckBig className="text-green-500" />
            ) : (
              <CircleAlert className="text-yellow-500" />
            )}
          </div>
          <div className="flex-auto flex">
            <p className="my-auto ml-3 text-gray-500">
              {paymentText(status, paid)}
            </p>
          </div>
          <div className="w-auto flex">
            {!paid && (
              <Form method="POST">
                <input type="hidden" name="_id" value={_id} />
                <input type="hidden" name="status" value={status} />
                <Button
                  type="submit"
                  variant="ghost"
                  name="intent"
                  value={UPDATE_ORDER_ACTIONS.markPaid}
                  disabled={markingOrderAsPaid || markingOrderAsDelivered}
                  className="px-3 py-2 my-auto text-green-600 text-sm disabled:text-green-300"
                >
                  {markingOrderAsPaid ? (
                    <>
                      Actualizando...
                      <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    "Marcar Pagado"
                  )}
                </Button>
              </Form>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex">
          <div className="w-8 mr-1 flex items-center">
            {[ORDER_STATUS.delivered, ORDER_STATUS.creditDelivered].includes(
              status
            ) ? (
              <CircleCheckBig className="text-green-500" />
            ) : (
              <CircleAlert className="text-yellow-500" />
            )}
          </div>
          <div className="flex-auto flex">
            <p className="my-auto ml-3 text-gray-500">{deliverText(status)}</p>
          </div>
          <div className="w-auto">
            {![3, 5].includes(status) && (
              <Form method="POST">
                <input type="hidden" name="_id" value={_id} />
                <input type="hidden" name="paid" value={paid ? "paid" : ""} />
                <Button
                  type="submit"
                  variant="ghost"
                  name="intent"
                  value={UPDATE_ORDER_ACTIONS.markDelivered}
                  className="px-3 py-2 text-green-600 text-sm"
                >
                  {markingOrderAsDelivered ? (
                    <>
                      Actualizando...
                      <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    "Marcar Entregado"
                  )}
                </Button>
              </Form>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

type Props = {
  status: number;
  paid: boolean;
  _id: string;
};
