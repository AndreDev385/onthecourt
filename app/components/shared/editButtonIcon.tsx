import { Link } from "@remix-run/react";

type Props = {
  href: string;
};

export function EditButton({ href }: Props) {
  return (
    <Link to={href} className="text-indigo-700 p-1 float-right">
      <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 20 20">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path
          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </svg>
      <span className="sr-only">Editar</span>
    </Link>
  );
}
