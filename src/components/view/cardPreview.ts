import { Card, ICard } from './card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

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

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

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
       const fullImagePath = CDN_URL + value;
        this.setImage(this.imageElement, fullImagePath, this.title);
    }

    set category(value: string) {
        this.categoryElement.textContent = String(value);
        const categoryClassName = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.className = `card__category ${categoryClassName}`;
    }

    set description(value: string) {
        this.descriptionElement.textContent = String(value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
            this.buttonElement.disabled = false;
        }
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = String(value);
    }
}