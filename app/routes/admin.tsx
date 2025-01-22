import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, redirect } from "@remix-run/react";
import {
  ChevronDown,
  Users,
  Users2,
  Settings,
  CalendarArrowDown,
  Tag,
  LogOut,
  Wallet,
  TableOfContents,
} from "lucide-react";
import { destroyAdminSession, getAdminSession } from "~/adminSessions";
import ErrorDisplay from "~/components/shared/error";
import { Button } from "~/components/ui/button";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getAdminSession(request.headers.get("Cookie"));

  console.log("Has token", session.has("token"), session.data);
  if (!session.has("token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/admin-access");
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "logout") {
    const session = await getAdminSession(request.headers.get("Cookie"));
    return redirect("/admin-access", {
      headers: {
        "Set-Cookie": await destroyAdminSession(session),
      },
    });
  }
  return null;
}

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
  { href: "/admin/users/list", text: "Usuarios", icon: Users },
  { href: "/admin/clients/list", text: "Clientes", icon: Users2 },
  { href: "/admin/orders/list", text: "Ordenes", icon: CalendarArrowDown },
  { href: "/admin/sales", text: "Ventas", icon: Wallet },
];

const configLinks = [
  { href: "/admin/categories/list", text: "Categorías" },
  { href: "/admin/brands/list", text: "Marcas" },
  { href: "/admin/currencies/list", text: "Monedas" },
  { href: "/admin/locations/list", text: "Sucursales" },
  { href: "/admin/suppliers/list", text: "Proveedores" },
  { href: "/admin/promo-codes/list", text: "Promociones" },
  { href: "/admin/shippings/list", text: "Opciones de envío" },
];

const adminLinks = [
  { href: "/admin/carousel", text: "Carousel" },
  { href: "/admin/promotions", text: "Promociones" },
  { href: "/admin/banner", text: "Banner" },
  { href: "/admin/categories-links", text: "Categorías" },
];

function AdminSidebar() {
  return (
    <Sidebar className="p-4">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {outerLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild>
                  <Link to={link.href} prefetch="intent">
                    <link.icon />
                    <p className="text-lg">{link.text}</p>
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
                <Settings className="mr-2" />
                <p className="text-lg font-bold">Configuración</p>
                <ChevronDown className="ml-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-2">
                  {configLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild>
                        <Link to={link.href} prefetch="intent">
                          <p className="text-lg">{link.text}</p>
                        </Link>
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
                <TableOfContents className="mr-2" />
                <p className="text-lg font-bold">CMS</p>
                <ChevronDown className="ml-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-2">
                  {adminLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild>
                        <Link to={link.href} prefetch="intent">
                          <p className="text-lg">{link.text}</p>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Form method="POST" className="flex justify-start">
                <Button
                  name="intent"
                  value="logout"
                  className="w-full text-lg p-0 font-normal flex justify-start px-2"
                  type="submit"
                  variant="ghost"
                >
                  <LogOut /> Cerrar sesión
                </Button>
              </Form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
