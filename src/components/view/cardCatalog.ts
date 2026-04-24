import { Card, ICard } from './card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICardCatalog extends ICard {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    set category(value: string) {
        this.categoryElement.textContent = String(value);
        this.categoryElement.className = `card__category_${categoryMap}`;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent);
    }
}