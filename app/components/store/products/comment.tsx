import { Separator } from "~/components/ui/separator";
import { ProductRating } from "./productRating";

type Props = {
  comment: {
    _id: string;
    text: string;
    rating: number;
    client: {
      name: string;
    };
  };
};

export function ProductComment({ comment }: Props) {
  return (
    <article className="w-full flex flex-col mb-4 px-4 py-4 bg-gray-50 gap-4 rounded border border-gray-200 ">
      <div>
        <ProductRating rating={comment.rating} size={8} />
        <p className="font-bold text-lg">{comment?.client?.name}</p>
      </div>
      <Separator />
      <p className="leading-relaxed mt-2">{comment.text}</p>
    </article>
  );
}
