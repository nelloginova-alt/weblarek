import './scss/styles.scss';
import {apiProducts} from './utils/data';
import {ProductCatalog} from './components/base/models/ProductCatalog';
import {ProductBasket} from './components/base/models/ProductBasket';
import {BuyerDetails} from './components/base/models/BuyerDetails';

import {Api} from './components/base/Api';
import {DataApi} from './components/base/DataApi';

const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProducts());
console.log("Товар:", productsModel.getProducts()[0]);
productsModel.setProductDetails(productsModel.getProducts()[0]);
console.log('Подробный просмотр товара:', productsModel.getProductDetails());

const basketModel = new ProductBasket();
const testProduct = productsModel.getProducts()[0];
basketModel.addProductSelected(testProduct);
console.log('Корзина:', basketModel.getProductsSelected());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Кол-во товаров:', basketModel.getTotalItems());
basketModel.removeProductSelected(testProduct?.id)

const anotherProduct = productsModel.getProducts()[1];
basketModel.addProductSelected(testProduct);
basketModel.addProductSelected(anotherProduct);
console.log('Корзина:', basketModel.getProductsSelected());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Кол-во товаров:', basketModel.getTotalItems());
basketModel.clear();
console.log('Корзина:', basketModel.getProductsSelected());

const buyerModel = new BuyerDetails();
buyerModel.updateData({ 
  payment: 'card', 
  email: 'test@practicum.com',
  phone: '+79876543210',
  address: 'Москва, Профсоюзная 98'
});
console.log('Данные покупателя:', buyerModel.getData());
console.log('Проверка данных:', buyerModel.validate());
buyerModel.clear();
console.log('Наличие данных:', buyerModel.getData());

const api = new Api(import.meta.env.VITE_API_ORIGIN);
const dataApi = new DataApi(api);
dataApi.getProducts()
  .then(data => {
    console.log('Кол-во товаров:', data.total);
    console.log('Товары:', data.items);

    productsModel.setProducts(data.items);
    console.log('Rаталог:', productsModel.getProducts());
    console.log('Кол-во товаров:', productsModel.getProducts().length);

    const findProduct = productsModel.getProductById(data.items[1].id);
    console.log('Найден товар:', findProduct?.title)
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
