import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Outlet,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { destroySession, getSession } from "~/clientSessions";
import ErrorDisplay from "~/components/shared/error";
import { Footer } from "~/components/store/layout/footer";
import { Header } from "~/components/store/layout/header";
import { locationCookie } from "~/cookies.server";
import { useToast } from "~/hooks/use-toast";
import { logOut } from "~/lib/api/auth/logOut";
import { getFeaturedCategories } from "~/lib/api/cms/getCategories";
import { getLocations } from "~/lib/api/locations/getLocations";
import { getCurrentUser } from "~/lib/api/users/getCurrentUser";

export const meta: MetaFunction = () => {
  return [{ title: "On the court" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  // TODO: get user's shopping cart info
  const session = await getSession(cookieHeader);
  const selectedLocation = (await locationCookie.parse(cookieHeader)) || {};

  const { data: locations } = await getLocations();
  const { data: configCategories } = await getFeaturedCategories();

  if (!session.has("token")) {
    return { user: null, locations, selectedLocation, configCategories };
  }

  const { data } = await getCurrentUser(session.data.token!);
  invariant(data, "Usuario no encontrado");
  return { user: data, locations, selectedLocation, configCategories };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "logout") {
    return await handleLogOut(request);
  }

  if (intent === "change-location") {
    return await handleChangeLocation(formData);
  }

  return null;
}

export default function Store() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();

  const location = useLocation();
  const fetcher = useFetcher()

  React.useEffect(function defaultLocation() {
    console.log({
      first: Object.values(data.selectedLocation).length,
      second: data.locations?.length === 1
    })
    if (Object.values(data.selectedLocation).length === 0 && data.locations?.length === 1) {
      console.log("enter if")
      const formData = new FormData();
      formData.set("location", data.locations[0]._id);
      formData.set("path", location.pathname);
      formData.set("intent", "change-location");
      fetcher.submit(formData, { method: "post" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (actionData?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: actionData.error,
      });
    }
  }, [actionData, toast]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        user={data.user}
        locations={data.locations}
        selectedLocation={data.selectedLocation}
        configCategories={data.configCategories?.categories}
      />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

async function handleLogOut(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const { data, errors } = await logOut(session.data.token!);
  if ((errors && Object.values(errors).length > 0) || !data?.success)
    return {
      error: "Ha ocurrido un error. No ha sido posible cerrar sesión",
    };

  const cookie = await destroySession(session);
  return redirect("/store", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

async function handleChangeLocation(formData: FormData) {
  const location = formData.get("location");
  const path = formData.get("path");
  if (!location) return null;

  return redirect(String(path), {
    headers: {
      "Set-Cookie": await locationCookie.serialize(String(location)),
    },
  });
}

export function ErrorBoundary() {
  return <ErrorDisplay />
}
