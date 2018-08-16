import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from './services/customer/customer.service';
import { ProductGroup } from './interfaces/product-group';
import { CatalogService } from './services/catalog/catalog.service';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('cartAndProduct') cartAndProduct: MatSidenav;
  logged: boolean;
  loginSubscription: Subscription;
  sideNavMode: string;
  appStarted: boolean;

  constructor(private _customer: CustomerService, private _catalog: CatalogService, private router: Router) {
    this.sideNavMode = '';
    this.appStarted = false;
  }

  ngOnInit() {
    this.loginSubscription = this._customer.loggedStatus$
      .subscribe(status => this.logged = status);

  }

  cartSideNav() {
    this.sideNavMode = 'cart';
    console.log(this.sideNavMode);
    this.cartAndProduct.toggle();
  }
}