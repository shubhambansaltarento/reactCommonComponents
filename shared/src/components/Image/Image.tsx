"use client";

import React, { useState } from "react";
import { ImageProps } from "./Image.interface";
// import Image from 'next/image';

export const CustomImage: React.FC<ImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  onClick,
  fallbackSrc,
  objectFit = "cover",
  borderRadius = "",
  shadow = false
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const style: React.CSSProperties = {
    objectFit,
    cursor: onClick ? "pointer" : "default",
    borderRadius,
    boxShadow: shadow ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
  };

  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onClick={handleClick}
      onError={handleError}
    />
  );
};
