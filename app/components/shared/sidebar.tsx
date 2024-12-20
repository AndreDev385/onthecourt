import { Link } from "@remix-run/react";

const links = [{ href: "/", text: "Home" }];

export function Sidebar() {
  return (
    <div className="sticky bottom-0 top-16 -ml-3 hidden w-[--nav-width] flex-col gap-3 self-start overflow-auto pb-10 pr-5 pt-5 lg:flex h-[calc(100vh-var(--header-height))]">
      <div className="[&_*:focus]:scroll-mt-[6rem]">
        <nav>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className="group relative my-px flex min-h-[2.25rem] items-center rounded-2xl border-transparent px-3 py-2 text-sm outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800 dark:focus-visible:ring-gray-100 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                  to={link.href}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
