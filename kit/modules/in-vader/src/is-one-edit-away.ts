/**
 * Fuzzy matching helper: true if name contains query OR within one edit
 * @param name - The name to match
 * @param query - The query to match
 * @returns True if the name contains the query or is within one edit
 */
export function isOneEditAway(name: string, query: string): boolean {
  const a = name.toLowerCase();
  const b = query.toLowerCase();
  if (a === b) return true;
  const lenA = a.length;
  const lenB = b.length;
  const diff = Math.abs(lenA - lenB);
  if (diff > 1) return false;

  // Ensure a is the longer or equal
  const s1 = lenA >= lenB ? a : b;
  const s2 = lenA >= lenB ? b : a;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < s1.length && j < s2.length) {
    if (s1[i] === s2[j]) {
      i++;
      j++;
    } else {
      edits++;
      if (edits > 1) return false;
      if (s1.length === s2.length) {
        // substitution
        i++;
        j++;
      } else {
        // insertion/deletion in the longer string
        i++;
      }
    }
  }
  // Add remaining tail as edits
  edits += s1.length - i + (s2.length - j);
  return edits <= 1;
}
