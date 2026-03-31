import {IProduct} from '../../types/index';

export class ProductBasket {
  private productsSelected: IProduct[] = [];
  
  getProductsSelected(): IProduct[] {
    return [...this.productsSelected];
  }

  addProductSelected(product: IProduct): void {
    if (product && !this.hasProductSelected(product.id)) {
      this.productsSelected.push(product);
    }
  }

  removeProductSelected(productId: string): void {
    if(productId)
        {this.productsSelected = this.productsSelected.filter(productSelected => productSelected.id !== productId)};
  }

  clear(): void {
    this.productsSelected = [];
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