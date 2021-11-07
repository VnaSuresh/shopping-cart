import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  public product_id = '';
  public dialogView = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  // set dialogView to true if route does not have param
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.product_id = params['id'];
      } else {
        this.dialogView = true;
      }
    });
  }

  // return to list view based on screen size
  close() {
    if (this. dialogView) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/list']);
    }
  }

}
