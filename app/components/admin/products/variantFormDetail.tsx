import React from "react";
import { validateString } from "~/lib/utils";
import { Variant } from "~/types";
import { Input } from "~/components/ui/input";
import TagsInput from "~/components/shared/tagsInput";

interface VariantFormDetailProps {
  setVariants?: React.Dispatch<React.SetStateAction<Variant[]>>;
  variants?: Array<Variant>;
  idx: number;
  id?: string;
  remove?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function VariantFormDetail({
  setVariants,
  variants,
  idx,
  id,
  remove,
}: VariantFormDetailProps) {
  const [title, setTitle] = React.useState<string>("");
  const [tags, setTags] = React.useState<Array<{ text: string; id: string }>>(
    []
  );

  React.useEffect(() => {
    const _variants = variants!.slice();
    _variants[idx].title = title;
    _variants[idx].tags = tags.map((tag) => tag.text);
    setVariants!(_variants);
  }, [title, tags, idx, setVariants]);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (
        validateString(e.target.value) &&
        String(e.target.value).length <= 127
      ) {
        setTitle(e.target.value);
      }
    },
    []
  );
  return (
    <>
      <div className="lg:-mx-4 w-full flex flex-wrap flex-row justify-between mb-2">
        <h3 className="text-gray-700 text-lg px-4">Variante {idx! + 1}</h3>
        {idx !== 0 && (
          <button
            type="button"
            className="p-0 m-0 bg-transparent text-sm text-indigo-700 px-4 focus:outline-none outline-none"
            data-id={id}
            onClick={remove}
          >
            Eliminar Variante
          </button>
        )}
      </div>
      <div className="lg:-mx-4 w-full flex flex-wrap flex-row">
        <div className="w-full lg:w-1/3 px-4">
          <Input
            name={`variant[${idx}]`}
            type="text"
            placeholder="Titulo de la Variante"
            value={title}
            onChange={onChange}
          />
        </div>
        <div className="w-full lg:w-2/3 px-4 flex">
          <TagsInput tags={tags} updateTags={setTags} />
        </div>
      </div>
    </>
  );
}

export default VariantFormDetail;
