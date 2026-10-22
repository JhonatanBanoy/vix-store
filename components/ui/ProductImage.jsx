"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Imagen de producto tolerante a errores.
 * - Rutas locales (/img/...) se optimizan con next/image.
 * - URLs externas se muestran sin optimizar (cualquier dominio).
 * - Si la URL está rota o no es una imagen, muestra un marcador.
 */
export default function ProductImage({
  src,
  alt = "",
  sizes,
  priority = false,
  className,
  fallbackClassName,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const isLocal = typeof src === "string" && src.startsWith("/");

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={
          alt ? `${alt} — imagen no disponible` : "Imagen no disponible"
        }
        className={cn(
          "flex h-full w-full items-center justify-center bg-bone text-muted",
          fallbackClassName
        )}
      >
        <ImageOff className="h-5 w-5" aria-hidden="true" />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!isLocal}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
