import { Form, IForm} from './form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IFormContacts extends IForm {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:email', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phone', { phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.textContent = String(value);
    };

    set phone(value: string) {
        this.phoneInput.textContent = String(value);
    }
}