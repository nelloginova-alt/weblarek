# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### Данные
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

type TPayment = 'card' | 'cash' | ''

interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

type TValidationErrors = Partial<Record<keyof IBuyer, string>>

###### Модели данных
class ProductCatalog {
  private _products: IProduct[] = [];
  private _productDetails: IProduct | null;
  
  setProducts(products: IProduct[]): void {
    this._products = [...products];
  }

  getProducts(): IProduct[] {
    return [...this._products];
  }

  getProductById(id: string): IProduct | underfind {
    return this._products.find((product) => product.id === id);
  }

  setProductsDetails(product: IProduct): void {
    this._productDetails = product;
  }

  getProductsDetails(): IProduct | null {
    return this._productDetails;
  }
} 

class ProductBasket {
  private _productsSelected: IProduct[] = [];
  
  getProductsSelected(): IProduct[] {
    return [...this._productsSelected];
  }

  addProductSelected(product: IPoduct): void {
    if(!this.hasProductSelected(product.id)) {
      this._productSelected.push(product);
    }
  }

  removeProductSelected(productId: string): void {
    this._productsSelected = this._productsSelected.filter(productSelected => productSelected.id !== productId);
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
    this._productsSelected.lenght;
  }

  hasProductSelected(productId: string): boolean {
    return this._productsSelected.some((item) => item.id === productId);
  }
}

class BuyerDetails {
  private _payment: TPayment;
  private _address: string;
  private _phone: string;
  private _email: string;

  updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
  }
    
  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      phone: this._phone,
        email: this._email,
    };
  }
    
  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  validate(): string {
    const errors: string = {};
        
      if (!this._payment) {
        errors.payment = 'Не выбран вид оплаты';
      }
        
      if (!this._address.trim()) {
        errors.address = 'Укажите адрес доставки';
      }
        
      if (!this._phone.trim()) {
        errors.phone = 'Укажите номер телефона';
      }
        
      if (!this._email.trim()) {
        errors.email = 'Укажите емэйл';
      }
        
      return errors;
    }
}

###### Слой коммуникации
Он будет отвечать за получение данных с сервера и отправку данных на сервер.

class DataApi {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  getProducts(): Promise<IProductRequest> {
    return this._api.get<IProductRequest>('/product');
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this._api.post<IOrderResponse>('/order', order);
  }
}

https://github.com/nelloginova-alt/weblarek