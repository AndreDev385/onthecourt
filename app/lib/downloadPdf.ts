import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatMoney } from "./utils";
import { logo } from "./logo";
import { TDocumentDefinitions } from "pdfmake/interfaces";

const TITLE = "On the court";
const RIF = "-";
const ADDRESS = "-";
const CITY = "Caracas";
const PHONE = "0412-111-1111";

type ProductInfo = {
  quantity: number;
  title: string;
  price: number;
};

function generateProductRow(products: ProductInfo[], rate: number = 1) {
  return products.map((product) => [
    {
      text: `${product.quantity}`,
      style: "subHeader",
      alignment: "center",
    },
    {
      text: `${product.title.toUpperCase()}`,
      style: "subHeader",
      alignment: "left",
    },
    {
      text: `${formatMoney(product.price * rate)}`,
      style: "money",
      alignment: "right",
    },
    {
      text: `${formatMoney(product.price * product.quantity! * rate)}`,
      style: "money",
      alignment: "right",
    },
  ]);
}

//type Address = {
//  municipality: string;
//  state: string;
//  street: string;
//  neighborhood: string;
//};

//function addressToString(address?: Address): string {
//  if (!address) {
//    return "-";
//  }
//  const { municipality, state, street, neighborhood } = address;
//  return `${street} ${neighborhood}, ${municipality}, ${state}`;
//}

export type DeliveryNoteInfoForPdf = {
  controlNumber: string;
  createdAt: string;
};

export type OrderInfoForPdf = {
  products: ProductInfo[];
  client: {
    name: string;
    email: string;
    phone?: string;
  };
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

export function generateDeliveryNoteDD(
  deliveryNote: DeliveryNoteInfoForPdf,
  order: OrderInfoForPdf
) {
  const data: TDocumentDefinitions = {
    pageSize: "LETTER",
    pageMargins: [40, 100, 40, 60],
    header: {
      margin: [40, 20, 40, 0],
      columns: [
        {
          width: "*",
          text: [
            {
              text: `${TITLE} \n`,
              style: "bigHeader",
            },
            {
              text: `${RIF}\n`,
              style: "lowHeader",
            },
            {
              text: `${ADDRESS}\n`,
              style: "lowHeader",
            },
            {
              text: `${CITY}\n`,
              style: "lowHeader",
            },
            {
              text: "Teléfonos:\n",
              style: "lowHeader",
            },
            {
              text: `${PHONE}\n`,
              style: "lowHeader",
            },
          ],
          style: "headHeader",
        },
        {
          width: "auto",
          layout: "noBorders",
          table: {
            headerRows: 3,
            widths: ["*"],
            body: [
              [
                {
                  image: logo,
                  width: 100,
                  alignment: "left",
                },
              ],
              [
                {
                  text: "Número de Control",
                  bold: true,
                  alignment: "left",
                },
              ],
              [
                {
                  text: `00-${deliveryNote.controlNumber || ""}`,
                  alignment: "left",
                  color: "#ff0000",
                },
              ],
            ],
          },
        },
      ],
      columnGap: 10,
    },
    info: {
      title: `Nota de Entrega N${deliveryNote.controlNumber} ${TITLE}`,
      author: `${TITLE}`,
      subject: `Nota de Entrega N${deliveryNote.controlNumber || ""} ${TITLE}`,
      keywords: `${TITLE}, Nota de Entrega, Tennis, ${deliveryNote.controlNumber || ""
        }`,
      creator: `${TITLE}`,
      producer: `${TITLE}`,
    },
    content: [
      {
        text: "Datos de la Nota de Entrega",
        style: "header",
      },
      {
        layout: "noBorders",
        style: "table",
        color: "#000",
        table: {
          widths: ["auto", "auto", "*", "*"],
          headerRows: 1,
          body: [
            [
              {
                text: [
                  {
                    text: "NOMBRE O RAZÓN SOCIAL DEL CLIENTE",
                    bold: true,
                    alignment: "left",
                  },
                  "\n",
                  {
                    text: `${order.client?.name}`,
                    style: "peopleDataLower",
                  },
                ],
                style: "subHeaderLower",
                colSpan: 3,
              },
              {},
              {},
              {
                text: [
                  {
                    text: "CORREO ELECTRÓNICO",
                    // text: 'CEDULA DE IDENTIDAD O RIF',
                    bold: true,
                    alignment: "left",
                  },
                  "\n",
                  {
                    text: `${order.client.email.toUpperCase()}`,
                    style: "peopleDataLower",
                  },
                ],
                style: "subHeaderLower",
              },
            ],
            [
              {
                colSpan: 2,
                text: [
                  { text: "TELÉFONOS", bold: true },
                  "\n",
                  {
                    text: `${order.client.phone}`,
                    style: "peopleData",
                  },
                ],
                style: "subHeader",
              },
              {},
              {
                colSpan: 2,
                text: [
                  { text: "FECHA DE EMISIÓN", bold: true },
                  "\n",
                  {
                    text: `${format(
                      new Date(deliveryNote.createdAt),
                      "dd/MM/yyyy",
                      { locale: es }
                    )}`,
                    style: "peopleData",
                  },
                ],
                style: "subHeader",
              },
              {},
            ],
            [
              {
                text: "CANTIDAD",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
              {
                text: "CONCEPTO O DESCRIPCIÓN",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
              {
                text: "PRECIO UNITARIO",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
              {
                text: "TOTAL",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
            ],
            ...generateProductRow(order.products),
            [
              {
                text: "SUB-TOTAL",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${formatMoney(order.subtotal)}`,
                style: "money",
                alignment: "right",
              },
            ],
            [
              {
                text: "DESCUENTO",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${formatMoney(order.discount)}`,
                style: "money",
                alignment: "right",
              },
            ],
            [
              {
                text: "IVA",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${formatMoney(order.tax)}`,
                style: "money",
                alignment: "right",
              },
            ],
            [
              {
                text: "TOTAL",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${formatMoney(order.total)}`,
                style: "money",
                alignment: "right",
              },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: "center",
      },
      headHeader: {
        alignment: "left",
        fontSize: 8,
      },
      subHeader: {
        fontSize: 7,
        alignment: "left",
        margin: [1, 1, 1, 1],
      },
      subHeaderLower: {
        fontSize: 7,
      },
      table: {
        margin: [0, 0, 0, 0],
      },
      footer: {
        fontSize: 5,
        alignment: "center",
      },
      peopleData: {
        fontSize: 7,
        color: "#121212",
        margin: [0, 3, 0, 3],
      },
      peopleDataLower: {
        fontSize: 6,
        color: "#121212",
        margin: [3, 0, 3, 0],
        alignment: "left",
      },
      total: {
        bold: true,
        color: "#000",
        fontSize: 7,
        alignment: "right",
      },
      money: {
        alignment: "right",
        fontSize: 7,
      },
      bigHeader: {
        alignment: "left",
        fontSize: 13,
        bold: true,
      },
      lowHeader: {
        alignment: "left",
        fontSize: 6,
      },
    },
  };
  return data;
}

export type InvoiceInfoForPdf = {
  controlNumber: string;
  createdAt: string;
  currency: {
    symbol: string;
  };
  rate: number;
};

export function generateInvoiceDD(
  invoice: InvoiceInfoForPdf,
  order: OrderInfoForPdf
) {
  const data: TDocumentDefinitions = {
    pageSize: "LETTER",
    pageMargins: [40, 100, 40, 60],
    header: {
      margin: [40, 20, 40, 0],
      columns: [
        {
          width: "*",
          text: [
            {
              text: `${TITLE} \n`,
              style: "bigHeader",
            },
            {
              text: `${RIF}\n`,
              style: "lowHeader",
            },
            {
              text: `${ADDRESS}\n`,
              style: "lowHeader",
            },
            {
              text: `${CITY}\n`,
              style: "lowHeader",
            },
            {
              text: "Teléfonos:\n",
              style: "lowHeader",
            },
            {
              text: `${PHONE}\n`,
              style: "lowHeader",
            },
          ],
          style: "headHeader",
        },
        {
          width: "auto",
          layout: "noBorders",
          table: {
            headerRows: 3,
            widths: ["*"],
            body: [
              [
                {
                  image: logo,
                  width: 100,
                  alignment: "left",
                },
              ],
              [
                {
                  text: "Número de Control",
                  bold: true,
                  alignment: "left",
                },
              ],
              [
                {
                  text: `00-${invoice.controlNumber || ""}`,
                  alignment: "left",
                  color: "#ff0000",
                },
              ],
            ],
          },
        },
      ],
      columnGap: 10,
    },
    info: {
      title: `Factura N${invoice.controlNumber} ${TITLE}`,
      author: `${TITLE}`,
      subject: `Factura N${invoice.controlNumber || ""} ${TITLE}`,
      keywords: `${TITLE}, Factura, Tennis, ${invoice.controlNumber || ""}`,
      creator: `${TITLE}`,
      producer: `${TITLE}`,
    },
    content: [
      {
        text: "Datos de la Factura",
        style: "header",
      },
      {
        layout: "noBorders",
        style: "table",
        color: "#000",
        table: {
          widths: ["auto", "auto", "*", "*"],
          headerRows: 1,
          body: [
            [
              {
                text: [
                  {
                    text: "NOMBRE O RAZÓN SOCIAL DEL CLIENTE",
                    bold: true,
                    alignment: "left",
                  },
                  "\n",
                  {
                    text: `${order.client.name}`,
                    style: "peopleDataLower",
                  },
                ],
                style: "subHeaderLower",
                colSpan: 3,
              },
              {},
              {},
              {
                text: [
                  {
                    text: "CORREO ELECTRÓNICO",
                    // text: 'CEDULA DE IDENTIDAD O RIF',
                    bold: true,
                    alignment: "left",
                  },
                  "\n",
                  {
                    text: `${order.client.email}`,
                    style: "peopleDataLower",
                  },
                ],
                style: "subHeaderLower",
              },
            ],
            [
              {
                colSpan: 2,
                text: [
                  { text: "TELÉFONOS", bold: true },
                  "\n",
                  {
                    text: `${order.client.phone ?? ""}`,
                    style: "peopleData",
                  },
                ],
                style: "subHeader",
              },
              {},
              {
                colSpan: 2,
                text: [
                  { text: "FECHA DE EMISIÓN", bold: true },
                  "\n",
                  {
                    text: `${format(new Date(invoice.createdAt), "dd/MM/yyyy", {
                      locale: es,
                    })}`,
                    style: "peopleData",
                  },
                ],
                style: "subHeader",
              },
              {},
            ],
            [
              {
                text: "CANTIDAD",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
              {
                text: "CONCEPTO O DESCRIPCIÓN",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
              {
                text: "PRECIO UNITARIO",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
              {
                text: "TOTAL",
                bold: true,
                style: "subHeader",
                alignment: "center",
              },
            ],
            ...generateProductRow(order.products),
            [
              {
                text: "SUB-TOTAL",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${invoice.currency.symbol} ${formatMoney(
                  order.subtotal * (invoice.rate / 100)
                )}`,
                style: "money",
                alignment: "right",
              },
            ],
            [
              {
                text: "DESCUENTO",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${invoice.currency.symbol} ${formatMoney(
                  (order.discount * invoice.rate) / 100
                )}`,
                style: "money",
                alignment: "right",
              },
            ],
            [
              {
                text: "IVA",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${invoice.currency.symbol} ${formatMoney(
                  (order.tax * invoice.rate) / 100
                )}`,
                style: "money",
                alignment: "right",
              },
            ],
            [
              {
                text: "TOTAL",
                style: "subHeader",
                bold: true,
                alignment: "right",
                colSpan: 3,
              },
              {},
              {},
              {
                text: `${invoice.currency.symbol} ${formatMoney(
                  (order.total * invoice.rate) / 100
                )}`,
                style: "money",
                alignment: "right",
              },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: "center",
      },
      headHeader: {
        alignment: "left",
        fontSize: 8,
      },
      subHeader: {
        fontSize: 7,
        alignment: "left",
        margin: [1, 1, 1, 1],
      },
      subHeaderLower: {
        fontSize: 7,
      },
      table: {
        margin: [0, 0, 0, 0],
      },
      footer: {
        fontSize: 5,
        alignment: "center",
      },
      peopleData: {
        fontSize: 7,
        color: "#121212",
        margin: [0, 3, 0, 3],
      },
      peopleDataLower: {
        fontSize: 6,
        color: "#121212",
        margin: [3, 0, 3, 0],
        alignment: "left",
      },
      total: {
        bold: true,
        color: "#000",
        fontSize: 7,
        alignment: "right",
      },
      money: {
        alignment: "right",
        fontSize: 7,
      },
      bigHeader: {
        alignment: "left",
        fontSize: 13,
        bold: true,
      },
      lowHeader: {
        alignment: "left",
        fontSize: 6,
      },
    },
  };
  return data;
}
