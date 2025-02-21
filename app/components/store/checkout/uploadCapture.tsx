import React from "react";
import { Loader2, Upload } from "lucide-react";
import { v4 as uuid } from "uuid";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

export function UploadCapture({ image, setImage }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [uploading, setUploading] = React.useState(false)

  function handleUplaoad(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) {
      toast({ title: "Error", description: "Debe seleccionar un archivo" })
      return
    }

    const reader = new FileReader()
    reader.onload = function onLoadFile(e) {
      setImage(e.target!.result as string)
    };
    reader.readAsDataURL(files[0]!);
    return files[0]!
  }

  React.useEffect(() => {
    if (image && !image.startsWith("http")) {
      const upload = async () => {
        try {
          setUploading(true);
          const storage = getStorage(initializeApp(window.ENV.firebase));
          const storageRef = ref(storage, `captures/${uuid()}`);
          const url = await uploadString(
            storageRef,
            image as string,
            "data_url"
          ).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          });

          setImage(url)
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
  }, [image, toast])

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <input type="hidden" name="image" value={image ?? ""} />
      <Input
        disabled={uploading}
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          // You can handle the file change event here
          handleUplaoad(e)
        }}
      />
      <Button
        onClick={handleClick}
        className="w-full"
        type="button"
      >
        {
          uploading
            ? <>
              <Loader2 className="animate-spin" />
              Cargando...
            </>
            : <><Upload className="mr-2 h-4 w-4" />
              {image ? "Cambiar captura" : "Cargar captura"}
            </>
        }
      </Button>
      <p className="text-sm text-muted-foreground text-center">
        {inputRef.current?.files?.[0]?.name || "Elegir un archivo"}
      </p>
    </div>
  )
}

type Props = {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}
