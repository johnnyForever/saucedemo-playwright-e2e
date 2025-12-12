export const SortProductsFilter = {
  Az: {
    label: 'Name (A to Z)',
    element: 'az',
  },
  Za: {
    label: 'Name (Z to A)',
    element: 'za',
  },
  LowToHigh: {
    label: 'Price (low to high)',
    element: 'lohi',
  },
 HighToLow: {
    label: 'Price (high to low)',
    element: 'hilo',
  },
}

export type FilterOptions = 
  | typeof SortProductsFilter.Az
  | typeof SortProductsFilter.Za
  | typeof SortProductsFilter.LowToHigh
  | typeof SortProductsFilter.HighToLow;