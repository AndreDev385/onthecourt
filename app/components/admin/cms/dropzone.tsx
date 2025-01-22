import { ArrowUp } from "lucide-react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";

interface DropZoneProps {
  onDrop?: <T extends File>(
    acceptedFiles: T[],
    fileRejections?: FileRejection[],
    event?: DropEvent
  ) => void;
  canEdit: boolean;
}
const DropZone = ({ onDrop, canEdit }: DropZoneProps) => {
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

  if (!canEdit) return null;

  return (
    <div
      {...getRootProps()}
      className={`
      w-full border rounded h-28 flex cursor-pointer ${
        isDragActive
          ? "bg-gray-200 border-indigo-700 border-4 border-solid"
          : "bg-gray-100 border-indigo-700 border-4 border-dashed"
      }
      `}
      role="button"
    >
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center my-auto text-cool-gray-600 uppercase w-full">
        <ArrowUp className="w-12 h-12 text-center m-auto mb-2" />
        {isDragActive ? (
          <p className="text-center text-lg">Suelta tu imagen aquí</p>
        ) : (
          <p className="text-center text-lg">
            Arrastra la imagen hasta acá o dale click para buscarla
          </p>
        )}
      </div>
    </div>
  );
};

export default DropZone;
