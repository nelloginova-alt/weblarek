import {IBuyer, TPayment, TValidationErrors} from '../../../types/index';
export class BuyerDetails {
  private _payment: TPayment = '';
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
  }
    
  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }
    
  clear(): void {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};
        
      if (!this._payment) {
        errors.payment = 'Не выбран вид оплаты';
      }
        
      if (!this._address.trim()) {
        errors.address = 'Укажите адрес доставки';
      }
        
      if (!this._phone.trim()) {
        errors.phone = 'Укажите номер телефона';
      }
        
      if (!this._email.trim()) {
        errors.email = 'Укажите емэйл';
      }
        
      return errors;
    }
}