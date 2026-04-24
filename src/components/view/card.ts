import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICard {
    title: string;
    price: number | null;
    id: string;
}

export class Card<T extends ICard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        this.container.addEventListener('click', () => {
            this.events.emit('card:select');
        })
    }

    set title(value: string) {
        this.titleElement.textContent = String(value);
    }

    set price(value: number | null) {
        if(value === null) {
            this.priceElement.textContent = 'Недоступно';
        } else {
            this.priceElement.textContent = '${value} синапсов';
        }
    }

    set id(value: string) {
        this.container.dataset.id = String(value);
    }
}