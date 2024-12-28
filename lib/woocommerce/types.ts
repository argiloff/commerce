export type Maybe<T> = T | null;

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  currencyCode: string;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
