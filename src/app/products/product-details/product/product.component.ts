import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  @Input() product_id: string = '';
  @Output() closeDetails = new EventEmitter();
  public data: Product = {
    product_id: '',
    name: '',
    image: '',
    price: 0,
    description: ''
  };
  public invalidProduct = false;
  public displayLoader = false;
  private destroyed = new Subject<void>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProductDetails();
  }

  fetchProductDetails() {
    this.displayLoader = true;
    this.productService.fetchProductDetails(this.product_id)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (response) => {
          this.displayLoader = false;
          if (response) {
            this.data = response;
          } else {
            this.invalidProduct = true;
          }
        },
        error: () => {
          this.invalidProduct = true;
          this.displayLoader = false;
        }
      });
  }

  close() {
    this.closeDetails.emit();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
