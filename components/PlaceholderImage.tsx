import { getImageBlurData } from "@/utils/image-utils";
import Image from "next/image";

interface PlaceholderImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default async function PlaceholderImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  quality = 100,
}: PlaceholderImageProps) {
  const { base64 } = await getImageBlurData(src);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-all duration-300 ease-in-out`}
        placeholder="blur"
        blurDataURL={base64}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        unoptimized={true}
      />
    </div>
  );
} 