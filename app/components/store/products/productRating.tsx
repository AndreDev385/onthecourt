import { v4 as uuid } from "uuid";
import React from "react";
import { Star } from "lucide-react";

export function ProductRating({ rating, setRating, size = 6 }: Props) {
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

  function changeRating(e: React.MouseEvent<SVGElement>) {
    const { id } = e.currentTarget.dataset;
    const [star] = stars.filter((s) => s.id === id);
    setRating!(star?.idx + 1);
  }

  return (
    <div className="flex">
      <div className="flex items-center my-2">
        {stars?.map((star) => (
          <Star
            onMouseDown={setRating ? changeRating : (e) => e.preventDefault()}
            key={star.id}
            data-id={star?.id}
            fill="currentColor"
            className={`w-${size} h-${size} ${
              star.active ? "text-yellow-500" : "text-gray-300 cursor-pointer"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  rating: number;
  setRating?: React.Dispatch<React.SetStateAction<number>>;
  size?: number;
};
