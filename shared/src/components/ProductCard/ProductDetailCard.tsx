import React from "react";
import CardElement from "./CardElement";

interface ImageMeta {
  width?: number;
  height?: number;
}

interface CardMeta {
  layout?: 'row' | 'column';
}

interface ProductCardProps {
  imageUrl?: string;
  imageMeta?: ImageMeta;
  label?: string;
  values: Record<string, string | number | boolean | React.ReactNode>;
  cardMeta?: CardMeta;
  fieldVariants?: Record<string, 'default' | 'link' | 'highlight' | 'muted'>; 
  isMobile?: boolean;
}

const ProductDetailCard: React.FC<ProductCardProps> = ({ 
  imageUrl, 
  imageMeta, 
  label, 
  values, 
  cardMeta,
  fieldVariants = {},
  isMobile = false
}) => {
  const getFlexDirection = () => {
    if (isMobile) return 'flex-col';
    return cardMeta?.layout === 'column' ? 'flex-col' : 'flex-row';
  };
  
  const flexDirection = getFlexDirection();
  
  return (
    <div
      className={`product-card flex ${flexDirection} ${isMobile ? 'gap-3' : 'gap-7'}`}
    >
      {imageUrl && (
        <div className={`${isMobile ? 'w-full' : 'flex-shrink-0'}`}>
          <img
            src={imageUrl}
            alt={label || "image"}
            className={`product-image rounded object-cover ${isMobile ? 'w-full h-50' : ''}`}
            width={isMobile ? undefined : (imageMeta?.width || 150)}
            height={isMobile ? undefined : (imageMeta?.height || 150)}
          />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={`mb-3 font-medium not-italic ${isMobile ? 'text-[14px]' : 'text-[16px]'} leading-none tracking-normal font-[Beausite_Classic]`}
        >
          {label}
        </h3>
        <ul className="space-y-1">
          {Object.entries(values).map(([key, value]) => (
            <li key={key} className="py-1">
              <CardElement
                label={key}
                value={value}
                variant={fieldVariants[key] || 'default'}
                isMobile={isMobile}
                enableTruncation
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailCard;