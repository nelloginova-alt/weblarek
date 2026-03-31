import {Api} from './base/Api';
import {IProductResponse, IOrderRequest, IOrderResponse} from '../types/index';

export class DataApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>('/product');
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', order);
  }
}