import { v4 as uuid } from "uuid";
import React from "react";

export function ProductRating({ rating }: Props) {
  const [stars, setStars] = React.useState<
    Array<{
      idx: number;
      id: string;
      active: boolean;
    }>
  >([]);
  React.useEffect(() => {
    setStars(
      new Array(5).fill({}).map((_, idx) => ({
        idx,
        id: uuid(),
        active: idx + 1 <= Math.ceil(rating),
      }))
    );
  }, [rating]);

  return (
    <div className="flex">
      <div className="flex items-center my-2">
        {stars?.map((star) => (
          <svg
            key={star?.id}
            className={`w-4 h-4 ${
              star?.active ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

type Props = {
  readonly: boolean;
  rating: number;
};
