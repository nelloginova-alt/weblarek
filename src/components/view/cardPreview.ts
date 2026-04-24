import { Card, ICard } from './card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICardPreview extends ICard {
    image: string;
    category: string;
    description: string;
}

export class CardPreview extends Card<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.events.emit('card:toggle');
        });
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent);
    }

    set category(value: string) {
        this.categoryElement.textContent = String(value);
        this.categoryElement.className = `card__category_${categoryMap}`;
    }

    set description(value: string) {
        this.descriptionElement.textContent = String(value);
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = String(value);
    }
}