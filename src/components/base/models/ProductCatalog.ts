import {IProduct} from '../../../types/index';

export class ProductCatalog {
  private _products: IProduct[] = [];
  private _productDetails: IProduct | null = null;
  
  setProducts(products: IProduct[]): void {
    this._products = [...products];
  }

  getProducts(): IProduct[] {
    return [...this._products];
  }

  getProductById(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }

  setProductDetails(product: IProduct | undefined): void {
    if (product) {
      this._productDetails = product;
    } else {
      this._productDetails = null;
    }
  }

  getProductDetails(): IProduct | null {
    return this._productDetails;
  }
} 