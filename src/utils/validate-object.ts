export function objectHasKey<T = unknown, U extends string = string>(
  obj: object,
  key: U
): obj is { [key in U]: T } {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
