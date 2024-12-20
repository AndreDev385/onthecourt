type Props = {
  icon: "arrow-left" | "plus";
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
  }
}

export function Icon({ icon }: Props) {
  return mapIcon(icon);
}
