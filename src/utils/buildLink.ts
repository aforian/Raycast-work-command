export function buildLink(url: string, text = url) {
  return `<a href="${url}">${text || url}</a>`;
}