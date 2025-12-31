/**
 * Composant d'image optimisée avec next/image
 * Fonctionnalités:
 * - Format AVIF automatique (30-50% plus petit que WebP)
 * - Lazy loading automatique
 * - Placeholder blur pour meilleure UX
 * - Responsive automatique avec srcset
 * - Transition progressive du flou à net
 *
 * Phase 1.4 - Plan d'implémentation wedding-coder
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
}

/**
 * Composant d'image optimisée avec placeholder flou et transition progressive
 *
 * @param src - URL de l'image (locale ou remote)
 * @param alt - Texte alternatif (accessibilité)
 * @param width - Largeur intrinsèque de l'image
 * @param height - Hauteur intrinsèque de l'image
 * @param priority - true pour les images au-dessus du pli (désactive lazy loading)
 * @param className - Classes Tailwind supplémentaires
 * @param objectFit - Comportement de dimensionnement (default: 'cover')
 * @param quality - Qualité de l'image 1-100 (default: 90 si priority, 75 sinon)
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
  quality,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality ?? (priority ? 90 : 75)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={() => setIsLoading(false)}
        style={{ objectFit }}
        className={`
          w-full h-full
          duration-700 ease-in-out
          ${
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          }
        `}
      />

      {/* Overlay de chargement optionnel */}
      {isLoading && (
        <div className="absolute inset-0 bg-cream animate-pulse" />
      )}
    </div>
  );
}

/**
 * Variante pour les images de fond (hero, sections)
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  priority = false,
  className = '',
  children,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {/* Image de fond */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={priority ? 90 : 75}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={() => setIsLoading(false)}
        style={{ objectFit: 'cover' }}
        className={`
          duration-700 ease-in-out
          ${
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          }
        `}
      />

      {/* Contenu par-dessus l'image */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Variante pour les avatars circulaires
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 48,
  className = '',
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        quality={90}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={() => setIsLoading(false)}
        style={{ objectFit: 'cover' }}
        className={`
          w-full h-full rounded-full
          duration-500 ease-in-out
          ${
            isLoading
              ? 'scale-110 blur-lg grayscale'
              : 'scale-100 blur-0 grayscale-0'
          }
        `}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-beige animate-pulse rounded-full" />
      )}
    </div>
  );
}
