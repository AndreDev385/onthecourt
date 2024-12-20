export type Brand = {
  slug: string;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __typename?: string;
};

export type User = {
  name: string;
  slug: string;
  email: string;
  password: string;
  dni?: string;
  dniType?: number; //! 1V | 2E | 3J | 4G
  resetToken?: string;
  resetTokenExpiry?: number;
  privilege: number; //! 0 Client | 1 SuperAdmin | 2 Admin | ...
  commission?: number;
  active?: boolean;
  client?: Client | string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};
