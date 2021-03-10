// Utils for Redux - really why it's called reduxUtils?
export function updateObject(oldObject, newValues) {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  return Object.assign({}, oldObject, newValues); // eslint-disable-line
}

export function immutablePush(arr, newEntry) {
  return [...arr, newEntry];
}

export function updateItemInArray(array, index, updateItemCallback) {
  const updatedItems = array.map((item) => {
    if (item.id !== index) {
      // Since we only want to update one item, preserve all others as they are now
      return item;
    }
    // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item);
    return updatedItem;
  });
  return updatedItems;
}
