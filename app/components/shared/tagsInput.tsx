import React from "react";
import { v4 as uuid } from "uuid";
import { validateString } from "~/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface TagsInputProps {
  updateTags?: React.Dispatch<
    React.SetStateAction<
      {
        text: string;
        id: string;
      }[]
    >
  >;
  tags?: Array<{ text: string; id: string }>;
}

function TagsInput({ tags = [], updateTags }: TagsInputProps) {
  const [_tags, setTags] = React.useState(tags);
  const [text, setText] = React.useState("");
  React.useEffect(
    function updateTagsHook() {
      updateTags!(_tags);
    },
    [_tags, updateTags]
  );
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { key } = e;
    if (validateString(text) && String(text).length < 127 && key === "Enter") {
      setTags((__tags) => {
        if (__tags.length === 0) {
          return [{ text, id: uuid() }];
        }
        const filtered = __tags.filter((tag) => tag.text !== text);
        if (filtered.length > 0) {
          return [...filtered, { text, id: uuid() }];
        }
        return __tags;
      });
      setText("");
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };
  const deleteTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { id } = e.currentTarget.dataset;
    setTags(_tags.slice().filter((tag) => tag.id !== id));
  };
  return (
    <div className="bg-white text-base leading-6 focus:shadow-outline m-auto mb-4 w-full">
      <label htmlFor="text" className="flex-1 bg-transparent w-full mb-4">
        <span className="sr-only">Valor de la Variante</span>
        <Input
          type="text"
          name="text"
          id="text"
          placeholder="Presione ENTER para agregar"
          onKeyUp={onKeyUp}
          onChange={onChange}
          value={text}
        />
      </label>
      <ul className="mr-2 mt-2 p-0 flex flex-row flex-wrap gap-2">
        {_tags.map((tag) => (
          <Button
            key={tag.id}
            type="button"
            size="sm"
            className="rounded-full"
            data-id={tag.id}
            onClick={deleteTag}
          >
            <span className="pl-2">{tag.text}</span>
            <X size={8} />
          </Button>
        ))}
      </ul>
    </div>
  );
}

export default TagsInput;
