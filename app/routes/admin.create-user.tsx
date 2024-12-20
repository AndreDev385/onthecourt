import { Link } from "@remix-run/react";
import { UserForm } from "~/components/admin/users/form";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function CreateUserPage() {
  return (
    <div>
      <Card className="mt-16 max-w-[800px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Crear Usuario</h1>
          <Link to="/admin/users">
            <Button variant="ghost" className="font-bold text-sm">
              <Icon icon="arrow-left" />
              USUARIOS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <UserForm isUpdate={false} />
        </CardContent>
      </Card>
    </div>
  );
}
