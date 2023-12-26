import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private baseUrl = 'http://localhost:8585/api';

  constructor(private httpClient: HttpClient) {}

  // get countries
  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(`${this.baseUrl}/countries`)
      .pipe(map((response) => response._embedded.countries));
  }

  // get states
  getStates(countryCode: string): Observable<State[]> {
    return this.httpClient
      .get<GetResponseStates>(
        `${this.baseUrl}/states/search/findByCountryCode?code=${countryCode}`
      )
      .pipe(map((response) => response._embedded.states));
  }

  // generate moths
  getCreditCardMonth(startMonth: number): Observable<number[]> {
    let months: number[] = [];

    for (let i = startMonth; i <= 12; i++) {
      months.push(i);
    }

    return of(months);
  }

  //generate years
  getCreditCardYear(): Observable<number[]> {
    let years: number[] = [];

    let startYear: number = new Date().getFullYear();
    let endYear: number = new Date().getFullYear() + 10;

    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }

    return of(years);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
