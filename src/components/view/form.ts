import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IForm {
    valid: boolean;
    errors: string;
}

export class Form<T extends IForm> extends Component<T> {
    protected errorElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('form:submit');
        });
    }

    set valid(value: boolean) {
        if (value) {
            this.submitButton.removeAttribute;
        } else {
            this.submitButton.setAttribute;
        }
    }

    set errors(value: string) {
        this.errorElement.textContent = String(value);
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this as object, data);
        }
        return this.container;
    }
}