import { Link } from "@remix-run/react";
import { Home, Package } from "lucide-react";

export function Navigation({ isMobile }: Props) {
  const links = [
    {
      href: "/store",
      text: "Inicio",
      icon: <Home />,
    },
    {
      href: "/store/products",
      text: "Productos",
      icon: <Package />,
    },
  ];

  return (
    <ul className={`p-4 flex gap-4 ${isMobile ? "flex-col" : ""}`}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            className={`gap-2 flex text-lg ${
              isMobile ? "text-gray-900" : "text-white"
            }`}
            to={link.href}
          >
            {isMobile ? link.icon : null}
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  isMobile?: boolean;
};
