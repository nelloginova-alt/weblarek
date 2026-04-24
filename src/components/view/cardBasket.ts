import { ensureElement } from '../../utils/utils';
import { ICard, Card } from './card';

interface ICardBasket extends ICard {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    private idElement: string = '';

    constructor(container: HTMLElement, onRemove?: (id: string) => void) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Клик по кнопке удаления, id:', this.idElement)
            if (onRemove && this.idElement) {
                onRemove(this.idElement);
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set id(value: string) {
        this.idElement = value;
        this.container.dataset.id = value;
    }
}