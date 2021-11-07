import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { ProductList } from '../models/product-list';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiBaseURL: string;

  constructor(private http: HttpClient) { 
    this.apiBaseURL = environment.apiBaseUrl;
  }

  fetchProducts(): Observable<ProductList> {
    const url = `${this.apiBaseURL}/list`;
    return this.http.get<ProductList>(url);
  }

  fetchProductDetails(product_id: string): Observable<Product> {
    const url = `${this.apiBaseURL}/${product_id}/detail`;
    return this.http.get<Product>(url);
  }
}
