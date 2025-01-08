import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

type InventoryEditFormProps = {
  sku?: string;
  //barcode?: string;
  quantity: number;
  errors?: { quantity?: string };
};

export function InventoryEditForm({
  sku = "",
  quantity = 0,
  errors,
}: InventoryEditFormProps) {
  return (
    <div className="w-full p-4 rounded border border-gray-200 shadow mb-6">
      <h3 className="text-lg mb-4">Inventario</h3>
      <div className="w-full flex flex-row flex-wrap -mx-4">
        <div className="px-4 flex flex-col flex-wrap w-full lg:w-1/2">
          <div className="mb-4">
            <Label htmlFor="sku" className="block mb-2">
              SKU (Unidad de mantenimiento)
            </Label>
            <Input name="sku" type="text" defaultValue={sku} required />
          </div>
        </div>
        <div className="px-4 flex flex-col flex-wrap w-full lg:w-1/2" />
      </div>
      <Separator className="my-4" />
      <div className="w-full flex flex-row flex-wrap -mx-4 mb-4">
        <div className="px-4 flex flex-col flex-wrap w-full lg:w-1/2">
          <div className="mb-4">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              name="quantity"
              type="number"
              min="0"
              step="1"
              defaultValue={quantity}
              required
            />
            {errors?.quantity ? (
              <p className="text-sm text-red-500">{errors.quantity}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
