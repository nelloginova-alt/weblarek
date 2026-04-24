import {IProduct} from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductBasket {
  private productsSelected: IProduct[] = [];

  constructor(protected events: IEvents) {}
  
  getProductsSelected(): IProduct[] {
    return [...this.productsSelected];
  }

  addProductSelected(product: IProduct): void {
    if (product && !this.hasProductSelected(product.id)) {
      this.productsSelected.push(product);
      this.events.emit('basket:changed', {
        added: product,
        items: this.getProductsSelected(),
        totalPrice: this.getTotalPrice(),
        totalItems: this.getTotalItems()
      });
    }
  }

  removeProductSelected(productId: string): void {
    if(productId) {
      const removedProduct = this.productsSelected.find(p => p.id === productId);
      this.productsSelected = this.productsSelected.filter(productSelected => productSelected.id !== productId);
      this.events.emit('basket:changed', {
        removed: removedProduct,
        items: this.getProductsSelected(),
        totalPrice: this.getTotalPrice(),
        totalItems: this.getTotalItems()
      });
    };
      
  }

  clear(): void {
    this.productsSelected = [];
    this.events.emit('basket:cleared');
    this.events.emit('basket:changed', {
      items: [],
      totalPrice: 0,
      totalItems: 0
    });
  }

  getTotalPrice(): number {
    return this.productsSelected.reduce((sum, productSelected) => {
      return sum + (productSelected.price ?? 0);
    }, 0);
  }

  getTotalItems(): number {
    return this.productsSelected.length;
  }

  hasProductSelected(productId: string): boolean {
    return this.productsSelected.some((item) => item.id === productId);
  }
}