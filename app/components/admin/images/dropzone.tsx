import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
// https://blog.logrocket.com/drag-and-drop-in-react/

interface DropZoneProps {
  onDrop?: <T extends File>(
    acceptedFiles: T[],
    fileRejections?: FileRejection[],
    event?: DropEvent
  ) => void;
}

export default function DropZone({ onDrop }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/heic": [],
      "image/jfif": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
      w-full border rounded h-28 flex cursor-pointer ${
        isDragActive
          ? "bg-gray-200 border-primary-700 border-4 border-solid"
          : "bg-gray-100 border-primary-700 border-4 border-dashed"
      }
      `}
      role="button"
    >
      <input className="dropzone-input" name="photos" {...getInputProps()} />
      <div className="text-center my-auto text-cool-gray-600 uppercase w-full">
        <svg
          fill="currentColor"
          className="w-12 h-12 text-center m-auto mb-2"
          viewBox="0 0 20 20"
        >
          <path
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
        {isDragActive ? (
          <p className="text-center text-lg">Suelta las imágenes Aquí</p>
        ) : (
          <p className="text-center text-lg">
            Arrastra las imágenes hasta aca o dale click para buscarlas
          </p>
        )}
      </div>
    </div>
  );
}
