export const replaceSeparator = (value: string, separator: string, newSeparator?: string) => {
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSeparator, 'g');

  return value.replace(regex, newSeparator ?? ' ');
};
