import { ProductData } from '@/types/products.ts';
import { SortProductsFilter, FilterOptions } from '@/data/product-filter.ts';

export function sortProductData(filter: FilterOptions, products: ProductData[]): any {
  switch(filter) {
    case SortProductsFilter.Az:
      return products.toSorted((a, b) => a.name.localeCompare(b.name));
    case SortProductsFilter.Za:
      return products.toSorted((a, b) => b.name.localeCompare(a.name));
    case SortProductsFilter.LowToHigh:
      return products.toSorted((a, b) => a.priceValue - b.priceValue);
    case SortProductsFilter.HighToLow:
      return products.toSorted((a, b) => b.priceValue - a.priceValue);
    default:
        throw new Error(`Unknown filter input: ${filter}`);
      }
    }