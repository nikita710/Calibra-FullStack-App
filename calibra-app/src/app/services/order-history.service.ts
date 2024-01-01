import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  baseUrl: string = environment.baseUrl + '/orders';

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(theEmail: string): Observable<OrderHistoryResponse> {
    let orderUrl = `${this.baseUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this.httpClient.get<OrderHistoryResponse>(orderUrl);
  }
}

interface OrderHistoryResponse {
  _embedded: {
    orders: OrderHistory[];
  };
}
