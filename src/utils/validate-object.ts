/**
 * @todo fix this
 */
// eslint-disable-next-line import/no-unused-modules
export function objectHasKey<T>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
