import { IForm, Form } from './form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IFormOrder extends IForm {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class FormOrder extends Form<IFormOrder> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('order:payment', { payment: 'cash' });
        });

        this.addressInput.addEventListener('input', () => {
            console.log('Ввод адреса:', this.addressInput.value);
            this.events.emit('order:address', { address: this.addressInput.value });
        });
    }

    set payment(value: 'card' | 'cash' | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}