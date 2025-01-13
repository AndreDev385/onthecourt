function PayPalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      version="1.1"
      className={`w-5 h-5 text-white fill-current ${className}`}
    >
      <path d="M390.869 40.864C367.573 13.76 326.901 0 270.069 0H127.605c-18.048 0-33.152 13.088-35.968 31.136l-59.328 384c-1.248 8.288 1.152 16.672 6.592 23.008A28.038 28.038 0 0060.245 448h101.664l23.52-152.384c.48-2.144 2.24-3.68 4.224-3.68h41.792c101.568 0 162.464-48.96 180.864-145.472l1.632-9.248c6.08-41.696-.8-70.496-23.072-96.352zm-8.544 91.36l-1.44 8.16c-15.328 80.416-64.192 119.52-149.408 119.52h-41.792c-16.48 0-30.528 10.976-34.944 26.656l-.256-.064-.672 4.384c-.032.032-.032.064-.032.128L134.485 416h-69.92l58.688-379.968c.352-2.336 2.176-4.032 4.352-4.032h142.432c47.104 0 79.616 9.984 96.608 29.728 16 18.592 20.352 38.464 15.68 70.496z" />
      <path
        d="M231.63 339.194H236.142V371.194H231.63z"
        transform="rotate(-81.807 233.887 355.193)"
      />
      <path d="M454.901 104.672c-12.608-14.464-30.4-25.248-52.896-32l-9.184 30.656c16.608 4.992 29.376 12.512 37.888 22.304 15.84 18.432 20.32 38.912 15.584 70.432 0 0-.864 5.152-1.568 8.32-15.168 80.384-64 119.456-149.376 119.456h-41.6c-17.92 0-33.056 13.056-35.968 31.168L198.453 480h-70.016l7.04-45.568-31.616-4.864-7.744 50.048c-1.024 8.32 1.536 16.64 7.008 22.848 5.376 6.08 13.024 9.536 21.024 9.536h101.728l23.488-152c.352-2.08 1.952-4.16 4.384-4.16h41.6c101.792 0 162.624-48.96 180.672-144.928.736-3.168 1.824-9.536 1.856-9.824 6.176-40.992-.896-70.688-22.976-96.416z" />
    </svg>
  );
}

interface PayPalButtonProps {
  amount?: string;
}

export default function PayPalButton({ amount }: PayPalButtonProps) {
  return (
    <a
      href={`https://www.paypal.com/paypalme/onthecourtstore/${amount}`}
      target="_blank"
      rel="noreferrer"
      className="w-full rounded transition duration-500 ease-out px-4 py-1 lg:p-2 lg:px-8 mt-4 text-white cursor-pointer inline-flex justify-center"
      style={{
        backgroundColor: "#0070ba",
      }}
    >
      <PayPalIcon className="my-auto mr-1" />
      <span className="my-auto">Pagar con PayPal</span>
    </a>
  );
}
