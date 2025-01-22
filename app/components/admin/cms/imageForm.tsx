import React, { lazy, Suspense } from "react";
import { v4 as uuid } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
//import DropZone from "./dropzone";
import ImageUploader, { ImageModel } from "./imageUploader";
import { useToast } from "~/hooks/use-toast";

type Props = {
  url?: string;
  canEdit: boolean;
};

const ImageForm = ({ url, canEdit }: Props) => {
  const [tempImage, setTempImage] = React.useState<ImageModel | null>(
    url ? { id: uuid(), src: url } : null
  );
  const { toast } = useToast();

  const getBackend = () => {
    if ("ontouchstart" in window) {
      return TouchBackend;
    }
    return HTML5Backend;
  };

  const onDrop = React.useCallback(
    function _onDrop(acceptedFiles: File[]): void {
      if (canEdit) {
        const MB10 = 10000000; // 10.000.000
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file) => {
          if (file.size >= MB10) {
            toast({
              title: "Tu archivo debe pesar menos de 10MB",
              variant: "destructive",
            });
            return;
          }
          const reader = new FileReader();
          reader.onload = function onLoadFile(e) {
            setTempImage({ id: uuid(), src: e.target!.result! });
          };
          reader.readAsDataURL(file);
          return file;
        });
      }
    },
    [canEdit, toast]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DropZone = React.useCallback(
    lazy(async () => {
      const module = await import("./dropzone");
      return { default: module.default };
    }),
    []
  );

  return (
    <DndProvider backend={getBackend()}>
      <section className="w-full flex flex-col flex-wrap mb-4">
        <h3 className={`text-lg text-gray-700 ${!canEdit ? "" : "mb-2"}`}>
          Imagen
        </h3>
        <Suspense>
          <DropZone onDrop={onDrop} canEdit={canEdit} />
        </Suspense>
        {tempImage ? (
          <>
            <ImageUploader
              canEdit={canEdit}
              image={tempImage}
              updateImage={setTempImage}
              src={tempImage.src}
            />
          </>
        ) : null}
        <input
          type="hidden"
          value={(tempImage?.src as string) ?? ""}
          name="url"
        />
      </section>
    </DndProvider>
  );
};

export default ImageForm;
