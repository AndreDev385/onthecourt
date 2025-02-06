import { useState } from "react";
import { Form, Link, useNavigation } from "@remix-run/react";
import { CartIcon } from "./cartIcon";
import { Menu, X, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CurrentUser } from "~/lib/api/users/getCurrentUser";
import { LocationIcon } from "./location";

export function Header({
  user,
  locations,
  selectedLocation,
  configCategories,
}: {
  selectedLocation?: string;
  configCategories?: { name: string; slug: string, _id: string }[]
  user?: CurrentUser | null;
  locations?: {
    _id: string;
    name: string;
    address: string;
    active: boolean;
  }[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    {
      href: "/store",
      text: "Inicio",
    },
    {
      href: "/store/products",
      text: "Productos",
    },
    {
      href: "/store/brands",
      text: "Marcas",
    },
    {
      href: "/store/categories",
      text: "Categorías",
    },
  ];

  const isLoggedIn = !!user;

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto py-2 grid grid-cols-3 items-center justify-between">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden ml-4">
          <Menu
            className="text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Logo */}
        <div className="flex flex-shrink lg:flex-none">
          <div className="mx-auto lg:mx-0">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/logo.png"
                className="w-full max-w-60"
                alt="On the Court"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6 justify-center">
            {links.map((link) => (
              <li className="flex justify-center items-center" key={link.href}>
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg text-white hover:text-[#3ABF33]"
                  to={link.href}
                  prefetch="intent"
                >
                  {link.text}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li className="flex justify-center items-center">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg text-white hover:text-[#3ABF33]"
                  to="/store/orders/list"
                  prefetch="intent"
                >
                  Ordenes
                </Link>
              </li>
            ) : (
              <li className="flex justify-center items-center">
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg text-white hover:text-[#3ABF33]"
                  to="/store/sign-in"
                >
                  Ingresar
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Cart Icon */}
        <div className="mr-4 flex justify-end items-center gap-2">
          <LocationIcon selectedLocation={selectedLocation} locations={locations} />
          <CartIcon itemCount={user?.client.shopCart.items.length} />
          {isLoggedIn ? (
            <div className="hidden lg:block">
              <LogOutButton />
            </div>
          ) : null}
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="fixed inset-0 bg-black bg-opacity-50"
            onMouseDown={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed flex flex-col top-0 left-0 bottom-0 w-64 bg-white">
            <div className="bg-gray-900 flex justify-end p-4">
              <X size={26} onClick={() => setIsMobileMenuOpen(false)} />
            </div>
            <div>
              <ul className="flex gap-2 flex-col p-4">
                {links.map((link) => (
                  <li
                    className="w-full flex justify-start items-center"
                    key={link.href}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-black"
                    >
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        to={link.href}
                      >
                        {link.text}
                      </Link>
                    </Button>
                  </li>
                ))}
                {isLoggedIn ? (
                  <>
                    <li className="w-full flex justify-start items-center">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start text-black"
                      >
                        <Link
                          onClick={() => setIsMobileMenuOpen(false)}
                          to="/store/orders/list"
                        >
                          Ordenes
                        </Link>
                      </Button>
                    </li>
                    <li>
                      <LogOutButton light />
                    </li>
                  </>
                ) : (
                  <li className="w-full flex justify-start items-center">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-black"
                    >
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        to="/store/sign-in"
                      >
                        Ingresar
                      </Link>
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
      <div
        className="px-0 sm:px-14 text-xs xl:text-sm leading-normal text-gray-100 py-2"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      >
        <ul className="flex flex-row justify-around items-center border-0 overflow-x-auto">
          {configCategories?.map((category) => (
            <li key={category.name} className="px-4 py-1 lg:px-2">
              <Link
                to={`/store/products/1?category=${category._id}`}
                className={`block relative hover:text-[#3ABF33] outline-none focus:outline-none`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function LogOutButton({ light }: { light?: boolean }) {
  const navigation = useNavigation();
  const submitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "logout";

  return (
    <Form method="post">
      <Button
        className={`${light ? "text-black w-full justify-start" : "text-white"
          }`}
        name="intent"
        value="logout"
        variant="ghost"
        type="submit"
      >
        {submitting ? (
          <>
            Cerrando...
            <Loader2 className="animate-spin" />
          </>
        ) : (
          "Cerrar sesión"
        )}
      </Button>
    </Form>
  );
}
