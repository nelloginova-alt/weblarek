import {IProduct} from '../../../types/index';

export class ProductBasket {
  private _productsSelected: IProduct[] = [];
  
  getProductsSelected(): IProduct[] {
    return [...this._productsSelected];
  }

  addProductSelected(product: IProduct | undefined): void {
    if (product && !this.hasProductSelected(product.id)) {
      this._productsSelected.push(product);
    }
  }

  removeProductSelected(productId: string | undefined): void {
    if(productId)
        {this._productsSelected = this._productsSelected.filter(productSelected => productSelected.id !== productId)};
  }

  clear(): void {
    this._productsSelected = [];
  }

  getTotalPrice(): number {
    return this._productsSelected.reduce((sum, productSelected) => {
      return sum + (productSelected.price ?? 0);
    }, 0);
  }

  getTotalItems(): number {
    return this._productsSelected.length;
  }

  hasProductSelected(productId: string): boolean {
    return this._productsSelected.some((item) => item.id === productId);
  }
}