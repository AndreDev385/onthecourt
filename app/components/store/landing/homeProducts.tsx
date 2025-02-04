import { ProductCardSlider } from "../products/productSlider";

type Props = {
  products: {
    slug: string;
    title: string;
    description: string;
    isService: boolean;
    photos: string[];
    rating: number;
    _id: string;
    variantValues: {
      price: number;
    }[];
  }[];
};

export function HomeProducts({ products }: Props) {
  return products.length > 0 ? (
    <div className="container mx-auto my-8 px-4 flex flex-col gap-16 justify-center items-center">
      <div className="px-8 py-4 border-b-4 border-green-500">
        <h1 className="text-3xl font-bold">Populares</h1>
      </div>
      <ProductCardSlider products={products} />
    </div>
  ) : null
}
