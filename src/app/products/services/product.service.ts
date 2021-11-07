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

  // base url for api calls
  private apiBaseURL: string;

  constructor(private http: HttpClient) { 
    this.apiBaseURL = environment.apiBaseUrl;
  }

  /**
   * @returns list of products
   */
  fetchProducts(): Observable<ProductList> {
    const url = `${this.apiBaseURL}/list`;
    return this.http.get<ProductList>(url);
  }

  /**
   * @param product_id 
   * @returns details of product with matching id
   */
  fetchProductDetails(product_id: string): Observable<Product> {
    const url = `${this.apiBaseURL}/${product_id}/detail`;
    return this.http.get<Product>(url);
  }
}
