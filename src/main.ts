import './scss/styles.scss';
import {apiProducts} from './utils/data';
import {ProductCatalog} from './components/models/ProductCatalog';
import {ProductBasket} from './components/models/ProductBasket';
import {BuyerDetails} from './components/models/BuyerDetails';

import {Api} from './components/base/Api';
import {DataApi} from './components/DataApi';
import {API_URL} from './utils/constants';
import {IProduct} from './types/index';

const productsModel = new ProductCatalog();
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProducts());
console.log("Товар:", productsModel.getProducts()[0]);
productsModel.setProductDetails(productsModel.getProducts()[0]);
console.log('Подробный просмотр товара:', productsModel.getProductDetails());
console.log('Товар по id:', productsModel.getProductById(apiProducts.items[0].id));

const basketModel = new ProductBasket();
const testProduct = productsModel.getProducts()[0];
basketModel.addProductSelected(testProduct);
console.log('Список покупок в корзине:', basketModel.getProductsSelected());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Кол-во товаров:', basketModel.getTotalItems());
basketModel.removeProductSelected(testProduct?.id)
console.log('Корзина после удаления товара:', basketModel.getProductsSelected());

const anotherProduct = productsModel.getProducts()[1];
basketModel.addProductSelected(testProduct);
basketModel.addProductSelected(anotherProduct);
console.log('Список покупок в корзине:', basketModel.getProductsSelected());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Кол-во товаров:', basketModel.getTotalItems());
console.log('Товар в корзине?', basketModel.hasProductSelected(anotherProduct.id));
basketModel.clear();
console.log('Корзина после очистки товаров:', basketModel.getProductsSelected());
console.log('Товар в корзине?', basketModel.hasProductSelected(testProduct.id));

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

const mockProducts: IProduct[] = [
  { id: '1', description: 'Описание товара 1', image: '/5_Dots.svg', title: 'Товар 1', category: 'софт-скил', price: 100 },
  { id: '2', description: 'Описание товара 2', image: '/Shell.svg', title: 'Товар 2', category: 'другое' ,price: 300 },
];

const api = new Api(API_URL);
const dataApi = new DataApi(api);
dataApi.getProducts()
  .then(data => {
    console.log('Кол-во товаров:', data.total);
    console.log('Товары:', data.items);

    productsModel.setProducts(data.items);
    console.log('Каталог:', productsModel.getProducts());
    console.log('Кол-во товаров:', productsModel.getProducts().length);
    const findProduct = productsModel.getProductById(data.items[1].id);
    console.log('Найден товар:', findProduct?.title)
  })
  .catch(error => {
    console.error('Ошибка:', error);
  
  productsModel.setProducts(mockProducts);
  console.log('Каталог моковых товаров:', productsModel.getProducts());
  console.log('Кол-во моковых товаров:', productsModel.getProducts().length);
  const findMockProduct = productsModel.getProductById(mockProducts[0].id);
  console.log('Найден моковый товар:', findMockProduct?.title);
  });