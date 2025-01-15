import { formatMoney } from "~/lib/utils";

export function ItemSummary({
  title,
  variant1,
  variant2,
  variant3,
  price,
  quantity,
  photo,
}: Props) {
  return (
    <article className="flex flex-row flex-wrap mb-4 -mx-2 pb-4 border-b border-gray-200">
      <div className="w-20 h-20 aspect-square">
        <img src={photo} alt={title} className="object-cover" />
      </div>
      <div className="flex-1 px-2 h-full flex flex-col flex-wrap justify-start my-auto">
        <h2 className="text-indigo-700 text-lg">{title}</h2>
        <span className="text-sm">
          {variant1} {variant2} {variant3}
        </span>
      </div>
      <div className="px-2 h-full w-auto flex flex-col flex-wrap justify-center my-auto">
        <span className="text-sm">
          {formatMoney(price)} x {quantity}
        </span>
      </div>
      <div className="px-2 h-full w-auto flex flex-col flex-wrap justify-center my-auto text-sm">
        <span>{formatMoney(price * quantity)}</span>
      </div>
    </article>
  );
}

type Props = {
  title: string;
  variant1: string;
  variant2: string;
  variant3: string;
  photo: string;
  price: number;
  quantity: number;
};
