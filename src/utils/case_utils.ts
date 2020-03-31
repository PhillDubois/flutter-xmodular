export function capitalize(value: string): string {
  let capitalized = value.toLowerCase();
  return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
}
