export function parseLooseJson(text: string): any {
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      return new Function('return ' + text)();
    } catch (err) {
      throw e;
    }
  }
}
