export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { useGrouping: true }).format(value).replace(/,/g, ' ');
