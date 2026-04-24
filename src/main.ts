import './scss/styles.scss';
import {apiProducts} from './utils/data';
import {ProductCatalog} from './components/models/ProductCatalog';
import {ProductBasket} from './components/models/ProductBasket';
import {BuyerDetails} from './components/models/BuyerDetails';

// import {Api} from './components/base/Api';
// import {DataApi} from './components/DataApi';
// import {API_URL} from './utils/constants';
import {EventEmitter} from './components/base/Events';

import { Header } from './components/view/header';
import { Gallery } from './components/view/gallery';
import { Modal } from './components/view/modal';
import { CardCatalog } from './components/view/cardCatalog';
import { CardPreview } from './components/view/cardPreview';
import { CardBasket } from './components/view/cardBasket';
import { Basket } from './components/view/basket';
import { FormOrder } from './components/view/formOrder';
import { FormContacts } from './components/view/formContacts';
import { Success } from './components/view/success';

import {IProduct} from './types/index';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('.modal');

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(events, modalContainer);

const templates = {
  catalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  preview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basketItem: ensureElement<HTMLTemplateElement>('#card-basket'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  order: ensureElement<HTMLTemplateElement>('#order'),
  contacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

let currentBasket: Basket | null = null;
let currentOrderForm: FormOrder | null = null;
let currentContactsForm: FormContacts | null = null;
let currentPreviewCard: CardPreview | null = null;

const productsModel = new ProductCatalog(events);
productsModel.setProducts(apiProducts.items);

// console.log('Массив товаров из каталога:', productsModel.getProducts());
// console.log("Товар:", productsModel.getProducts()[0]);
// productsModel.setProductDetails(productsModel.getProducts()[0]);
// console.log('Подробный просмотр товара:', productsModel.getProductDetails());
// console.log('Товар по id:', productsModel.getProductById(apiProducts.items[0].id));

const basketModel = new ProductBasket(events);

// const testProduct = productsModel.getProducts()[0];
// basketModel.addProductSelected(testProduct);
// console.log('Список покупок в корзине:', basketModel.getProductsSelected());
// console.log('Общая стоимость:', basketModel.getTotalPrice());
// console.log('Кол-во товаров:', basketModel.getTotalItems());
// basketModel.removeProductSelected(testProduct?.id)
// console.log('Корзина после удаления товара:', basketModel.getProductsSelected());

const anotherProduct = productsModel.getProducts()[1];

// basketModel.addProductSelected(testProduct);
// basketModel.addProductSelected(anotherProduct);
// console.log('Список покупок в корзине:', basketModel.getProductsSelected());
// console.log('Общая стоимость:', basketModel.getTotalPrice());
// console.log('Кол-во товаров:', basketModel.getTotalItems());
// console.log('Товар в корзине?', basketModel.hasProductSelected(anotherProduct.id));
// basketModel.clear();
// console.log('Корзина после очистки товаров:', basketModel.getProductsSelected());
// console.log('Товар в корзине?', basketModel.hasProductSelected(testProduct.id));

const buyerModel = new BuyerDetails(events);

// buyerModel.updateData({ 
//   payment: 'card', 
//   email: 'test@practicum.com',
//   phone: '+79876543210',
//   address: 'Москва, Профсоюзная 98'
// });
// console.log('Данные покупателя:', buyerModel.getData());
// console.log('Проверка данных:', buyerModel.validate());
// buyerModel.clear();
// console.log('Данные после очистки:', buyerModel.getData());

// const mockProducts: IProduct[] = [
//   { id: '1', description: 'Описание товара 1', image: '/5_Dots.svg', title: 'Товар 1', category: 'софт-скил', price: 100 },
//   { id: '2', description: 'Описание товара 2', image: '/Shell.svg', title: 'Товар 2', category: 'другое' ,price: 300 },
// ];

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const api = new Api(API_URL);
// const dataApi = new DataApi(api);

// dataApi.getProducts()
//   .then(data => productsModel.setProducts(data.items))
//   .catch(err => console.error('Ошибка:', err));
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// dataApi.getProducts()
//   .then(data => {
//     console.log('Кол-во товаров:', data.total);
//     console.log('Товары:', data.items);

//     productsModel.setProducts(data.items);
//     console.log('Каталог:', productsModel.getProducts());
//     console.log('Кол-во товаров:', productsModel.getProducts().length);
//     const findProduct = productsModel.getProductById(data.items[1].id);
//     console.log('Найден товар:', findProduct?.title)
//   })
//   .catch(error => {
//     console.error('Ошибка:', error);
  
    // productsModel.setProducts(mockProducts);
    // console.log('Каталог моковых товаров:', productsModel.getProducts());
    // console.log('Кол-во моковых товаров:', productsModel.getProducts().length);
    // const findMockProduct = productsModel.getProductById(mockProducts[0].id);
    // console.log('Найден моковый товар:', findMockProduct?.title);
  // });

events.on('catalog:updated', () => {
  const cards = productsModel.getProducts().map(product => {
    const cardContainer = cloneTemplate(templates.catalog);
    const card = new CardCatalog(events, cardContainer);
        
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
        
    return card.render();
  });
  gallery.catalog = cards;
});

events.on('basket:changed', () => {
  header.counter = basketModel.getTotalItems();

  if (currentBasket !== null) {
    const basket = currentBasket as Basket;
    const items = basketModel.getProductsSelected().map((item, idx) => {
      const cardContainer = cloneTemplate(templates.basketItem);
      const card = new CardBasket(events, cardContainer);
            
      card.id = item.id;
      card.title = item.title;
      card.price = item.price;
      card.index = idx + 1;
            
      return card.render();
    });
        
    basket.list = items;
    basket.totalPrice = basketModel.getTotalPrice();
  }
});

events.on('card:select', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const cardElement = target.closest('.card') as HTMLElement;
  const id = cardElement?.dataset.id;
    
  if (!id) return;
    
  const product = productsModel.getProductById(id);
  if (!product) return;
    
  const cardContainer = cloneTemplate(templates.preview);
  const card = new CardPreview(events, cardContainer);
    
  card.id = product.id;
  card.title = product.title;
  card.price = product.price ?? null;
  card.category = product.category;
  card.image = product.image;
  card.description = product.description || '';

  currentPreviewCard = card;
    
  if (basketModel.hasProductSelected(id)) {
    card.buttonText = 'Удалить';
  }
    
  modal.content = card.render();
  modal.open();
});

events.on('card:toggle', () => {
  if (!currentPreviewCard) return;
    
  const id = currentPreviewCard.id;
  if (!id) return;
    
  if (basketModel.hasProductSelected(id)) {
    basketModel.removeProductSelected(id);
    currentPreviewCard.buttonText = 'Купить';
  } else {
    const product = productsModel.getProductById(id);
    if (product) basketModel.addProductSelected(product);
    currentPreviewCard.buttonText = 'Удалить';
  }
});

events.on('basket:open', () => {
  const basketContainer = cloneTemplate(templates.basket);
  const basket = new Basket(events, basketContainer);
  currentBasket = basket;
    
  const items = basketModel.getProductsSelected().map((item, idx) => {
    const cardContainer = cloneTemplate(templates.basketItem);
    const card = new CardBasket(events, cardContainer);
        
    card.id = item.id;
    card.title = item.title;
    card.price = item.price ?? null;
    card.index = idx + 1;
        
    return card.render();
  });

  basket.list = items;
  basket.totalPrice = basketModel.getTotalPrice();
    
  modal.content = basket.render();
  modal.open();
});

events.on('basket:remove', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const cardElement = target.closest('.basket__item') as HTMLElement;
  const id = cardElement?.dataset.id;
    
  if (id) basketModel.removeProductSelected(id);
});

events.on('basket:checkout', () => {
  const formContainer = cloneTemplate(templates.order);
  const form = new FormOrder(events, formContainer);
  currentOrderForm = form;
    
  modal.content = form.render();
  modal.open(); 
});

events.on('order:payment', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.updateData({ payment: data.payment });
  if (currentOrderForm) {
    currentOrderForm.payment = data.payment;
  }
});

events.on('order:address', (data: { address: string }) => {
  buyerModel.updateData({ address: data.address });
});

events.on('form:submit', () => {
  const buyerData = buyerModel.getData();
    
  if (!buyerData.payment || !buyerData.address) {
    console.error('Заполните все поля');
    return;
  }
    
  const formContainer = cloneTemplate(templates.contacts);
  const form = new FormContacts(events, formContainer);
  currentContactsForm = form;
    
  form.email = buyerData.email;
  form.phone = buyerData.phone;
    
  modal.content = form.render();
});

events.on('contacts:email', (data: { email: string }) => {
  buyerModel.updateData({ email: data.email });
});

events.on('contacts:phone', (data: { phone: string }) => {
  buyerModel.updateData({ phone: data.phone });
});

events.on('form:submit', async () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
    
  if (Object.keys(errors).length > 0) {
    console.error('Ошибки валидации:', errors);
    return;
  }
    
  const orderData = {
    items: basketModel.getProductsSelected().map(p => p.id),
    total: basketModel.getTotalPrice(),
    payment: buyerData.payment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone
  };
    
  // try {
  //   await dataApi.postOrder(orderData);
  //   basketModel.clear();
  //   buyerModel.clear();

  console.log('Заказ оформлен:', orderData);
  basketModel.clear();
  buyerModel.clear();
        
  const successContainer = cloneTemplate(templates.success);
  const success = new Success(events, successContainer);
  success.description = `Списано ${orderData.total} синапсов`;
        
  modal.content = success.render();
    // } catch (err) {
    //     console.error('Ошибка при отправке заказа:', err);
    // }
});

events.on('success:close', () => {
  modal.close();
});

events.on('modal:close', () => {
  currentPreviewCard = null;
  currentBasket = null;
  currentOrderForm = null;
  currentContactsForm = null;
});
