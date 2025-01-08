import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Header from "~/components/store/layout/header";

export const meta: MetaFunction = () => {
  return [{ title: "On the court" }];
};

export default function Store() {
  return (
    <div>
      <Header />
      <div className="min-h-dvh">
        <Outlet />
      </div>
      <div>TODO: Footer</div>
    </div>
  );
}
