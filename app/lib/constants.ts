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
