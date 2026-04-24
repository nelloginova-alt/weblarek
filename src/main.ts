import './scss/styles.scss';
import {ProductCatalog} from './components/models/ProductCatalog';
import {ProductBasket} from './components/models/ProductBasket';
import {BuyerDetails} from './components/models/BuyerDetails';
import { IBuyer } from './types/index';

import {Api} from './components/base/Api';
import {DataApi} from './components/DataApi';
import {API_URL} from './utils/constants';
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

const basket = new Basket(events, cloneTemplate(templates.basket));
const orderForm = new FormOrder(events, cloneTemplate(templates.order));
const contactsForm = new FormContacts(events, cloneTemplate(templates.contacts));
const success = new Success(events, cloneTemplate(templates.success));

let currentBasket: Basket | null = basket;
let currentPreviewCard: CardPreview | null = null;
let currentPreviewCardId: string | null = null;

const productsModel = new ProductCatalog(events);
const basketModel = new ProductBasket(events);
const buyerModel = new BuyerDetails(events);

const api = new Api(API_URL);
const dataApi = new DataApi(api);

events.on('catalog:updated', () => {
  const cards = productsModel.getProducts().map(product => {
    const cardContainer = cloneTemplate(templates.catalog);
    const card = new CardCatalog(cardContainer, (id: string) => {
      events.emit('card:select', { id });
    });
        
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
        
    return card.render();
  });
  gallery.catalog = cards;
});

dataApi.getProducts()
  .then(data => productsModel.setProducts(data.items))
  .catch(err => console.error('Ошибка:', err));

events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    productsModel.setProductDetails(product);
  }
});

events.on('catalog:details-selected', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (!product) return;
    
  const cardContainer = cloneTemplate(templates.preview);
  const card = new CardPreview(events, cardContainer);
  currentPreviewCard = card;
  currentPreviewCardId = product.id;
    
  card.id = product.id;
  card.title = product.title;
  card.price = product.price ?? null;
  card.category = product.category;
  card.image = product.image;
  card.description = product.description || '';
    
  if (basketModel.hasProductSelected(product.id)) {
    card.buttonText = 'Удалить';
  }
    
  modal.content = card.render();
  modal.open();
});

events.on('card:toggle', () => {
  if (!currentPreviewCard || !currentPreviewCardId) return;
    
  const id = currentPreviewCardId;
    
  if (basketModel.hasProductSelected(id)) {
    basketModel.removeProductSelected(id);
    currentPreviewCard.buttonText = 'Купить';
  } else {
    const product = productsModel.getProductById(id);
    if (product) basketModel.addProductSelected(product);
    currentPreviewCard.buttonText = 'Удалить';
  }
});

events.on('buyer:updated', (data: IBuyer) => {
  orderForm.payment = data.payment === '' ? null : data.payment;
  orderForm.address = data.address;
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  const errors = buyerModel.validate();
  const isValid = Object.keys(errors).length === 0;
    
  orderForm.valid = isValid;
  orderForm.errors = errors.address || errors.payment || ''; 
  contactsForm.valid = isValid;
  contactsForm.errors = errors.email || errors.phone || '';
})

events.on('order:payment', (data: { payment: 'card' | 'cash' }) => buyerModel.updateData({ payment: data.payment }));
events.on('order:address', (data: { address: string }) => buyerModel.updateData({ address: data.address }));
events.on('contacts:email', (data: { email: string }) => buyerModel.updateData({ email: data.email }));
events.on('contacts:phone', (data: { phone: string }) => buyerModel.updateData({ phone: data.phone }));

function updateBasketContent(basket: Basket): void {
  const items = basketModel.getProductsSelected().map((item, idx) => {
    const cardContainer = cloneTemplate(templates.basketItem);
    const card = new CardBasket(cardContainer, (id: string) => {
      events.emit('basket:remove', { id });
    });
        
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.index = idx + 1;
        
    return card.render();
  });

  basket.list = items;
  basket.totalPrice = basketModel.getTotalPrice();
  basket.buttonDisabled = items.length === 0;
}

events.on('basket:changed', () => {
  header.counter = basketModel.getTotalItems();
  updateBasketContent(basket);
});

events.on('basket:open', () => {    
  modal.content = basket.render();
  modal.open();  
});

events.on('basket:checkout', () => {
  modal.content = orderForm.render();
  modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
  basketModel.removeProductSelected(data.id);
});

events.on('order:submit', () => {
  modal.content = contactsForm.render();
});

events.on('form:submit', async () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate(); 
  if (Object.keys(errors).length > 0) return;

  const orderData = {
    items: basketModel.getProductsSelected().map(p => p.id),
    total: basketModel.getTotalPrice(),
    payment: buyerData.payment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone
  };

  try {
    await dataApi.postOrder(orderData);
        
    basketModel.clear();
    buyerModel.clear();

    success.description = `Списано ${orderData.total} синапсов`;
    modal.content = success.render();
  } catch (err) {
    orderForm.errors = 'Ошибка при оформлении заказа. Попробуйте снова.';
  }
});

events.on('success:close', () => {
  modal.close();
});

events.on('modal:close', () => {
  currentPreviewCard = null;
  currentPreviewCardId = null;
  currentBasket = null;
});
