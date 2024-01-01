package com.techbeyond.calibraapi.dto;

import com.techbeyond.calibraapi.entity.Address;
import com.techbeyond.calibraapi.entity.Customer;
import com.techbeyond.calibraapi.entity.Order;
import com.techbeyond.calibraapi.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Set<OrderItem> orderItems;
    private Order order;
}
