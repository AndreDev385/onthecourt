declare global {
  interface Window {
    ENV: {
      TINY_KEY: string;
      firebase: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
      };
    };
  }
}

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

export type Category = {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
  photo?: string;
  products?: Array<Product | string>;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export type Currency = {
  _id: string;
  slug: string;
  name: string;
  symbol: string;
  rate: number;
  principal?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
  __typename?: string;
};

export type Location = {
  _id: string;
  name: string;
  address: string;
  slug?: string;
  shippingOptions?: Array<Shipping>;
  lat?: number;
  lon?: number;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export type Shipping = {
  _id: string;
  name: string;
  price: number;
  slug?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export type Supplier = {
  _id: string;
  slug: string;
  name: string;
  active: boolean;
  products?: Array<Product>;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

// refactor to isFixed to check if it is a fixed or percentage
export type PromoCode = {
  _id: string;
  slug: string;
  name: string;
  code: string;
  discount: number;
  isFixed: boolean;
  percentage: boolean;
  expirationDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export type Product = {
  slug?: string;
  title: string;
  description?: string;
  priority?: number;
  isService?: boolean;
  active?: boolean;
  photos?: Array<string>;
  brand?: Brand;
  variants?: Array<Variant>;
  dataSheet?: string;
  variantValues?: Array<VariantValue>;
  volatileInventory?: boolean;
  // supplier?: SupplierDocument | Schema.Types.ObjectId;
  price: number;
  compareAtPrice: number;
  sku?: string;
  categories?: Array<Category>;
  extraInfo?: Array<{ _id: string; name: string; value: string }>;
  rating?: number;
  comments?: Array<Comment>;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export type Variant = {
  title: string;
  tags: Array<string>;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export type VariantValue = {
  value?: {
    variant1: string;
    variant2?: string;
    variant3?: string;
  };
  price: number;
  compareAtPrice: number;
  quantity?: number;
  photo?: string;
  sku?: string;
  product?: Product;
  location?: { _id: string; name: string } | string;
  disabled?: boolean;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __typename?: string;
};

export interface Order {
  _id: string;
  status: number;
  paid?: boolean;
  subtotal?: number;
  tax?: number;
  extraFees?: number;
  discount?: number;
  total: number;
  commission?: number;
  shipping?: Shipping;
  products?: Array<OrderProduct>;
  client: User;
  seller?: User;
  phone?: string;
  charges?: Array<Charge>;
  createdAt: Date;
  updatedAt?: Date;
}
