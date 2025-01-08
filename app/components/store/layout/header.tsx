import { useState } from "react";
import { Link } from "@remix-run/react";
import { Navigation } from "./navigation";
import { CartIcon } from "./cartIcon";
import { MobileMenu } from "./mobileMenu";
import { Menu } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto py-4 flex items-center h-16 justify-between">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mx-4">
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
                className="w-full max-w-40"
                alt="On the Court"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <Navigation />
        </nav>

        {/* Cart Icon */}
        <div className="mx-4">
          <CartIcon />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
