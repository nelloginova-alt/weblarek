import {IProduct} from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductCatalog {
  private products: IProduct[] = [];
  private productDetails: IProduct | null = null;

   constructor(protected events: IEvents) {}
  
  setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.events.emit('catalog:updated');
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setProductDetails(product: IProduct): void {
    if (product) {
      this.productDetails = product;
      this.events.emit('catalog:details-selected');
    } else {
      this.productDetails = null;
      this.events.emit('catalog:details-cleared');
    }
  }

  getProductDetails(): IProduct | null {
    return this.productDetails;
  }
} 