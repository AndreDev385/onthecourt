type Props = {
  icon: "arrow-left" | "plus" | "arrow-right" | "delete" | "edit";
};

function mapIcon(icon: string) {
  switch (icon) {
    case "plus":
      return (
        <svg
          fill="currentColor"
          className="h-4 w-4 mr-1 my-auto"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      );
    case "arrow-left":
      return (
        <svg
          fill="currentColor"
          className="w-4 h-4 mr-1 my-auto"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      );
    case "arrow-right":
      return (
        <svg
          fill="currentColor"
          className="w-4 h-4 my-auto"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "delete":
      return (
        <svg
          fill="none"
          className="w-6 h-6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case "edit":
      return (
        <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
  }
}

export function Icon({ icon }: Props) {
  return mapIcon(icon);
}
