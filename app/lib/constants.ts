export const PRIVILEGES = {
  Cliente: 0,
  Administrador: 1,
  Editor: 2,
  "Solo ver": 3,
} as const;

export const DNI_TYPES = {
  Venezuelano: 1,
  Extranjero: 2,
  Juridico: 3,
} as const;

export const FORM_INTENTS = {
  create: "create",
  update: "update",
  deactivate: "deactivate",
  activate: "activate",
};

export const ORDER_STATUS = {
  pending: 0,
  check: 1,
  paid: 2,
  delivered: 3,
  credit: 4,
  creditDelivered: 5,
  creditPaid: 6,
  canceled: 7,
};

export type OrderValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

type Methods = Array<{ title: string; value: string; currency: string }>;

export const PAYMETHODS_VALUES = {
  paypal: "paypal",
  zelle: "zelle",
  transferencia: "transferencia",
  pago_movil: "pago movil",
} as const;

export const PAYMENT_METHODS: Methods = [
  {
    title: "Transferencia",
    value: "transferencia",
    currency: "Bolivar",
  },
  {
    title: "Pago móvil",
    value: "pago movil",
    currency: "Bolivar",
  },
  {
    title: "Zelle",
    value: "zelle",
    currency: "Dollar",
  },
  {
    title: "PayPal",
    value: "paypal",
    currency: "Dollar",
  },
  {
    title: "Efectivo",
    value: "efectivo",
    currency: "Dollar",
  },
];
