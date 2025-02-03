import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "@remix-run/react";
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";

export default function ErrorDisplay() {
  const error = useRouteError();

  let errorMessage: string;
  let errorTitle: string;
  let ErrorIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;

  if (isRouteErrorResponse(error)) {
    console.log({ error });
    switch (error.status) {
      case 404:
        errorTitle = "Página no encontrada";
        errorMessage = "¡Ups! La página que estás buscando no existe.";
        ErrorIcon = QuestionMarkCircleIcon;
        break;
      case 401:
        errorTitle = "No autorizado";
        errorMessage =
          "Lo siento, no tienes permiso para acceder a esta página.";
        ErrorIcon = ShieldExclamationIcon;
        break;
      default:
        errorTitle = `Error ${error.status}`;
        errorMessage = error.data ?? "Ha ocurrido un error inesperado.";
        ErrorIcon = ExclamationTriangleIcon;
    }
  } else if (error instanceof Error) {
    errorTitle = "Ha ocurrido un error";
    errorMessage = error.message;
    ErrorIcon = ExclamationTriangleIcon;
  } else {
    errorTitle = "Ha ocurrido un error";
    errorMessage =
      "Ha ocurrido un error desconocido. Por favor, inténtalo de nuevo más tarde.";
    ErrorIcon = ExclamationTriangleIcon;
  }

  return <ErrorComponent ErrorIcon={ErrorIcon} errorTitle={errorTitle} errorMessage={errorMessage} />
}

export function ErrorComponent({
  errorTitle,
  errorMessage,
  ErrorIcon = ExclamationTriangleIcon,
}: {
  errorTitle: string,
  errorMessage: string,
  ErrorIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}) {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <ErrorIcon
            className="mx-auto h-12 w-12 text-red-500"
            aria-hidden="true"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {errorTitle}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-2 text-sm text-center">
            <Button
              variant="ghost"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
              onMouseDown={() => navigate(-1)}
            >
              Ir atrás
            </Button>
            <Link
              to="/"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
            >
              Volver a la página de inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
