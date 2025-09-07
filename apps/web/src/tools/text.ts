export const capitalizeFirstLetter = (value: string): string =>
  value[0].toUpperCase() + value.slice(1);

export const lowerCaseFirstLetter = (value: string): string =>
  value[0].toLowerCase() + value.slice(1);

export const isFilterMatchedName = (name: string, filter: string): boolean => {
  const parts = filter.toLowerCase().split(' ');
  const matched = parts.every((part) => name.toLowerCase().includes(part));

  return matched;
};
