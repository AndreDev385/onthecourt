import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function FullWidthHero() {
  return (
    <div className="relative bg-gray-900">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover"
          src="https://images.pexels.com/photos/5730299/pexels-photo-5730299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Tennis court at sunset"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-75" />
      </div>
      <div className="relative mx-auto max-w-7xl py-32 px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Tu Juego, Nuestra Pasión
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-gray-300">
          On The Court te ofrece ropa elegante y artículos deportivos de primera
          calidad, tenemos todo lo que necesitas para mejorar tu juego y dominar
          la cancha.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Button variant="client" size="default" className="font-bold">
            <Link
              to="/store/products"
            >
              Ver colección
            </Link>
          </Button>
          <Button variant="ghost" className="text-white font-semibold">
            <Link
              to="/store/cateogories"
            >
              Categorías <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
