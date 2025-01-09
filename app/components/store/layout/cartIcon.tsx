import { Link } from "@remix-run/react";
import { ShoppingCartIcon } from "lucide-react";

export function CartIcon({ itemCount = 0 }: Props) {
  return (
    <Link
      to="/store/cart"
      className="text-white hover:text-gray-300 relative inline-flex items-center"
    >
      <ShoppingCartIcon className="text-center" size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

type Props = {
  itemCount?: number;
};
