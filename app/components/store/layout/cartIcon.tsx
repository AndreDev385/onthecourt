import { Link } from "@remix-run/react";
import { ShoppingCartIcon } from "lucide-react";

export function CartIcon() {
  return (
    <Link to="/store/cart" className="text-white hover:text-gray-300">
      <ShoppingCartIcon size={24} />
    </Link>
  );
}
