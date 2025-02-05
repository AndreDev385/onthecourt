import React from "react";
import {
  Splide,
  SplideSlide,
} from "../../../../node_modules/@splidejs/react-splide";

export function ProductPhotoSlider({ photos, isMobile, selectedPhoto }: Props) {
  const mainRef = React.useRef<Splide>(null);
  const thumbnailRef = React.useRef<Splide>(null);

  React.useEffect(() => {
    if (
      mainRef.current &&
      thumbnailRef.current &&
      thumbnailRef.current.splide
    ) {
      mainRef.current.sync(thumbnailRef.current.splide);
    }
  }, []);

  const initialSlide = React.useMemo(() => {
    if (!selectedPhoto) return 0;
    const index = photos.indexOf(selectedPhoto);
    return index !== -1 ? index : 0;
  }, [selectedPhoto, photos]);

  React.useEffect(() => {
    if (
      mainRef.current &&
      thumbnailRef.current &&
      thumbnailRef.current.splide
    ) {
      mainRef.current.sync(thumbnailRef.current.splide);
    }
  }, []);

  React.useEffect(() => {
    if (selectedPhoto) {
      const index = photos.indexOf(selectedPhoto);
      if (index !== -1 && mainRef.current?.splide) {
        mainRef.current.go(index);
      }
    }
  }, [selectedPhoto, photos]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      {!isMobile ? (
        <div className=" w-24 xl:w-36 h-full">
          <Splide
            ref={thumbnailRef}
            options={{
              direction: "ttb",
              height: "100%",
              rewind: true,
              arrows: false,
              pagination: false,
              isNavigation: true,
              gap: "1rem",
              focus: "center",
              perPage: 5,
              drag: false,
            }}
            className="h-full"
          >
            {photos.map((photo, idx) => (
              <SplideSlide key={photo} className="cursor-pointer">
                <img
                  src={photo}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain rounded-md border border-gray-200 hover:border-blue-500 transition-colors duration-200"
                />
              </SplideSlide>
            ))}
          </Splide>
        </div>
      ) : null}
      <div className="flex-1">
        <Splide
          ref={mainRef}
          options={{
            type: "loop",
            rewind: true,
            perPage: 1,
            pagination: isMobile,
            arrows: false,
            height: isMobile ? "auto" : "100%",
            start: initialSlide,
          }}
          aria-label="Product Photos"
          className="h-full"
        >
          {photos.map((photo, idx) => (
            <SplideSlide key={photo}>
              <div className="aspect-square w-full">
                <img
                  src={photo}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}

type Props = {
  selectedPhoto?: string;
  isMobile: boolean;
  photos: string[];
};
