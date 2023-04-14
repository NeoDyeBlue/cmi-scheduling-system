import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ src, fallbackSrc, alt, ...rest }) {
  // const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      src={!error ? src : fallbackSrc}
      onError={setError}
      {...rest}
    />
  );
}
