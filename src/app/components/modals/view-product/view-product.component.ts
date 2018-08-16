import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { IAlphaOmegaGrouping } from '../../../interfaces/products.interfaces';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  
  prod: IAlphaOmegaGrouping;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: IAlphaOmegaGrouping) { 
   console.log(this.data);
   this.prod = data;
  }

  ngOnInit() {
    
  }

}
