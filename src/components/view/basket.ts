import { IEvents } from '../base/Events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';

interface IBasket {
    items: HTMLElement[];
    totalPrice: number;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:checkout');
        })
    }

    set list(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
    }

    set totalPrice(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    }
}