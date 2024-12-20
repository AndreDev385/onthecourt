import { Link, Outlet } from "@remix-run/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full p-4 bg-gray-100">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

const links = [
  { href: "/admin/users", text: "Usuarios" },
  { href: "/admin/clients", text: "Clientes" },
];

function AdminSidebar() {
  return (
    <Sidebar className="p-4">
      <SidebarHeader className="text-2xl bold mb-4">Admin</SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col gap-2">
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link
                className="group relative my-px flex min-h-[2.25rem] items-center rounded-2xl border-transparent px-3 py-2 outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800 dark:focus-visible:ring-gray-100 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                to={link.href}
              >
                {link.text}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
