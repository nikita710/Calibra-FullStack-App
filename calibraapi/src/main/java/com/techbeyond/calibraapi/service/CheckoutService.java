package com.techbeyond.calibraapi.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.techbeyond.calibraapi.dto.PaymentInfo;
import com.techbeyond.calibraapi.dto.Purchase;
import com.techbeyond.calibraapi.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
