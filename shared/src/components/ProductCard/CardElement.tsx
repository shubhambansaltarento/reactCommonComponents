import React from "react";

type CardItemLayout = 'row' | 'column';
type CardItemVariant = 'default' | 'link' | 'highlight' | 'muted';

interface CardItemProps {
  label: string;
  value: React.ReactNode;
  layout?: CardItemLayout;
  variant?: CardItemVariant;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  isLink?: boolean; 
  linkClassName?: string;
  isMobile?: boolean;
  enableTruncation?: boolean;
}

const CardElement: React.FC<CardItemProps> = ({ 
  label, 
  value, 
  layout = 'row', 
  variant = 'default',
  className = "", 
  labelClassName = "", 
  valueClassName = "",
  isLink = false,
  linkClassName = "underline text-[#4F697A]",
  isMobile = false,
  enableTruncation = false
}) => {
  
  const processClassName = (defaultClasses: string, customClassName: string) => {
    if (!customClassName) return defaultClasses;
    
    const baseClasses = defaultClasses.split(' ');
    const customClasses = customClassName.split(' ');
    
    const getClassPrefix = (className: string) => {
      const match = className.match(/^([a-z]+)-/);
      return match ? match[1] : className;
    };
    
    const customPrefixes = customClasses.map(getClassPrefix);
    
    const filteredBaseClasses = baseClasses.filter(baseClass => {
      const basePrefix = getClassPrefix(baseClass);
      return !customPrefixes.includes(basePrefix);
    });
    
    return `${filteredBaseClasses.join(' ')} ${customClassName}`.trim();
  };

  const getVariantStyles = (variant: CardItemVariant) => {
    switch (variant) {
      case 'link':
        return 'underline text-[#4F697A] cursor-pointer hover:text-[#3A5A6B]';
      case 'highlight':
        return 'text-[#2563eb] font-semibold';
      case 'muted':
        return 'text-[#6B7280]';
      default:
        return 'text-[#010203]';
    }
  };

  const displayValue = value ?? "-";
  const isEmptyValue = displayValue === "-" || displayValue === "" || displayValue === null || displayValue === undefined;
  const shouldShowAsLink = isLink && !isEmptyValue;
  const effectiveVariant = isEmptyValue && variant === 'link' ? 'default' : variant;
  const valueStyles = shouldShowAsLink ? linkClassName : getVariantStyles(effectiveVariant);
  
  const characterLimit = isMobile ? 50 : 100;
  
  if (layout === 'row') {
    return (
      <div className={processClassName('flex flex-row gap-2', className)}>
        <span
          className={labelClassName ? 
            `whitespace-nowrap font-normal not-italic leading-relaxed tracking-normal text-[0.8125rem] text-[#4A4D52] flex-shrink-0 inline-block font-[Beausite_Classic] ${labelClassName}` :
            `whitespace-nowrap font-normal not-italic leading-relaxed tracking-normal text-[0.8125rem] text-[#4A4D52] w-[8rem] md:w-[9rem] flex-shrink-0 inline-block font-[Beausite_Classic]`
          }
        >
          {label}
        </span>
        <span
          className={`font-medium not-italic leading-relaxed tracking-normal text-[0.8125rem] inline-block font-[Beausite_Classic] ${valueClassName} ${valueStyles}`}
          title={enableTruncation && typeof displayValue === 'string' && displayValue.length > characterLimit ? displayValue : undefined}
        >
          {enableTruncation && typeof displayValue === 'string' && displayValue.length > characterLimit 
            ? `${displayValue.substring(0, characterLimit)}...` 
            : displayValue}
        </span>
      </div>
    );
  }
  return (
    <div className={processClassName('flex flex-col items-start gap-2 mt-6', className)}>
      <span
        className={`whitespace-nowrap font-normal not-italic leading-relaxed tracking-normal ${labelClassName}`}
        style={{ fontFamily: 'Beausite Classic', color: '#4A4D52', fontSize: '0.8125rem' }}
      >
        {label}
      </span>
      <span
        className={`font-medium not-italic leading-relaxed tracking-normal ${valueClassName} ${valueStyles}`}
        style={{ fontFamily: 'Beausite Classic', color: '#010203', fontSize: '0.8125rem' }}
      >
        {displayValue}
      </span>
    </div>
  );
};

export default CardElement;
