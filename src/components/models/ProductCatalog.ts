import {IProduct} from '../../types/index';

export class ProductCatalog {
  private products: IProduct[] = [];
  private productDetails: IProduct | null = null;
  
  setProducts(products: IProduct[]): void {
    this.products = [...products];
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
    } else {
      this.productDetails = null;
    }
  }

  getProductDetails(): IProduct | null {
    return this.productDetails;
  }
} 