import { Trash } from "lucide-react";
import React, { lazy, Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Props = {
  idx: number;
  item: {
    title: string;
    description: string;
    url: string;
  };
  removeSlide: (idx: number) => void;
};
export function PromotionsSlideForm({ idx, item, removeSlide }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ImageForm = React.useCallback(
    lazy(async () => {
      const module = await import("~/components/admin/cms/imageForm");
      return { default: module.default };
    }),
    []
  );

  const [canEdit, setCanEdit] = React.useState(false);
  return (
    <>
      <Card className="my-4">
        <CardHeader>
          <h3 className="text-xl">Slide N.º {idx + 1}</h3>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Título</Label>
            <Input name="title" defaultValue={item.title} />
          </div>
          <div className="mb-4">
            <Label>Descripción</Label>
            <Input name="description" defaultValue={item.description} />
          </div>
          <div className="mb-4">
            <Suspense>
              <ImageForm url={item.url} canEdit={canEdit} />
            </Suspense>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2 items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Eliminar slide
                    </DialogTitle>
                    <DialogDescription className="text-lg">
                      Estas seguro que deseas eliminar este slide? Quedará
                      eliminado permanentemente al guardar el estado actual del
                      carousel.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onMouseDown={() => removeSlide(idx)}
                        variant="destructive"
                      >
                        Eliminar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant={canEdit ? "destructive" : "default"}
                onMouseDown={() => setCanEdit(!canEdit)}
              >
                {canEdit ? "Cancelar" : "Editar imagen"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
