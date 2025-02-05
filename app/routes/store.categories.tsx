import { Link, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { getCategories } from "~/lib/api/categories/getCategories"

export async function loader() {
  const { data, errors } = await getCategories()
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar categorías")
  }
  invariant(data, "Error al cargar categorías")
  return { categories: data }
}

export default function Categories() {
  const { categories } = useLoaderData<typeof loader>()
  return (
    <div className="max-w-6xl mx-auto px-4 my-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categorías</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {
          categories.map((category) => (
            <Link key={category._id} to={`/store/products/1?category=${category._id}`}>
              <div className="bg-gray-200 rounded flex py-3 px-4 h-full items-center cursor-pointer">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  className="text-[#3ABF33] w-6 h-6 flex-shrink-0 mr-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <span className="flex-1 title-font font-medium">{category.name}</span>
                <svg
                  fill="currentColor"
                  className="cursor-pointer text-gray-400 w-6 h-6 ml-4"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                </svg>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}
