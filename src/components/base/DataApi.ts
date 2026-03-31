import {Api} from './Api';
import {IProductRequest, IOrderRequest, IOrderResponse} from '../../types/index';

export class DataApi {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  getProducts(): Promise<IProductRequest> {
    return this._api.get<IProductRequest>('/product');
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this._api.post<IOrderResponse>('/order', order);
  }
}