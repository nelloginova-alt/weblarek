import { Component } from '../base/Component';

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    constructor(container: HTMLElement) {
        super(container);

        console.log('Gallery container:', container);
    }

    set catalog(items: HTMLElement[]) {
        console.log('Устанавливаю карточки:', items.length);
        this.container.replaceChildren(...items);
    }
}