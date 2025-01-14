import { Link } from "@remix-run/react";

export function SuggestionCard({ suggestion }: Props) {
  return (
    <article className="flex flex-col items-center justify-center border border-gray-200 shadow">
      <Link
        className="w-full aspect-square flex"
        to={`/store/product-detail/${suggestion.slug}`}
      >
        <img
          className="block h-auto w-full object-cover object-center"
          alt={`${suggestion?.title}`}
          src={suggestion?.photos![0]}
        />
      </Link>
      <div className="p-4 w-full">
        <h2 className="text-gray-800 font-bold">{suggestion?.title}</h2>
      </div>
    </article>
  );
}

type Props = {
  suggestion: {
    slug: string;
    title: string;
    photos: string[];
  };
};
