import { Pipe, PipeTransform } from '@angular/core';
import { IAlphaOmegaGrouping, IProduct } from '../../interfaces/products.interfaces';

@Pipe({
  name: 'productType'
})
export class ProductTypePipe implements PipeTransform {

  transform(products: IAlphaOmegaGrouping[], view: string): any {
    return products.filter(product => product.productFamily === view);
  }
}
