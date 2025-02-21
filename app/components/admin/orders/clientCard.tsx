import { Card, CardContent } from "~/components/ui/card";

export function ClientCard({ name, email, address = "", phone = "" }: Props) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <h2 className="text-gray-700 text-lg font-bold">Cliente</h2>
        <p>{name}</p>
        <p>{email}</p>
        <p>{phone ?? ""}</p>
        <p>{address ?? ""}</p>
      </CardContent>
    </Card>
  );
}

type Props = {
  name: string;
  email: string;
  phone: string;
  address: string;
};
