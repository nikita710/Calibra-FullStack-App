import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  // totalQuantity: Subject<number> = new Subject<number>();
  // totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  addProductToCart(theCartItem: CartItem) {
    //check if product already exists
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem;

    if (this.cartItems.length > 0) {
      //find the item in the cart based on id
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      )!;

      //check if we found the product
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }
  computeCartTotals() {
    let calculatePrice: number = 0.0;
    let calculateQuantity: number = 0;

    for (let tempItem of this.cartItems) {
      calculatePrice += tempItem.quantity * tempItem.unitPrice;
      calculateQuantity += tempItem.quantity;
    }

    //publish event of quantity and price changes
    this.totalPrice.next(calculatePrice);
    this.totalQuantity.next(calculateQuantity);

    //log data
    this.logCartData(calculatePrice, calculateQuantity);
  }

  logCartData(calculatePrice: number, calculateQuantity: number) {
    console.log('contents of cart');

    for (const tempCart of this.cartItems) {
      const subTotal = tempCart.quantity * tempCart.unitPrice;
      console.log(
        'cart name: ' + tempCart.name,
        'quantity: ' + tempCart.quantity,
        'unitPrice: ' + tempCart.unitPrice,
        'subTotal: ' + subTotal
      );
    }

    console.log(
      'total price: ' + calculatePrice.toFixed(2),
      'total quantity: ' + calculateQuantity
    );
    console.log('================================================');
  }

  // Decrement Item quantity
  decrementProduct(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  // Decrement Item
  remove(theCartItem: CartItem) {
    // find remove index
    const removeIndex = this.cartItems.findIndex(
      (item) => item.id === theCartItem.id
    );

    // remove from cart list
    if (removeIndex > -1) {
      this.cartItems.splice(removeIndex, 1);

      this.computeCartTotals();
    }
  }
}
