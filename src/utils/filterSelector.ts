export function selectSortFilter(filter: String): any {
  switch (filter) {
    case "Name (A to Z)": 
      return 'az';
    case "Name (Z to A)": 
      return 'za';
    case "Price (low to high)": 
      return 'lohi';
    case "Price (high to low)": 
      return 'hilo';
    default: 
      throw new Error(`Unknown filter requested: "${filter}"`);
    }
  }