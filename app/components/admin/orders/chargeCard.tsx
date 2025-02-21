import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "~/components/ui/card";
import { formatMoney } from "~/lib/utils";

type ChargeCardProps = {
  charges: {
    ref: string;
    bank: string;
    method: string;
    amount: number;
    capture?: string;
    createdAt: string;
  }[];
};

function ChargeCard({ charges }: ChargeCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <ul className="w-full flex flex-col gap-2">
          <h2 className="text-gray-700 text-lg font-bold">Cargos</h2>
          {charges.map((charge, idx) => (
            <li key={idx} className={`w-full flex flex-col gap-2`}>
              <div className="flex justify-between">
                <p>Método de pago</p>
                <p className="">{charge.method}</p>
              </div>
              <div className="flex justify-between">
                <p>Monto</p>
                <p className="">{formatMoney(charge.amount)}</p>
              </div>
              <div className="flex justify-between">
                <p>Fecha</p>
                <p className="">
                  hace{" "}
                  {formatDistance(new Date(), charge.createdAt, {
                    locale: es,
                    addSuffix: false,
                  })}
                </p>
              </div>
              {charge.ref ? (
                <div className="flex justify-between">
                  <p>Referencia</p>
                  <p className="">{charge.ref}</p>
                </div>
              ) : null}
              {charge.capture ? (
                <div className="flex justify-between">
                  <a
                    href={charge.capture}
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver capture
                  </a>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default ChargeCard;
