import React from "react";
import { v4 as uuid } from "uuid";
import { useDrag, useDrop } from "react-dnd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { useToast } from "~/hooks/use-toast";
import { initializeApp } from "firebase/app";

const TYPE = "Image";

interface ImageProps {
  src?: string;
  id?: string;
  index?: number;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  moveImage?: (dragIndex: number, hoverIndex: number) => void;
  updateURLs?: React.Dispatch<React.SetStateAction<string[]>>;
  updateSrc?: (id: string, src: string) => void;
}

export default function Image({
  src,
  id,
  onDelete,
  index,
  moveImage,
  updateURLs,
  updateSrc,
}: ImageProps) {
  const { toast } = useToast();
  const divRef = React.useRef<HTMLDivElement | null>(null);
  const [uploading, setUploading] = React.useState(false);
  React.useEffect(
    function uploadImagesHook() {
      if (src && !(src as string).startsWith("http")) {
        const upload = async () => {
          try {
            setUploading(true);
            const storage = getStorage(initializeApp(window.ENV.firebase));
            const storageRef = ref(storage, `products/${uuid()}`);
            const url = await uploadString(storageRef, src, "data_url").then(
              (snapshot) => {
                console.log("snapshot", snapshot);
                return getDownloadURL(snapshot.ref);
              }
            );

            updateURLs!((urls) => [...urls, url]);
            updateSrc!(id as string, url);
          } catch (err) {
            if (err instanceof Error) {
              console.log(err);
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
    },
    [id, toast, src, updateSrc, updateURLs]
  );
  const [, drop] = useDrop({
    accept: TYPE,
    hover(item: { index?: number }) {
      if (!divRef.current) {
        return;
      }
      const dragIndex = item.index ?? 0;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveImage!(dragIndex, hoverIndex as number);
      item.index = hoverIndex ?? 0;
    },
  });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TYPE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drag(drop(divRef));
  return (
    <div
      className={`block relative mr-2 mb-2 ${
        isDragging || uploading
          ? "opacity-25 border border-indigo-700 border-dashed"
          : "opacity-100"
      }`}
      ref={divRef}
    >
      <img
        className="w-24 h-24 object-cover object-center rounded"
        src={src as string}
        alt={id}
      />
      {index === 0 && (
        <p className="text-xs text-gray-700 text-center font-semibold mt-1">
          Principal
        </p>
      )}
      <button
        type="button"
        className="p-1 rounded-full bg-white absolute top-0 right-0 text-red-700 focus:outline-none outline-none focus:shadow-outline-indigo"
        onClick={onDelete}
        data-id={id}
        data-index={index}
      >
        <svg fill="currentColor" className="w-3 h-3" viewBox="0 0 20 20">
          <path
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
