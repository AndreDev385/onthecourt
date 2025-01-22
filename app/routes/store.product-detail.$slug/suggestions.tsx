import { SuggestionCard } from "~/components/store/products/suggestionCard";
import { Separator } from "~/components/ui/separator";

export function Suggestions({ suggestions }: Props) {
  return suggestions.length > 0 ? (
    <>
      <Separator className="my-8" />
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Otros clientes también vieron
        </h2>
        <div className="grid grid-cols-2">
          {suggestions.map((s) => (
            <SuggestionCard key={s.title} suggestion={s} />
          ))}
        </div>
      </div>
    </>
  ) : null;
}

type Props = {
  suggestions: {
    slug: string;
    title: string;
    photos: string[];
    createdAt: Date;
    variantValues: {
      price: number;
    }[];
  }[];
};
