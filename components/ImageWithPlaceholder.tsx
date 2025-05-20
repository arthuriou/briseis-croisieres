"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ImageProps } from 'next/image';

interface ImageWithPlaceholderProps extends Omit<ImageProps, 'src' | 'alt' | 'placeholder'> {
  src: string;
  alt: string;
  blurDataURL?: string;
  quality?: number;
}

export default function ImageWithPlaceholder({
  src,
  alt,
  blurDataURL,
  className = "",
  quality = 100, // Qualité maximale par défaut
  ...props
}: ImageWithPlaceholderProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        className={`
          duration-500 ease-in-out
          ${isLoading ? 'opacity-90' : 'opacity-100'}
          ${className}
        `}
        quality={quality}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
} 