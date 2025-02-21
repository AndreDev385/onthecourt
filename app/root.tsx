import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import "@splidejs/react-splide/css";
import { Toaster } from "./components/ui/toaster";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


export async function loader() {
  return {
    ENV: {
      TINY_KEY: process.env.TINY_KEY,
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },
    },
  };
}

export default function Root() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning={true}>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        {typeof document !== 'undefined' && <Toaster />}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (<html lang="es">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <SimpleError />
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>)
}

function SimpleError() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa'
    }}>
      <ExclamationTriangleIcon
        style={{
          width: '48px',
          height: '48px',
          color: '#dc3545',
          marginBottom: '1rem'
        }}
      />

      <h1 style={{
        fontSize: '1.5rem',
        color: '#212529',
        marginBottom: '2rem'
      }}>
        Ha ocurrido un error
      </h1>

      <a
        href="/"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3ABF33',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontSize: '1rem'
        }}
      >
        Ir a la página de inicio
      </a>
    </div>
  );
}
