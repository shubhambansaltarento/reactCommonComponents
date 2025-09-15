import React from "react";
import Image from "next/image";
const  successTickIcon = require("./image-icon/SuccessTick.png");

interface StatusProps {
  status: 'success' | 'error' | 'pending' | 'warning';
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  statusSubtext?: string;
}

const Status: React.FC<StatusProps> = ({ 
  status, 
  text, 
  size = 'md',
  className = '' ,
  statusSubtext = ''
}) => {
  const sizeConfig = {
    sm: {
      circle: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-xs',
      subtext: 'text-xs'
    },
    md: {
      circle: 'w-8 h-8',
      icon: 'w-4 h-4', 
      text: 'text-sm',
      subtext: 'text-sm'
    },
    lg: {
      circle: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-base',
      subtext: 'text-base'
    },
    xl: {
      circle: 'w-17 h-17',
      icon: 'w-8 h-8',
      text: 'text-lg',
      subtext: 'text-lg'
    }
  };

  const statusConfig = {
    success: {
      circleColor: 'bg-transparent',
      iconColor: 'text-white',
      textColor: 'text-green-600',
      defaultText: 'Success',
      icon: (
        <Image 
          src={successTickIcon}
          alt="Success"
          width={parseInt(sizeConfig[size].circle.match(/w-(\d+)/)?.[1] || '8') * 4}
          height={parseInt(sizeConfig[size].circle.match(/w-(\d+)/)?.[1] || '8') * 4}
          className={`${sizeConfig[size].circle} object-contain`}
        />
      )
    },
    error: {
      circleColor: 'bg-red-500',
      iconColor: 'text-white',
      textColor: 'text-red-600',
      defaultText: 'Error',
      icon: (
        <svg 
          className={`${sizeConfig[size].icon} text-white`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      )
    },
    pending: {
      circleColor: 'bg-yellow-500',
      iconColor: 'text-white',
      textColor: 'text-yellow-600',
      defaultText: 'Pending',
      icon: (
        <svg 
          className={`${sizeConfig[size].icon} text-white animate-spin`} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )
    },
    warning: {
      circleColor: 'bg-orange-500',
      iconColor: 'text-white',
      textColor: 'text-orange-600',
      defaultText: 'Warning',
      icon: (
        <svg 
          className={`${sizeConfig[size].icon} text-white`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      )
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Status Circle with Icon */}
      <div className={`
        ${sizeConfig[size].circle} 
        ${config.circleColor} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        shadow-lg
        transition-all
        duration-200
        hover:scale-105
      `}>
        {config.icon}
      </div>
      
      {(text || config.defaultText) && (
        <span 
          className={`
            ${sizeConfig[size].text} 
            text-center
            transition-colors
            duration-200
            font-[Beausite_Classic]
            font-medium
            text-[22px]
            leading-[100%]
            tracking-[0%]
            my-2
          `}
        >
          {text || config.defaultText}
        </span>
      )}
      {statusSubtext && (
        <span className={`
          ${sizeConfig[size].subtext} 
          font-normal 
          text-gray-500
          text-center
          transition-colors
          duration-200
          my-2
          text-sm
          md:text-base

        `}>
          {statusSubtext}
        </span>
      )}  
    </div>
  );
};

export default Status;