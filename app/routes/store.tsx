import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Outlet,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { destroySession, getSession } from "~/clientSessions";
import { Footer } from "~/components/store/layout/footer";
import { Header } from "~/components/store/layout/header";
import { locationCookie } from "~/cookies.server";
import { useToast } from "~/hooks/use-toast";
import { logOut } from "~/lib/api/auth/logOut";
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
  if (!session.has("token")) {
    return { user: null, locations, selectedLocation };
  }

  const { data } = await getCurrentUser(session.data.token!);
  invariant(data, "Usuario no encontrado");
  return { user: data, locations, selectedLocation };
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
  if (!location) return null;

  return redirect("/store", {
    headers: {
      "Set-Cookie": await locationCookie.serialize(String(location)),
    },
  });
}
