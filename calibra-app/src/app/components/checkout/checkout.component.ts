import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CustomValidation } from 'src/app/validator/custom-validation';
import { environment } from 'src/environments/environment';

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

  userEmail: Storage = JSON.parse(localStorage.getItem('userEmail')!);

  isDisabled: boolean = false;

  //initialize stripe
  stripe = Stripe(environment.stripePublishKey);
  paymentInfo: PaymentInfo = new PaymentInfo();

  cardElement: any;
  displayErrors: any = '';

  constructor(
    private builder: FormBuilder,
    private shopService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //setup stripe payment form
    this.setupStripePaymentForm();

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
        email: new FormControl(this.userEmail, [
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

      creditCard: this.builder.group({}),
    });

    // populate countries
    this.shopService.getCountries().subscribe((data) => {
      this.countries = data;
      console.log(this.countries);
    });

    // total prices and quantity
    this.reviewOrder();
  }

  // stripe payment form
  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');

    // add event binding for change event on the card element
    this.cardElement.on('change', (event: any) => {
      this.displayErrors = document.getElementById('card-errors');

      if (event.complete) {
        this.displayErrors.textContent = '';
      } else if (event.error) {
        this.displayErrors.textContent = event.error.message;
      }
    });
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
    // const selectedYear: number = Number(creditCardGroup?.value.expirationYear)!;
    const selectedYear: number = creditCardGroup?.value.expirationYear;

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

  // submit shopping form
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      return this.checkoutFormGroup.markAllAsTouched();
    }

    // set up order
    let order = new Order(this.totalQuantity, this.totalPrice);

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) =>
        new OrderItem(
          tempCartItem.imageUrl!,
          tempCartItem.unitPrice!,
          tempCartItem.quantity,
          tempCartItem.id!
        )
    );

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)!
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)!
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)!
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)!
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer.email!;
    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`);
    console.log(`receiptEmail: ${this.paymentInfo.receiptEmail}`);

    // call REST API via the CheckoutService
    if (
      !this.checkoutFormGroup.invalid &&
      this.displayErrors.textContent === ''
    ) {
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry.value.code,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                    );

                    //reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (error: any) => {
                    alert(`There was an error: ${error.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
  }
}
