export function ProductCard({
  title = "",
  image = "",
  quantityVariants = 0,
}: ProductCardProps) {
  return (
    <div className="w-full p-4 rounded border border-gray-200 mb-6">
      <div className="flex flex-row flex-wrap -mx-2">
        <div className="px-2 my-auto">
          <img
            className="w-20 h-20 object-cover object-center border border-gray-100 rounded"
            src={image}
            alt={title}
          />
        </div>
        <div className="px-2 w-full flex-1 flex flex-col flex-wrap justify-evenly">
          <h3 className="">{title}</h3>
          <span className="text-gray-600 text-sm">
            {quantityVariants} variantes
          </span>
        </div>
      </div>
    </div>
  );
}

type ProductCardProps = {
  title: string;
  image: string;
  quantityVariants: number;
};
