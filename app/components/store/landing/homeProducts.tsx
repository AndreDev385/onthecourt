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
  return (
    <div className="container mx-auto my-8 px-4 flex flex-col justify-center items-center">
      <ProductCardSlider products={products} />
    </div>
  );
}
