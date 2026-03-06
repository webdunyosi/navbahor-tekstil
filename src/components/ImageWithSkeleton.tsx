import { useState } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  imgClassName?: string;
  wrapperClassName?: string;
  onError?: () => void;
}

const ImageWithSkeleton = ({
  src,
  alt,
  imgClassName = '',
  wrapperClassName = '',
  onError,
}: ImageWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/10 pointer-events-none" />
      )}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          onError?.();
        }}
      />
    </div>
  );
};

export default ImageWithSkeleton;
