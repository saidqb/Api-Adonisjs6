
export function endsWith(haystack: string, needle: string): boolean {
  // search forward starting from end minus needle length characters
  var temp: number;
  return needle === "" || ((temp = haystack.length - needle.length) >= 0 && haystack.indexOf(needle, temp) !== -1);
}

export function startsWith(haystack: string, needle: string): boolean {
  // search backwards starting from haystack length characters from the end
  return needle === "" || haystack.lastIndexOf(needle, 0) !== -1;
}

