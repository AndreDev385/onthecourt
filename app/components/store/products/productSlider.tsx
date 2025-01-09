import {
  Splide,
  SplideSlide,
} from "../../../../node_modules/@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { ProductCard } from "./productCard";

export function ProductCardSlider({ products }: ProductCardSliderProps) {
  return (
    <Splide
      options={{
        gap: ".5rem",
        padding: { right: "2rem" },
        perPage: 4,
        breakpoints: {
          1440: {
            perPage: 4,
          },
          1024: {
            perPage: 3,
          },
          640: {
            perPage: 2,
          },
        },
        pagination: false,
        perMove: 1,
        arrows: false,
      }}
      aria-label="Product Slider"
    >
      {products.map((product) => (
        <SplideSlide key={product._id}>
          <ProductCard product={product} />
        </SplideSlide>
      ))}
    </Splide>
  );
}

type ProductCardSliderProps = {
  products: Array<{
    slug: string;
    title: string;
    description: string;
    isService: boolean;
    rating: number;
    photos: string[];
    _id: string;
    variantValues: {
      price: number;
    }[];
  }>;
};
