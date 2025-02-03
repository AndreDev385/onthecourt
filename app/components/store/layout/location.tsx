import { Form, useLocation } from "@remix-run/react";
import { MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function LocationIcon({ locations, selectedLocation }: Props) {

  const location = useLocation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MapPin
          className="cursor-pointer text-white hover:text-gray-300 relative inline-flex items-center"
          size={20}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sucursales</DialogTitle>
        </DialogHeader>
        <Form method="POST">
          <input type="hidden" name="path" value={location.pathname} />
          <div className="flex flex-col gap-4">
            <Select name="location" defaultValue={selectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                {locations?.map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancelar
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button name="intent" value="change-location" type="submit">
                  Seleccionar
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type Props = {
  selectedLocation?: string;
  locations?: {
    _id: string;
    name: string;
    address: string;
    active: boolean;
  }[];
};
