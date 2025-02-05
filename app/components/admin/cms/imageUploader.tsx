import { v4 as uuid } from "uuid";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import React from "react";
import { useToast } from "~/hooks/use-toast";

export interface ImageModel {
  id: string;
  src: string | ArrayBuffer;
}

type Props = {
  image: ImageModel;
  updateImage: React.Dispatch<React.SetStateAction<ImageModel | null>>;
  canEdit: boolean;
  src: string | ArrayBuffer;
};

const ImageUploader = ({ image, updateImage, canEdit, src }: Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);

  const onDelete = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (canEdit) {
        updateImage(null);
      }
    },
    [canEdit, updateImage]
  );

  React.useEffect(
    function uploadImagesHook() {
      const upload = async () => {
        if (image) {
          const src = image.src as string;
          if (src && !src.startsWith("http")) {
            const upload = async () => {
              try {
                setUploading(true);
                const storage = getStorage(initializeApp(window.ENV.firebase));
                const storageRef = ref(storage, `slide/${uuid()}`);
                const url = await uploadString(
                  storageRef,
                  src,
                  "data_url"
                ).then((snapshot) => {
                  return getDownloadURL(snapshot.ref);
                });

                updateImage({ id: image.id, src: url });
              } catch (err) {
                if (err instanceof Error) {
                  toast({
                    variant: "destructive",
                    title: "Error al subir imagen",
                    description:
                      err.message ||
                      "Ha ocurrido un error al subir la imagen, intente nuevamente",
                  });
                }
              } finally {
                setUploading(false);
              }
            };
            upload();
          }
        }
      };
      upload();
    },
    [image, src, toast, updateImage]
  );

  return (
    <>
      {image && (
        <div
          className={`w-32 relative mt-4 ${uploading
              ? "opacity-25 border border-indigo-700 border-dashed"
              : "opacity-100"
            }`}
        >
          <img className="w-full" src={image.src as string} alt="Slider" />
          {canEdit && (
            <button
              type="button"
              className="m-2 p-1 rounded-full bg-white absolute top-0 right-0 text-red-700 focus:outline-none outline-none focus:shadow-outline-indigo"
              onClick={onDelete}
            >
              <svg fill="currentColor" className="w-3 h-3" viewBox="0 0 20 20">
                <path
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ImageUploader;
