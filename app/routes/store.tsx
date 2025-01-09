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
import { destroySession, getSession } from "~/clientSessions";
import { Footer } from "~/components/store/layout/footer";
import Header from "~/components/store/layout/header";
import { useToast } from "~/hooks/use-toast";
import { logOut } from "~/lib/api/auth/logOut";

export const meta: MetaFunction = () => {
  return [{ title: "On the court" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  // TODO: get user's shopping cart info
  const session = await getSession(cookieHeader);
  if (session.has("token")) return { isLoggedIn: true };
  return { isLoggedIn: false };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "logout") {
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

  return null;
}

export default function Store() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
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
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
