import { User } from "~/routes/admin.users/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DNI_TYPES, PRIVILEGES } from "~/lib/constants";

type Props = {
  user?: User;
  isUpdate: boolean;
};

const formSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email({ message: "El correo no es valido" }),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    rePassword: z.string(),
    dni: z.string({ required_error: "El dni es obligatorio" }),
    dniType: z
      .string({ required_error: "El dniType es obligatorio" })
      .min(1, "El dniType es obligatorio"),
    privilege: z
      .string({ required_error: "El privilegio es obligatorio" })
      .min(1, "El privilegio es obligatorio")
      .transform((value) => Number(value)),
    commission: z
      .string({ required_error: "La comisión es obligatorio" })
      .transform((value) => Number(value)),
  })
  .superRefine(({ rePassword, password }, ctx) => {
    if (rePassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["rePassword"],
      });
    }
  });

export function UserForm({ user, isUpdate = false }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: user?.password ?? "",
      rePassword: user?.password ?? "",
      dni: user?.dni ?? "",
      dniType: user?.dniType ?? "",
      privilege: user?.privilege ?? 3, // 3: Solo ver
      commission: user?.commission ? user.commission : 0,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row flex-wrap lg:-mx-4">
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="Jonh Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="email"
                      placeholder="john@doe.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {!isUpdate ? (
          <div className="flex flex-row flex-wrap lg:-mx-4">
            <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
              <FormField
                control={form.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repita la Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ) : null}
        <div className="flex flex-row flex-wrap lg:-mx-4">
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <FormField
              control={form.control}
              name="dniType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <FormControl>
                    <Select
                      required
                      {...field}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DNI_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={String(value)}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Identidad</FormLabel>
                  <FormControl>
                    <Input required placeholder="26985902" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap lg:-mx-4">
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <FormField
              control={form.control}
              name="privilege"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privilegio</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un privilegio" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIVILEGES).map(([key, value]) => (
                          <SelectItem key={key} value={String(value)}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full lg:w-1/2 px-4 mb-4">
            <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comisión</FormLabel>
                  <FormControl>
                    <Input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      placeholder="0.05"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap w-full mt-4 mb-2">
          <div className="ml-auto">
            {isUpdate &&
              (user?.active ? (
                <Button
                  //onClick={desactive}
                  type="button"
                  //disabled={disabledButton}
                  color="danger"
                  variant="outline"
                >
                  Eliminar
                </Button>
              ) : (
                <Button
                  //onClick={reactive}
                  type="button"
                  //disabled={disabledButton}
                  color="success"
                  variant="outline"
                >
                  Activar
                </Button>
              ))}
            <Button type="submit" /*disabled={disabledButton}*/ color="primary">
              {isUpdate ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
