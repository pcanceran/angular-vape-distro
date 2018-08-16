import { Component, OnInit, Input, OnDestroy, ViewChild, ViewChildren, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { CatalogService } from '../../services/catalog/catalog.service';
import { ItemViewComponent } from '../../components/products/item-view/item-view.component';
import { Subscription ,  BehaviorSubject } from 'rxjs';
import { CustomerService } from '../../services/customer/customer.service';
import { ActivatedRoute } from '@angular/router';
import { toggleProductHover } from '../../animations/hover-product.animation';
import { MediaQueryService } from '../../services/media-query/media-query.service';
import { IAlphaOmegaGrouping } from '../../interfaces/products.interfaces';
import { MatDialog } from '@angular/material';
import { ViewProductComponent } from '../../components/modals/view-product/view-product.component';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  animations: [ toggleProductHover() ]
})

export class ProductsPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  isRoot: boolean;
  perRowFlex: number;
  products: IAlphaOmegaGrouping[];
  layoutSubscription: Subscription;
  catalogSubscription: Subscription;
  productView: string;
  paramsSubscription: Subscription;
  productModalHeight: string;
  productModalWidth: string;
  bufferItems: any[];
  liquidBrand: string;
  productListFlex: number;
  taxPaid: boolean;

  viewProductSubscription: Subscription;
  viewProductModalHeight: string;
  viewProductModalWidth: string;

  value = new EventEmitter();
  toggled = 0;

  constructor(private _catalog: CatalogService, private route: ActivatedRoute, private _mqService: MediaQueryService, private dialog: MatDialog) {
    this.perRowFlex = 25;
    this.liquidBrand = "All";
    this.bufferItems = new Array(5);
    this.products = _catalog.products;
  }

  // lifecycle
  ngOnInit() { // reevaluate - take into consideration product updates
    this.catalogSubscription = this._catalog.catalog$
      .subscribe((products: IAlphaOmegaGrouping[]) => {
        this.products = products;
      })

    this.layoutSubscription = this._mqService.productLayoutStatus$
      .subscribe((layout: ProductPageLayout) => {
        console.log(layout);
        this.perRowFlex = layout.perRowFlex;
        this.productModalHeight = layout.productModalHeight;
        this.productModalWidth = layout.productModalWidth;
        this.productListFlex = layout.productListFlex;
      })

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.productView = params['type'];
      this.liquidBrand = "All";

      if(this.productView === 'Liquid'){
        this.productView = 'E-Liquid';
      }
    });

    this.viewProductSubscription = this._mqService.viewProductModalStatus$
    .subscribe((layout: ViewProductLayout ) => {
      this.viewProductModalHeight = layout.modalHeight;
      this.viewProductModalWidth = layout.modalWidth;
    })

  }

  ngAfterViewChecked() {
    //
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.catalogSubscription.unsubscribe();
  }

  // methods
  openProduct(item: IAlphaOmegaGrouping){
    let dialogRed = this.dialog.open(ViewProductComponent, {
      width: this.viewProductModalWidth,
      height: this.viewProductModalHeight,
      data: item
    })
  }

  changeBrand(brand: string) {
    this.liquidBrand = brand;
  }

  toggleHover(product: IAlphaOmegaGrouping) {
    product.state = product.state !== 1 ? 1 : 0;
  }

  onToggle(value) {
    if (value.checked === true) {
      console.log(1);  //toggled
      this.toggled = 1;
    } else {
      console.log(0); //0
      this.toggled = 0;
    }
  }
}

interface ProductPageLayout {
  productModalHeight: string;
  productModalWidth: string;
  perRowFlex: number;
  productListFlex: number;
}

interface ViewProductLayout{
  modalHeight: string;
  modalWidth: string;
}