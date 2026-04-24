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
    private idElement: string = '';

    constructor(container: HTMLElement, onClick?: (id: string) => void) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
            if (onClick && this.idElement) {
                onClick(this.idElement);
            }
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = String(value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'other';
        this.categoryElement.className = `card__category card__category_${categoryClass}`;
    }

    set image(value: string) {
        const fullImagePath = CDN_URL + value;
        this.setImage(this.imageElement, fullImagePath, this.title);
    }

    set id(value: string) {
        this.idElement = value;
        this.container.dataset.id = value;
    }
}