import React, { useCallback } from "react";
import update from "immutability-helper";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { v4 as uuid } from "uuid";

import DropZone from "../../../.client/dropzonents/admin/images/dropzone";
import { useToast } from "~/hooks/use-toast";
import ImageList from "../../../.client/imageListts/admin/images/imageList";

interface ImageFormProps {
  photos?: Array<string>;
  updateURLs?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ImageForm({ updateURLs, photos }: ImageFormProps) {
  const { toast } = useToast();
  const [images, setImages] = React.useState<
    Array<{ id: string; src: string | ArrayBuffer }>
  >(photos?.map((photo) => ({ id: uuid(), src: photo })) ?? []);

  const getBackend = () => {
    if ("ontouchstart" in window) {
      return TouchBackend;
    }
    return HTML5Backend;
  };

  const onDrop = useCallback(
    function _onDrop(acceptedFiles: File[]): void {
      const MB10 = 10000000; // 10.000.000
      // eslint-disable-next-line array-callback-return
      acceptedFiles.map((file) => {
        if (file.size >= MB10) {
          toast({
            variant: "destructive",
            title: "Error al subir imagen",
            description: "El tamaño de la imagen es superior a 10MB",
          });
        } else {
          const reader = new FileReader();
          reader.onload = function onLoadFile(e) {
            setImages((prevState) => [
              ...prevState,
              { id: uuid(), src: e.target!.result! },
            ]);
          };
          reader.readAsDataURL(file);
          return file;
        }
      });
    },
    [toast]
  );

  const updateImages = React.useCallback(setImages, [setImages]);

  const moveImage = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedImage = images[dragIndex];
      setImages(
        update(images, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, draggedImage],
          ],
        })
      );
      updateURLs!((urls) =>
        update(urls, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, urls[dragIndex]],
          ],
        })
      );
    },
    [images, setImages, updateURLs]
  );

  return <h1>Image Form</h1>;

  return (
    <DndProvider backend={getBackend()}>
      <section className="w-full flex flex-col flex-wrap px-4">
        <h3 className="text-xl text-gray-700 mb-4">Imágenes</h3>
        <DropZone onDrop={onDrop} accept={{ "image/*": ["*"] }} />
        <h3 className="text-sm text-gray-700 my-2">
          Coloque la Imagen Principal de primera
        </h3>
        <ImageList
          images={images}
          updateImages={updateImages}
          moveImage={moveImage}
          updateURLs={updateURLs}
        />
      </section>
    </DndProvider>
  );
}
