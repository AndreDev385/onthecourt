import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FORM_INTENTS } from "./constants";

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
