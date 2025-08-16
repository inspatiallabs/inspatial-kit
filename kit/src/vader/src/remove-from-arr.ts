export function removeFromArr<T>(arr: T[], val: T): void {
  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
