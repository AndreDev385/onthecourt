import { Link } from "@remix-run/react";
import { Button } from "../ui/button";
import { Icon } from "./icon";

type Props = {
  href?: string;
  text: string;
};

export function AddItemToTable({ href, text }: Props) {
  return (
    <div className="flex flex-row flex-wrap -mx-4 mb-4">
      <div className="px-4 w-1/2">
        <h2 className="text-gray-600 text-2xl font-semibold">{text}</h2>
      </div>
      <div className="px-4 w-1/2 flex">
        <div className="ml-auto">
          {href ? (
            <Button asChild variant="ghost" className="font-bold text-sm">
              <Link to={href}>
                <Icon icon="plus" />
                CREAR
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
