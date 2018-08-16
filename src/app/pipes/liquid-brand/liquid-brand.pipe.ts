import { Pipe, PipeTransform } from '@angular/core';
import { IProduct, IAlphaOmegaGrouping } from '../../interfaces/products.interfaces';

@Pipe({
  name: 'liquidBrand'
})
export class LiquidBrandPipe implements PipeTransform {

  transform(products: IAlphaOmegaGrouping[], brand: string): any {
    return products.filter(product =>  brand === 'All' || product.categories.includes(brand));
    
  }
}
