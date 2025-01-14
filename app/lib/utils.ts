import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FORM_INTENTS, ORDER_STATUS, OrderValue } from "./constants";
import { PromoCode } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateDni(dni: string) {
  const numericPattern = /^\d{7,9}$/; // Allow between 7 and 9 digits
  if (!numericPattern.test(dni)) return false;
  return true;
}

export function validateString(string: string) {
  if (string === null || string === undefined) {
    return false;
  }

  if (
    String(string).trim() === "" ||
    String(string).length <= 0 ||
    String(string).trim().length <= 0
  ) {
    return false;
  }

  return true;
}

export function validateNumber(number: unknown) {
  if (number === null || number === undefined || number === false) {
    return false;
  }

  if (Array.isArray(number)) {
    return false;
  }

  if (String(number).trim().length <= 0) {
    return false;
  }

  const _number = Number(number);

  return !Number.isNaN(_number);
}

export const DATE_FORMAT = "yyyy-MM-dd";

export function mapIntentToMessage(intent: string) {
  switch (intent) {
    case FORM_INTENTS.activate:
      return "activado";
    case FORM_INTENTS.deactivate:
      return "desactivado";
    case FORM_INTENTS.update:
      return "actualizado";
    default:
      return "actualizado";
  }
}

export function formatMoney(value: number): string {
  return (value / 100).toFixed(2);
}

export function getDiscount(subtotal: number, _promoCode: PromoCode | null) {
  if (!_promoCode) {
    return 0;
  }
  if (_promoCode?.expirationDate >= new Date()) {
    return 0;
  }
  let _discount = 0;
  if (_promoCode?.fixed) {
    _discount = _promoCode.discount as number;
  }
  if (_promoCode?.percentage) {
    _discount = subtotal * ((_promoCode.discount as number) / 100);
  }
  if (_discount < 0) {
    _discount = subtotal;
  }
  console.log(_discount, subtotal, _promoCode.discount, "DESCUENTO");
  return _discount;
}

export function mapStatusToClientText(status: OrderValue) {
  switch (status) {
    case ORDER_STATUS.pending:
      return "Confirmando pago";
    case ORDER_STATUS.check:
      return "En proceso";
    case ORDER_STATUS.paid:
      return "Pago confirmado";
    case ORDER_STATUS.delivered:
      return "Entregado";
    case ORDER_STATUS.credit:
      return "Credito";
    case ORDER_STATUS.creditDelivered:
      return "Credito entregado";
    case ORDER_STATUS.creditPaid:
      return "Credito pagado";
    case ORDER_STATUS.canceled:
      return "Cancelado";
    default:
      return "Pendiente";
  }
}
