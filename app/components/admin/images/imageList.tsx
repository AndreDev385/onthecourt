import React from "react";
import Image from "./imageItem";

interface ImageListProps {
  images?: Array<{ src: string | ArrayBuffer; id: string }>;
  updateImages?: React.Dispatch<
    React.SetStateAction<{ src: string | ArrayBuffer; id: string }[]>
  >;
  updateURLs?: React.Dispatch<React.SetStateAction<string[]>>;
  moveImage?: (dragIndex: number, hoverIndex: number) => void;
}

export default function ImageList({
  images = [],
  updateImages,
  updateURLs,
  moveImage,
}: ImageListProps) {
  const updateSrc = React.useCallback(
    (id: string, src: string) => {
      updateImages!((_images) => {
        const copyOfImages = _images.slice();
        const idx = copyOfImages.findIndex((img) => img.id === id);
        copyOfImages[idx] = { id, src };
        console.log(copyOfImages, "images");
        return copyOfImages;
      });
    },
    [updateImages]
  );

  const onDelete = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const { id, index } = e.currentTarget.dataset;
      updateImages!((__images) =>
        __images.slice().filter((img) => img.id !== id)
      );
      updateURLs!((urls) =>
        urls.slice().filter((url) => url !== urls[Number(index)])
      );
    },
    [updateImages, updateURLs]
  );

  return (
    <section className="file-list flex flex-row flex-wrap">
      {images.map((image, idx) => (
        <Image
          src={image.src as string}
          index={idx}
          key={image.id}
          id={image.id}
          onDelete={onDelete}
          moveImage={moveImage}
          updateSrc={updateSrc}
          updateURLs={updateURLs}
        />
      ))}
    </section>
  );
}
