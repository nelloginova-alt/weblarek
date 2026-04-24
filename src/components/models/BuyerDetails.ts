import {IBuyer, TPayment, TValidationErrors} from '../../types/index';
import { IEvents } from '../base/Events';

export class BuyerDetails {
  private payment: TPayment = '';
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(protected events: IEvents) {}

  updateData(data: Partial<IBuyer>): void {
    let hasChanges = false;

    if (data.payment !== undefined) {
      this.payment = data.payment;
      hasChanges = true;
    }
    if (data.address !== undefined) {
      this.address = data.address;
      hasChanges = true;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      hasChanges = true;
    }
    if (data.email !== undefined) {
      this.email = data.email;
      hasChanges = true;
    }
    if(hasChanges) {
      this.events.emit('buyer:updated', this.getData());
    }
  }
    
  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }
    
  clear(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:cleared');
    this.events.emit('buyer:updated', this.getData());
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};
        
      if (!this.payment) {
        errors.payment = 'Не выбран вид оплаты';
      }
        
      if (!this.address.trim()) {
        errors.address = 'Укажите адрес доставки';
      }
        
      if (!this.phone.trim()) {
        errors.phone = 'Укажите номер телефона';
      }
        
      if (!this.email.trim()) {
        errors.email = 'Укажите емэйл';
      }
        
      return errors;
    }

    validateField(field: keyof IBuyer): boolean {
    const errors = this.validate();
    return !errors[field];
  }
}