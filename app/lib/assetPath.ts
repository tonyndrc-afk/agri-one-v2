// Prepend basePath to a public-asset URL so raw <img> tags work on GitHub Pages.
// next/image handles basePath natively — only use this for non-Image elements.
export const assetPath = (p: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!p) return p;
  if (p.startsWith("http") || p.startsWith("//")) return p;
  return `${base}${p.startsWith("/") ? "" : "/"}${p}`;
};
