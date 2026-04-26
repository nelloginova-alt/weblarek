import { Card, ICard } from './card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

interface ICardCatalog extends ICard {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
            if (onClick) {
                onClick();
            }
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = String(value);
        const categoryClassName = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.className = `card__category ${categoryClassName}`;
    }

    set image(value: string) {
        const fullImagePath = CDN_URL + value;
        this.setImage(this.imageElement, fullImagePath, this.title);
    }
}