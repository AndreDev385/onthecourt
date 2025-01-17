import { Link } from "@remix-run/react";

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
      <div className="relative mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Tu Juego, Nuestra Pasión
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-gray-300">
          On The Court te ofrece ropa elegante y artículos deportivos de primera
          calidad, tenemos todo lo que necesitas para mejorar tu juego y dominar
          la cancha.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            to="/store/products"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Ver colección
          </Link>
          <Link
            to="/store/cateogories"
            className="text-sm font-semibold leading-6 text-white"
          >
            Categorías <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
