import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Product } from '../models/product';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  private products: Array<Product> = [];
  public filteredProducts: Array<Product> = [];
  public searchText = new FormControl('');
  public displayLoader = false;
  public isSmallScreen = false;
  private destroyed = new Subject<void>();

  constructor(
    private productService: ProductService,
    private matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit(): void {
    this.getProducts();
    // filter the list of products based on value of search input
    this.searchText.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroyed)
      )
      .subscribe(value => {
        this.filteredProducts = value ?
          this.products.filter(product => product.name.toLowerCase().indexOf(value.toLowerCase()) > -1) :
          this.products;
      });
  }

  getProducts() {
    this.displayLoader = true;
    this.productService.fetchProducts()
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.filteredProducts = this.products;
          this.displayLoader = false;
        },
        error: () => {
          this.displayLoader = false;
        }
      });
  }

  // choose mode of display(dialog/page view) based on screen size
  displayProductDetails(product_id: string) {
    if (this.isSmallScreen) {
      this.router.navigate([`/list/${product_id}`]);
    } else {
      this.openDetailsDialog(product_id);
    }
  }

  openDetailsDialog(product_id: string) {
    this.matDialog.open(ProductDetailsComponent, {
      data: product_id,
      width: '500px',
      autoFocus: false
    });
  }

  // emit value from destroyed to close subscriptions
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
