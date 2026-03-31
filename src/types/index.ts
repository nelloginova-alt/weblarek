export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'card' | 'cash' | ''

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}