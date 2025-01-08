import { redirect } from "@remix-run/react";

export function loader() {
  return redirect("/store");
}

export default function Index() {
  return;
}
