import {
  Splide,
  SplideSlide,
} from "../../../../node_modules/@splidejs/react-splide";
import "@splidejs/react-splide/css";

type Props = {
  carouselImages: {
    title: string;
    description: string;
    url: string;
  }[];
};

export function Carousel({ carouselImages }: Props) {
  return (
    <Splide
      options={{
        type: "loop",
        perPage: 1,
        perMove: 1,
        gap: "1rem",
        pagination: true,
        arrows: false,
        autoplay: true,
        interval: 5000,
      }}
      aria-label="Image Carousel"
    >
      {carouselImages.map((item) => (
        <SplideSlide key={item.url} className="relative aspect-video w-full">
          <div>
            <img
              src={item.url}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 md:p-10">
              <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-white text-sm md:text-lg">
                {item.description}
              </p>
            </div>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
}
