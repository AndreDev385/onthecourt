import { Link, Outlet } from "@remix-run/react";
import {
  ChevronDown,
  Users,
  Users2,
  Settings,
  Home,
  HandCoins,
  CalendarArrowDown,
  Tag,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full p-4 bg-gray-100">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

const outerLinks = [
  { href: "/admin/products/list", text: "Productos", icon: Tag },
  { href: "/admin/orders/list", text: "Ordenes", icon: CalendarArrowDown },
  { href: "/admin/users/list", text: "Usuarios", icon: Users },
  { href: "/admin/clients/list", text: "Clientes", icon: Users2 },
];

const configLinks = [
  { href: "/admin/categories/list", text: "Categorías" },
  { href: "/admin/brands/list", text: "Marcas" },
  { href: "/admin/currencies/list", text: "Monedas" },
  { href: "/admin/locations/list", text: "Sucursales" },
  { href: "/admin/suppliers/list", text: "Proveedores" },
  { href: "/admin/promotions/list", text: "Promociones" },
  { href: "/admin/shipping/list", text: "Envíos" },
];

const adminLinks = [
  { href: "/admin/delivery-notes/list", text: "Notas de entrega" },
  { href: "/admin/invoices/list", text: "Facturas" },
];

function AdminSidebar() {
  return (
    <Sidebar className="p-4">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Home className="mr-2" />
            Principal
          </SidebarGroupLabel>
          <SidebarMenu>
            {outerLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild>
                  <Link to={link.href}>
                    <link.icon />
                    {link.text}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <HandCoins className="mr-2" /> Administración
                <ChevronDown className="ml-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-2">
                  {adminLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild>
                        <Link to={link.href}>{link.text}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <Settings className="mr-2" /> Configuración
                <ChevronDown className="ml-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-2">
                  {configLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild>
                        <Link to={link.href}>{link.text}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
