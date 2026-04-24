import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { ICard, Card } from './card';

interface ICardBasket extends ICard {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:remove');
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}