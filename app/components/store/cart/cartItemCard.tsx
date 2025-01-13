import { Dialog } from "@radix-ui/react-dialog";
import { Form } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CartItem } from "~/lib/api/cart/getCartInfo";
import { formatMoney } from "~/lib/utils";

export function CartItemCard({ item, shopCartId, loading }: Props) {
  function displayVariant(i: number) {
    if (i === 0) return item.variant1;
    if (i === 1) return item.variant2;
    if (i === 2) return item.variant3;
    return item.variant1;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,1fr] border border-gray-200 w-full">
      {/* Image */}
      <div className="flex justify-center">
        <div className="w-40 md:w-48">
          <img
            className="w-full h-auto object-cover object-center"
            src={item.photo}
            alt={item.product.title}
          />
        </div>
      </div>
      {/* Info */}
      <div className="p-4 flex flex-col justify-between">
        <h3 className="text-2xl font-bold mb-2">{item.product.title}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 md:text-lg">
            {item.product.variants.map((v, i) => {
              return (
                <div key={v.title}>
                  {v.title}: <strong>{displayVariant(i)}</strong>
                </div>
              );
            })}
          </div>
          <p className="md:text-lg">
            Cantidad: <strong>{item.quantity}</strong>
          </p>
          <p className="md:text-lg">
            Precio c/u: <strong>${formatMoney(item.price)}</strong>
          </p>
        </div>
      </div>
      {/* Total and actions */}
      <div className="p-4 flex flex-row-reverse md:flex-col items-end justify-between">
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={loading} type="button" variant="destructive">
                {loading ? (
                  <>
                    Eliminando...
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Eliminar producto
                </DialogTitle>
                <DialogDescription className="text-lg">
                  Estas seguro que deseas eliminar este producto del carrito?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={loading} type="submit">
                    Cancelar
                  </Button>
                </DialogClose>
                <Form method="POST">
                  <input type="hidden" name="shopCartId" value={shopCartId} />
                  <input type="hidden" name="orderProductId" value={item._id} />
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      name="intent"
                      value="delete"
                      variant="destructive"
                    >
                      Eliminar
                    </Button>
                  </DialogClose>
                </Form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="md:text-lg">
          Subtotal: <strong>${formatMoney(item.price * item.quantity)}</strong>
        </p>
      </div>
    </div>
  );
}

type Props = {
  item: CartItem;
  shopCartId: string;
  loading: boolean;
};
