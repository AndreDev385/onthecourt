import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface PricingFormProps {
  price: number;
  compareAtPrice: number;
  errors?: { price?: string; compareAtPrice?: string };
}

export function PricingForm({
  price = 0,
  compareAtPrice = 0,
  errors,
}: PricingFormProps) {
  return (
    <div className="w-full p-4 rounded border border-gray-200 mb-6 px-4">
      <h3 className="text-lg mb-4">Precios</h3>
      <div className="w-full flex flex-row flex-wrap -mx-4">
        <div className="px-4 flex flex-col flex-wrap w-full lg:w-1/2">
          <div className="mb-4">
            <Label>Precio</Label>
            <Input
              defaultValue={price / 100}
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
            />
            {errors?.price ? (
              <p className="text-sm text-red-500">{errors.price}</p>
            ) : null}
          </div>
        </div>
        <div className="px-4 flex flex-col flex-wrap w-full lg:w-1/2">
          <div className="mb-4">
            <Label>Precio Comparativo</Label>
            <Input
              defaultValue={compareAtPrice / 100}
              name="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              required
            />
            {errors?.price ? (
              <p className="text-sm text-red-500">{errors.price}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
