export interface IProduct {
    name: string;
    sku: string;
    productFamily: string;
    parentProduct: string; // SKU of Parent Product
    categories: string;
    description?: string;
    shortDescription?: string;
    images: string[]; // To be Added Server-side
    msrp?: number; // Added Client-side
    price: number; // Added Client-side
    stocked?: number; // Added Client-side      inventory
    pendingCart?: number; // Added Client-side   -qty
    thumbnail?: string;
    bottleSize: string;
    nicotine: string;
    salt: boolean; // Denotes if a Simple product is salt nic. Denotes is a complex product has salt nic children.
    color?: string;
    size?: string;

    /** */
    inventory: number; 
    qty?: number;
    inCart?: number;
    item_id?: number;
}

export interface IInventory {
    sku: string;
    inventory: number;
}

export interface IPricing {
    sku: string;
    price: number;
}

export interface IAlphaOmegaGrouping {
    name: string; // Taken from ComplexProduct.name
    sku: string; // Taken from ComplexProduct.sku
    thumbnail?: string; // To be Added Server-side
    productFamily: string; // Taken from ComplexProduct.family
    images: string[]; // To be Added Server-side
    description?: string;
    shortDescription?: string;
    groupings: IProductsGrouping[]; // Products grouped based on ComplexProduct.productFamily
    
    /** */
    state?: number;
    categories: string;
}
/* 
    E-Liquids: 
        Ascending Size
            Ascending Nicotine
*/

export interface IProductsGrouping {
    name: string;
    images: string[];
    thumbnail?: string;
    products: IProduct[];

    //** */
    inCart?: boolean;
}