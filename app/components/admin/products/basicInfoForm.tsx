import React from "react";
import { v4 as uuid } from "uuid";
import { Editor } from "@tinymce/tinymce-react";
import { validateNumber, validateString } from "~/lib/utils";
import MultipleSelect from "~/components/ui/multi-select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

export type BasicInfo = {
  title: string;
  description: string;
  dataSheet: string;
  priority: number;
  isService: boolean;
  volatileInventory: boolean;
  active?: boolean;
  brand?: string;
  price: number;
  quantity?: number;
  compareAtPrice: number;
  sku?: string;
  categories: Array<{ _id: string; name: string }>;
  extraInfo: Array<{
    id: string;
    name: string;
    value: string;
  }>;
};

interface BasicInfoFormProps {
  TINY_KEY: string;
  title?: string;
  description?: string;
  dataSheet?: string;
  priority?: number;
  isService?: boolean;
  volatileInventory?: boolean;
  brand?: string;
  price?: number;
  quantity?: number;
  compareAtPrice?: number;
  sku?: string;
  extraInfo?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  updateBasicInfo: React.Dispatch<React.SetStateAction<BasicInfo>>;
  brands?: Array<{ _id: string; name: string }>;
  categories?: Array<{ _id: string; name: string }>;
  allCategories: Array<{ _id: string; name: string }>;
  isUpdate?: boolean;
}

function BasicInfoForm(props: BasicInfoFormProps) {
  const [title, setTitle] = React.useState(props.title ?? "");
  const [priority, setPriority] = React.useState(
    String(props.priority) === "NaN" ? "none" : String(props.priority)
  );
  const [isService, setService] = React.useState(
    props.isService ? "yes" : "no"
  );
  const [volatileInventory, setVolatileInventory] = React.useState(
    props.volatileInventory ? "yes" : "no"
  );
  const [brand, setBrand] = React.useState(props.brand ?? "none");
  const [description, setDescription] = React.useState(props.description ?? "");
  const [dataSheet, setDataSheet] = React.useState(props.dataSheet ?? "");
  const [extraInfo, setExtraInfo] = React.useState<
    Array<{
      id: string;
      name: string;
      value: string;
    }>
  >(props.extraInfo ?? []);
  const [name, setName] = React.useState("");
  const [value, setValue] = React.useState("");
  const [price, setPrice] = React.useState(props.price ?? 0);
  const [quantity, setQuantity] = React.useState(props.quantity ?? 0);
  const [compareAtPrice, setCompareAtPrice] = React.useState(
    props.compareAtPrice || 0
  );
  const [sku, setSku] = React.useState(props.sku ?? "");
  const [categories, setCategories] = React.useState<
    Array<{ _id: string; name: string }>
  >(props.categories ?? []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateCategories = React.useCallback((values: string[]) => {
    setCategories(props.allCategories.filter((c) => values.includes(c._id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    props.updateBasicInfo!({
      title,
      priority: Number(priority),
      isService: isService === "yes",
      volatileInventory: volatileInventory === "yes",
      brand,
      description,
      dataSheet,
      extraInfo,
      price: Number(price),
      quantity: Number(quantity),
      compareAtPrice: Number(compareAtPrice),
      sku,
      categories,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    priority,
    isService,
    volatileInventory,
    brand,
    description,
    dataSheet,
    extraInfo,
    price,
    quantity,
    compareAtPrice,
    sku,
    categories,
  ]);

  const addToExtraInfo = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (validateString(name) && validateString(value)) {
      const _extra = [...extraInfo].filter((extra) => extra.name !== name);
      _extra.push({ name, value, id: uuid() });
      setName("");
      setValue("");
      setExtraInfo([..._extra]);
    }
  };
  const deleteBasicInfo = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    const _extra = [...extraInfo].filter((extra) => extra.id !== id);
    setExtraInfo(_extra);
  };
  return (
    <>
      <div className="flex flex-row flex-wrap lg:-mx-4 w-full">
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Kevin Durant 13"
            value={title}
            onChange={(e) => {
              e.preventDefault();
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="priority">Prioridad</Label>
          <Select
            name="priority"
            value={priority}
            onValueChange={(value) => setPriority(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Mínima</SelectItem>
              <SelectItem value="2">Regular</SelectItem>
              <SelectItem value="3">Máxima</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {!props.isUpdate ? (
        <div className="flex flex-row flex-wrap lg:-mx-4 w-full">
          <div className="w-full lg:w-1/2 px-4 mb-4">
            <Label>Precio</Label>
            <Input
              required={isService === "yes"}
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => {
                e.preventDefault();
                if (
                  validateNumber(Number(e.target.value)) &&
                  Number(e.target.value) >= 0
                ) {
                  setPrice(Number(e.target.value));
                }
              }}
            />
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-4">
            <Label>Precio Comparativo</Label>
            <Input
              required={isService === "yes"}
              name="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => {
                e.preventDefault();
                if (
                  validateNumber(Number(e.target.value)) &&
                  Number(e.target.value) >= 0
                ) {
                  setCompareAtPrice(Number(e.target.value));
                }
              }}
            />
          </div>
        </div>
      ) : null}
      {!props.isUpdate && (
        <div className="flex flex-row flex-wrap lg:-mx-4 w-full">
          <div className="w-full lg:w-1/2 px-4 mb-4">
            <Label>Inventario</Label>
            <Input
              required
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => {
                e.preventDefault();
                if (
                  validateNumber(Number(e.target.value)) &&
                  Number(e.target.value) >= 0
                ) {
                  setQuantity(Number(e.target.value));
                }
              }}
            />
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-4">
            <Label>Sku</Label>
            <Input
              required
              placeholder="Sku"
              name="sku"
              type="text"
              value={sku}
              onChange={(e) => {
                e.preventDefault();
                if (
                  validateString(e.target.value) &&
                  String(e.target.value).length <= 127
                ) {
                  setSku(e.target.value);
                }
              }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-row flex-wrap lg:-mx-4 w-full">
        <div className="w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="isService">¿Es un servicio?</Label>
          <Select
            name="isService"
            value={isService}
            onValueChange={(value) => setService(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="¿Es un servicio?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Si</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="categories">Categorías</Label>
          <MultipleSelect
            name="categories"
            placeholder="Seleccione al menos 1 categoría"
            onChange={updateCategories}
            selected={categories.map((c) => c._id)}
            values={props.allCategories.map((c) => ({
              value: c._id,
              text: c.name,
            }))}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4 w-full">
        <div className="w-full lg:w-1/2 px-4 mb-4">
          <Label htmlFor="volatileInventory">¿El inventario es volátil?</Label>
          <Select
            name="volatileInventory"
            value={volatileInventory}
            onValueChange={(value) => setVolatileInventory(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione el tipo de inventario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Si</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isService === "no" && (
          <div className="w-full lg:w-1/2 px-4 mb-4">
            <Label htmlFor="brand">Marca</Label>
            <Select
              name="brand"
              value={brand}
              onValueChange={(value) => setBrand(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione una marca" />
              </SelectTrigger>
              <SelectContent>
                {props.brands
                  ? props.brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="w-full px-4 mb-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <Label htmlFor="description">Descripción</Label>
          <Editor
            id="description"
            apiKey={props.TINY_KEY}
            value={description}
            onEditorChange={(content) => setDescription(String(content))}
            init={{
              name: "description",
              height: 300,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "print",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "paste",
                "code",
                "help",
                "wordcount",
              ],
              toolbar: `undo redo | formatselect | bold italic forecolor backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help`,
            }}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap lg:-mx-4">
        <div className="w-full px-4 mb-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <Label htmlFor="dataSheet">Ficha técnica</Label>
          <Editor
            id="dataSheet"
            apiKey={props.TINY_KEY}
            onEditorChange={(content) => setDataSheet(String(content))}
            value={dataSheet}
            init={{
              name: "dataSheet",
              height: 300,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar: `undo redo | formatselect | bold italic forecolor backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help`,
            }}
          />
        </div>
      </div>
      {isService === "no" && (
        <div className="flex flex-row flex-wrap lg:-mx-4 w-full">
          <div className="w-full my-4 px-4">
            <h3 className="text-xl text-gray-700">Información Extra</h3>
          </div>
          <div className="flex flex-row flex-wrap lg:-mx-4 px-8 w-full items-center gap-4">
            <div className="flex flex-row flex-wrap flex-1 lg:-mx-2 w-full">
              <div className="w-full lg:w-1/2 px-2 mb-4">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  required={extraInfo.length <= 0}
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    e.preventDefault();
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="w-full lg:w-1/2 px-2 mb-4">
                <Label htmlFor="value">Valor</Label>
                <Input
                  required={extraInfo.length <= 0}
                  name="value"
                  type="text"
                  value={value}
                  onChange={(e) => {
                    e.preventDefault();
                    setValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <Button type="button" onClick={(e) => addToExtraInfo(e)}>
              Agregar
            </Button>
          </div>
        </div>
      )}
      {extraInfo.length > 0 ? (
        <>
          <Table>
            <TableCaption>Información Extra</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extraInfo.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>
                    <X onClick={(e) => deleteBasicInfo(e, row.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}
    </>
  );
}

export default BasicInfoForm;
