import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CustomerService } from '../customer/customer.service';
import { CatalogServiceBase } from '../../interfaces/angular.catalog.service.base.class';
import { IAlphaOmegaGrouping, IPricing, IInventory, IProduct, IProductsGrouping } from '../../interfaces/products.interfaces';
import { state } from '@angular/animations';

@Injectable()
export class CatalogService implements OnInit {
  products: IAlphaOmegaGrouping[];
  alphaProducts: IAlphaOmegaGrouping[] = [];
  // catalogSet: boolean = false;

  //Publisher
  private _catalogSource = new BehaviorSubject<IAlphaOmegaGrouping[]>([]);
  catalog$ = this._catalogSource.asObservable();
  private _cartMapSource = new BehaviorSubject<IAlphaOmegaGrouping[]>([]);
  cartMap$ = this._cartMapSource.asObservable();

  // Subscription
  loginSubscription: Subscription;

  // Sorting --- to be replaced by more advanced method
  sortOrder = [
    "EJVTKK",
    "EJVTKS",
    "EJVTKL",
    "EJVTPE",
    "EJVTRO",
    "EJVTRR",
    "EJVTMP",
    "EJSNVTKK",
    "EJSNVTPE",
    "EJSNVTRO",
    "EJSNVTRR",
    "EJSNVTMP",
    "EJVGLB",
    "EJVGAS",
    "EJVGPG",
    "EJVPBL",
    "EJVPST",
    "EJVLPH",
    "EJVLPI",
    "EJVLBL",
    "EJFCMC",
    "EJFCHC",
    "EJFCBC",
    "EJVTSBVT",
    "EJVTSBKK",
    "EJVGSBTRI",
    "EJVPSBDB",
    "EJVLSBTRI",
    "EJFCSBTRI",
    "APTPSSVTG",
    "APTPTSKKTRIO",
    "APTPTSKKSDUO",
    "APTPTSKKUNO",
    "APTPTSROYAL",
    "APTPTSKREEZY",
    "APTPSTVTG",
    "APTPTTMTVBK",
    "APTPTTMNTVWH",
    "APTPTTWTVPK",
    "APTPTTWHTVGY",
    "APHWSBVT",
    "APHWDHVT",
    "APHWBNVT",
    "PRSK",
    "PRFM",
    "PRPT",
    "PRPB",
    "PRCD"/* ,
    "PRKC",
    "PRLY",
    "PRPS" */
  ];

  constructor(private http: HttpClient, private _customer: CustomerService) {
    this.products = [];
    this.subscribeToLogin(); // look at more
  }

  // Lifecycles
  ngOnInit() {}

  // Methods
  private getAllProducts(): any {
    this.http.get('/products').subscribe((products: IProduct[]) => {
      this.products = this.buildProducts(products);
      this._catalogSource.next(this.products);
      this.alphaProducts = this.getProductPricings();
      this.alphaProducts = this.getProductMSRP();
      this.alphaProducts = this.getProductInventories();
      //this.catalogSet = true;
    });
  }

  private getProductPricings(): any {
    this.http.get('/products/pricing').subscribe((pricings: IPricing[]) => {
      this.setProductPricings(pricings);
    });
  }

  private getProductMSRP(): any {
    this.http.get('/products/msrp').subscribe((pricings: IPricing[]) => {
      this.setProductMSRP(pricings);
    });
  }

  private getProductInventories(): any {
    this.http.get('/products/inventory').subscribe((inventories: IInventory[]) => {
      this.setProductInventories(inventories);
    });
  }

  private setProductPricings(pricings: IPricing[]): void {
    console.log("pricings");
    console.log(pricings);
    this.products.forEach(productGroup => {
      productGroup.groupings.forEach(grouping => {
        grouping.products.forEach(
          product => {
            pricings.forEach(pricing => {
              if (product.sku === pricing.sku) {
                product.price = pricing.price;
              }
            });
          });
      });
    });
  }

  private setProductMSRP(pricings: IPricing[]): void {
    this.products.forEach(productGroup => {
      productGroup.groupings.forEach(grouping => {
        grouping.products.forEach(
          product => {
            pricings.forEach(pricing => {
              if (product.sku === pricing.sku) {
                product.msrp = pricing.price;
              }
            });
          });
      });
    });
  }

  private setProductInventories(inventories: IInventory[]): void {
    this.products.forEach(productGroup => {
      productGroup.groupings.forEach(grouping => {
        grouping.products.forEach(
          product => {
            inventories.forEach(inventory => {
              if (product.sku === inventory.sku) {
                product.stocked = inventory.inventory;
              }
            });
          });
      });
    });
  }

  private buildProducts(products: IProduct[]): IAlphaOmegaGrouping[] {
    let complexProducts: IProduct[] = [];
    let simpleProducts: IProduct[] = [];

    products.map((product: IProduct) => {
      let relevantArray = product.parentProduct === null ? complexProducts : simpleProducts;
      relevantArray.push(product);
    })
    this.sortProductsByOrder(complexProducts).map(complexProduct => {
      this.alphaProducts.push({
        name: complexProduct.name,
        sku: complexProduct.sku,
        thumbnail: complexProduct.thumbnail,
        productFamily: complexProduct.productFamily,
        images: [],
        description: complexProduct.description,
        shortDescription: complexProduct.shortDescription,
        groupings: this.getGroupings(complexProduct, simpleProducts),
        categories: complexProduct.categories
      });
    })
    console.log(this.alphaProducts);
    console.log("Consolidating");
    consolidateAlphaProductImages(this.alphaProducts);
    console.log(this.alphaProducts);
    return this.alphaProducts;

    function consolidateAlphaProductImages(alphaProducts: IAlphaOmegaGrouping[]) {
      alphaProducts.map( (alphaProduct: IAlphaOmegaGrouping) => {
        alphaProduct.groupings.map( (grouping: IProductsGrouping) => {
          alphaProduct.images = alphaProduct.images.concat(grouping.images);
        })
      })
    }
  }


  subscribeToLogin() {
    this.loginSubscription = this._customer.loggedStatus$
      .subscribe(status => {
        if (status) {
          //  if (this.catalogSet) {
          this.getAllProducts();

          //  this._cartMapSource.next(this.products);
          //  }
        }
      })
  }

  sortProductsByOrder(products: IProduct[]) {
    let sorted: IProduct[] = [];
    for (let i = 0; i < this.sortOrder.length; i++) {
      for (let k = 0; k < products.length; k++) {
        if (products[k].sku === this.sortOrder[i]) {
          sorted.push(products[k]);
        }
      }
    }
    console.log(sorted);
    return sorted;
  }

  getGroupings(complexProduct: IProduct, simpleProducts: IProduct[]): IProductsGrouping[] {
    let childProducts: IProduct[] = [];
    let groupings: IProductsGrouping[] = [];

    simpleProducts.map( (product: IProduct) => {
      if (complexProduct.sku === product.parentProduct) {
        childProducts.push(product);
      }
    })

    if (complexProduct.productFamily === 'Promo' || complexProduct.categories.includes('Headwear')) {
      setPromoAndHeadwearGroupings();
    } else if (complexProduct.productFamily === 'Apparel' && complexProduct.categories.includes('Tops')) {
      setTopsGroupings();
    } else {
      setLiquidGroupings();
    }
    return groupings;

    function setLiquidGroupings() {
      let sizes = [];
      
      for (let i = 0; i < childProducts.length; i++) {
        if (!sizes.includes(childProducts[i].bottleSize)) {
          sizes.push(childProducts[i].bottleSize);
        }
      }

      for (let i = 0; i < sizes.length; i++) {
        let groupProducts: IProduct[] = [];
        for (let j = 0; j < childProducts.length; j++) {
          if (childProducts[j].bottleSize === sizes[i]) {
            groupProducts.push(childProducts[j]);
          }
        }
        let sortedProducts = sortChildrenProducts(groupProducts, complexProduct.productFamily)
        groupings.push({
          name: complexProduct.name + ' ' + sizes[i],
          images: consolidateGroupImages(sortedProducts),
          thumbnail: getLiquidGroupTumbnail(complexProduct.salt, sizes[i], complexProduct.thumbnail),
          products: sortedProducts
        });
      }
    }

    function setTopsGroupings() {
      groupings.push({
        products: sortChildrenProducts(childProducts, complexProduct.productFamily),
        name: complexProduct.name,
        images: [],
        thumbnail: ''
      })
    }

    function setPromoAndHeadwearGroupings() {
      groupings.push({
        products: childProducts,
        name: complexProduct.name,
        images: [],
        thumbnail: ''
      })
    }

    function getLiquidGroupTumbnail(salt: boolean, size: string, complexProductThumbnail: string): string {
      if (salt) {
        return complexProductThumbnail;
      } else {
        switch (size) {
          case "60ml":
            return complexProductThumbnail.slice(0, (complexProductThumbnail.length - 6)) + "60TN.png";
          case "100ml":
            return complexProductThumbnail.slice(0, (complexProductThumbnail.length - 6)) + "100TN.png";
          default:
            return complexProductThumbnail;
        }
      }
    }

    function sortChildrenProducts(childProducts: IProduct[], productFamily: string): IProduct[] {
      let sortedProducts: IProduct[] = [];

      switch (productFamily) {
        case 'E-Liquid':
          let nic = [];
          for (let i = 0; i < childProducts.length; i++) {
            nic.push(childProducts[i].nicotine)
          }
          nic.sort();
          for (let i = 0; i < nic.length; i++) {
            for (let j = 0; j < childProducts.length; j++) {
              if (childProducts[j].nicotine === nic[i]) {
                sortedProducts.push(childProducts[j]);
              }
            }
          }
          break;

        case 'Apparel':
          let apparelSize: any = [
            'X-Small',
            'Small',
            'Medium',
            'Large',
            'X-Large',
            '2X-Large',
            '3X-Large',
            '4X-Large'
          ]
          for (let i = 0; i < apparelSize.length; i++) {
            for (let j = 0; j < childProducts.length; j++) {
              if (childProducts[j].size === apparelSize[i]) {
                sortedProducts.push(childProducts[j]);
              }
            }
          }
          break;

        default:
          sortedProducts = childProducts;
      }
      return sortedProducts;
    }

    function consolidateGroupImages(childProducts: IProduct[]) {
      let images: string[] = [];

      childProducts.map( (product: IProduct) => {
        product.images.map( (image: string) => {
          if (!images.includes(image)) {
            images.push(image);
          }
        })
      })
      return images;
    }

    function dynamicSort(property) { // might use later
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }
  }
}
