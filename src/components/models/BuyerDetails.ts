import {IBuyer, TPayment, TValidationErrors} from '../../types/index';
export class BuyerDetails {
  private payment: TPayment = '';
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
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
}