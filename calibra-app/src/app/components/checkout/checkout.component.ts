import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CustomValidation } from 'src/app/validator/custom-validation';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  months: number[] = [];
  years: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalQuantity: number = 0;
  totalPrice: number = 0;

  constructor(
    private builder: FormBuilder,
    private shopService: ShopFormService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Check Out Form Builder
    this.checkoutFormGroup = this.builder.group({
      customer: this.builder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      shippingAddress: this.builder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          CustomValidation.notOnlyWhitespace,
        ]),
      }),

      billingAddress: this.builder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
      }),

      creditCard: this.builder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidation.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      }),
    });

    // Initialize months and years
    const startMonth = new Date().getMonth() + 1;
    this.shopService
      .getCreditCardMonth(startMonth)
      .subscribe((data) => (this.months = data));

    this.shopService
      .getCreditCardYear()
      .subscribe((data) => (this.years = data));

    // populate countries
    this.shopService.getCountries().subscribe((data) => {
      this.countries = data;
      console.log(this.countries);
    });

    // total prices and quantity
    this.reviewOrder();
  }

  // get latest prices and quantity
  reviewOrder() {
    this.cartService.totalPrice.subscribe((data) => {
      console.log(data);
      this.totalPrice = data;
    });
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }

  // getter functions for  form fields
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName')!;
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName')!;
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email')!;
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')!;
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')!;
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')!;
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')!;
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')!;
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street')!;
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city')!;
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state')!;
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode')!;
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country')!;
  }

  /** cardType: new FormControl('', [Validators.required]),
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''], */

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType')!;
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard')!;
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber')!;
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode')!;
  }

  // copy shipping address to billing address
  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      // set  billing address state as shipping address state
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleYearMonthChange() {
    let creditCardGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardGroup?.value.expirationYear);

    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopService
      .getCreditCardMonth(startMonth)
      .subscribe((item) => (this.months = item));
  }

  // populate the states based on the country
  handleState(formGroupName: string) {
    let formGroup = this.checkoutFormGroup.get(formGroupName);

    // let countryCode = formGroup?.get('country')?.value['code'];
    let countryCode = formGroup?.value.country.code;

    console.log(`${formGroupName} - countryCode: ${countryCode}`);

    this.shopService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      }
      if (formGroupName == 'billingAddress') {
        this.billingAddressStates = data;
      }

      //set default state
      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
    console.log(
      this.checkoutFormGroup.get('shippingAddress')?.value.country.name
    );
    console.log(
      this.checkoutFormGroup.get('shippingAddress')?.value.state.name
    );
    console.log(this.checkoutFormGroup.get('creditCard')?.value.expirationYear);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
}
