import { DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface ValueFormProps {
  variant1: string;
  variant2?: string;
  variant3?: string;
  photo?: string;
  photos: Array<string>;
  titles?: Array<string>;
  errors?: { variant1?: string };
}

export function ValueForm({
  variant1 = "",
  variant2 = "",
  variant3 = "",
  photo = "",
  titles = [],
  photos,
  errors,
}: ValueFormProps) {

  const [selectedPhoto, setSelectedPhoto] = React.useState<string>(photo);

  return (
    <div className="w-full p-4 rounded border border-gray-200 mb-6 px-4">
      <h3 className="text-lg mb-4">Opciones</h3>
      <div className="w-full flex flex-row flex-wrap -mx-4">
        <div className="px-4 flex flex-col flex-wrap flex-1">
          <div className="mb-4">
            <Label htmlFor="variant1">{titles[0] || "Variant 1"}</Label>
            <Input
              defaultValue={variant1}
              type="text"
              name="variant1"
              required
            />
            {errors?.variant1 ? (
              <p className="text-sm text-red-500">{errors.variant1}</p>
            ) : null}
          </div>

          <div className="mb-4">
            <Label htmlFor="variant2">{titles[1] || "Variant 2"}</Label>
            <Input
              defaultValue={variant2}
              type="text"
              name="variant2"
              disabled={!variant2}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="variant3">{titles[2] || "Variante 3"}</Label>
            <Input
              defaultValue={variant3}
              type="text"
              name="variant3"
              disabled={!variant3}
            />
          </div>
        </div>
        <div className="px-4 flex flex-col flex-wrap justify-around">
          <div className=" w-40 h-40 rounded border-gray-500 border-2 border-dashed mb-4" >
            <input value={selectedPhoto} type="hidden" name="photo" />
            {selectedPhoto ? (
              <img src={selectedPhoto} alt="variant" />
            ) : null}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" type="button">
                Escoger una existente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Seleccionar imagen
                </DialogTitle>
                <DialogDescription className="text-lg">
                  <div className="grid grid-cols-4 gap-4">
                    {photos.map((p) => (
                      <button
                        key={p}
                        className={`border ${p === selectedPhoto ? "border-blue-500" : ""}`}
                        onMouseDown={() => setSelectedPhoto(p)}
                      >
                        <img src={p} alt="product" />
                      </button>
                    ))}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>
                    Aceptar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
