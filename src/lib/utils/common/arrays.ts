/**
 * Immutably updates an array with a new item at a given index.
 *
 * @param array Original array
 * @param newItem Item to be added to the array
 * @param index Index which should be updated. If omitted, the item will be added to the end of the array.
 * @returns
 */
export const getUpdatedArray = <T>(array: T[], newItem: T, index?: number) =>
  index === -1 || index == null
    ? [...array, newItem]
    : [...array.slice(0, index), newItem, ...array.slice(index + 1)]
