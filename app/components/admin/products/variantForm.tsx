import React from "react";
import { v4 as uuid } from "uuid";
import { Variant } from "~/types";
import VariantFormDetail from "./variantFormDetail";
import { Button } from "~/components/ui/button";

interface VariantFormProps {
  updateVariants?: React.Dispatch<React.SetStateAction<Variant[]>>;
}

const VariantForm = ({ updateVariants }: VariantFormProps) => {
  const [variants, setVariants] = React.useState<Array<Variant>>([
    { title: "", tags: [], _id: uuid() },
  ]);

  React.useEffect(
    function updateVariantsHook() {
      updateVariants!(variants);
    },
    [variants, updateVariants]
  );

  const addVariant = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (variants.length < 3) {
      setVariants((_variants) => [
        ..._variants,
        { title: "", tags: [], _id: uuid() },
      ]);
    }
  };

  const remove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { id } = e.currentTarget.dataset;
    setVariants((_variants) =>
      _variants.filter((variant) => variant._id !== id)
    );
  };

  const changeVariants = React.useCallback(setVariants, [setVariants]);

  return (
    <div className="w-full flex flex-col flex-wrap px-4">
      <h3 className="mb-4 text-gray-700 text-xl">Variantes</h3>
      {variants.map((variant, i) => (
        <VariantFormDetail
          key={variant._id}
          variants={variants}
          idx={i}
          setVariants={changeVariants}
          id={variant._id}
          remove={remove}
        />
      ))}
      <div className="lg:-mx-4 w-full flex flex-wrap flex-row mt-2 mb-4">
        <div className="w-full px-4">
          {variants.length < 3 && (
            <Button type="button" onClick={addVariant}>
              Agregar Variante
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantForm;
