export const formatDate = (value: string) => {
  const parts = value.split(/[-/.]/);

  if (parts.length !== 3) {
    throw new Error(`Invalid date string: ${value}`);
  }

  const [year, month, day] = parts;

  return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
};
