import { ProductData } from '@/types/products.ts';
import { SortProductsFilter, FilterOptions } from '@/data/product-filter.ts';

export function sortProductData(filterOptions: FilterOptions, products: ProductData[]): any {
  switch (filterOptions) {
    case SortProductsFilter.az:
      return products.toSorted((a, b) => a.name.localeCompare(b.name));
    case SortProductsFilter.za:
      return products.toSorted((a, b) => b.name.localeCompare(a.name));
    case SortProductsFilter.lowToHigh:
      return products.toSorted((a, b) => a.priceValue - b.priceValue);
    case SortProductsFilter.highToLow:
      return products.toSorted((a, b) => b.priceValue - a.priceValue);
    default:
      throw new Error(`Unknown filter input: ${filterOptions}`);
  }
}
