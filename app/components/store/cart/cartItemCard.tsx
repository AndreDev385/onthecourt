import { CartItem } from "~/lib/api/cart/getCartInfo";

export function CartItemCard({ item }: Props) {
  // TODO: finish this component
  return (
    <div className="grid grid-cols-2 lg:grid-cols-[1fr, auto, 1fr]">
      {/* Image */}
      <div>
        <img src={item.photo} alt={item.product.title} />
      </div>
      {/* Info */}
      <div>
        <h3>{item.product.title}</h3>
      </div>
      {/* Total and actions */}
      <div>
        <p>Subtotal</p>
      </div>
    </div>
  );
}

type Props = {
  item: CartItem;
};
