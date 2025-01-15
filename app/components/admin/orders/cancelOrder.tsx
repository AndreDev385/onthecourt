import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { UPDATE_ORDER_ACTIONS } from "~/routes/admin.sales.$orderId.order";

type Props = {
  _id: string;
};

export function CancelOrder({ _id }: Props) {
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <h2 className="text-gray-700">Anular Orden</h2>
        <Form method="POST">
          <input type="hidden" name="_id" value={_id} />
          <Button
            name="intent"
            value={UPDATE_ORDER_ACTIONS.markCaceled}
            type="submit"
            variant="destructive"
          >
            Anular
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
