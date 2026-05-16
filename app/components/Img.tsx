/* Wrapper around next/image that prepends basePath to local "/..." sources.
   With `output: 'export' + unoptimized: true`, next/image does NOT auto-prefix,
   so we do it here once and route every <Image> usage through this component. */
import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "../lib/assetPath";

export function Img({ src, ...rest }: ImageProps) {
  if (typeof src === "string" && src.startsWith("/") && !src.startsWith("//")) {
    return <NextImage src={assetPath(src)} {...rest} />;
  }
  return <NextImage src={src} {...rest} />;
}
