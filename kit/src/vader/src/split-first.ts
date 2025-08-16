export function splitFirst(
  val: string,
  splitter: string
): [string] | [string, string] {
  const idx = val.indexOf(splitter);
  if (idx < 0) return [val];
  const front = val.slice(0, idx);
  const back = val.slice(idx + splitter.length, val.length);
  return [front, back];
}
