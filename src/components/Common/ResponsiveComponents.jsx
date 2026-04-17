import React from 'react';
import { useResponsive, responsive } from '../../utils/responsive';

// Container متجاوب
export const ResponsiveContainer = ({ children, className = '', fullWidth = false }) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getPadding = () => {
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-8';
  };
  
  const getMaxWidth = () => {
    if (fullWidth) return '';
    if (isMobile) return 'max-w-full';
    return 'max-w-7xl';
  };
  
  return (
    <div className={`${getMaxWidth()} ${getPadding()} mx-auto ${className}`}>
      {children}
    </div>
  );
};

// زر متجاوب
export const ResponsiveButton = ({ 
  children, 
  size = 'base', 
  variant = 'primary',
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { isMobile } = useResponsive();
  
  const getSizeClass = () => {
    if (isMobile) {
      switch(size) {
        case 'xs': return 'px-2 py-1 text-xs';
        case 'sm': return 'px-3 py-1.5 text-sm';
        case 'lg': return 'px-4 py-2.5 text-sm';
        case 'xl': return 'px-5 py-3 text-base';
        default: return 'px-3 py-2 text-sm';
      }
    }
    switch(size) {
      case 'xs': return 'px-2.5 py-1 text-xs';
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'lg': return 'px-6 py-3 text-lg';
      case 'xl': return 'px-8 py-4 text-xl';
      default: return 'px-4 py-2.5 text-base';
    }
  };
  
  const getVariantClass = () => {
    switch(variant) {
      case 'secondary': 
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300';
      case 'outline':
        return 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600';
      default: // primary
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600';
    }
  };
  
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${getSizeClass()} ${getVariantClass()} ${disabledClass} rounded-lg font-medium transition-all duration-300 active:scale-95 ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// عنوان متجاوب
export const ResponsiveTitle = ({ 
  children, 
  level = 1, 
  className = '',
  center = false,
  ...props 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const Tag = `h${level}`;
  
  const getSizeClass = () => {
    if (isMobile) {
      switch(level) {
        case 1: return 'text-2xl sm:text-3xl';
        case 2: return 'text-xl sm:text-2xl';
        case 3: return 'text-lg sm:text-xl';
        case 4: return 'text-base sm:text-lg';
        case 5: return 'text-sm sm:text-base';
        case 6: return 'text-xs sm:text-sm';
        default: return 'text-lg';
      }
    }
    if (isTablet) {
      switch(level) {
        case 1: return 'text-3xl md:text-4xl';
        case 2: return 'text-2xl md:text-3xl';
        case 3: return 'text-xl md:text-2xl';
        case 4: return 'text-lg md:text-xl';
        case 5: return 'text-base md:text-lg';
        case 6: return 'text-sm md:text-base';
        default: return 'text-xl';
      }
    }
    switch(level) {
      case 1: return 'text-4xl lg:text-5xl';
      case 2: return 'text-3xl lg:text-4xl';
      case 3: return 'text-2xl lg:text-3xl';
      case 4: return 'text-xl lg:text-2xl';
      case 5: return 'text-lg lg:text-xl';
      case 6: return 'text-base lg:text-lg';
      default: return 'text-2xl';
    }
  };
  
  const centerClass = center ? 'text-center' : '';
  const weightClass = level <= 3 ? 'font-bold' : 'font-semibold';

  return (
    <Tag 
      className={`${getSizeClass()} ${weightClass} ${centerClass} text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

// بطاقة متجاوبة
export const ResponsiveCard = ({ 
  children, 
  padding = 'base',
  hover = false,
  shadow = true,
  className = '',
  ...props 
}) => {
  const { isMobile } = useResponsive();
  
  const getPaddingClass = () => {
    if (isMobile) {
      switch(padding) {
        case 'none': return 'p-0';
        case 'xs': return 'p-2';
        case 'sm': return 'p-3';
        case 'lg': return 'p-4';
        case 'xl': return 'p-5';
        default: return 'p-3';
      }
    }
    switch(padding) {
      case 'none': return 'p-0';
      case 'xs': return 'p-2 md:p-3';
      case 'sm': return 'p-3 md:p-4';
      case 'lg': return 'p-5 md:p-6';
      case 'xl': return 'p-6 md:p-8';
      default: return 'p-4 md:p-5';
    }
  };
  
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';
  const shadowClass = shadow ? 'shadow-lg' : 'shadow';
  const roundedClass = isMobile ? 'rounded-xl' : 'rounded-2xl';

  return (
    <div 
      className={`${getPaddingClass()} ${roundedClass} ${shadowClass} ${hoverClass} bg-white border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// شبكة متجاوبة
export const ResponsiveGrid = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'base',
  className = '',
  ...props 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getColsClass = () => {
    if (isMobile) return `grid-cols-${cols.mobile || 1}`;
    if (isTablet) return `grid-cols-${cols.tablet || cols.mobile || 2}`;
    return `grid-cols-${cols.desktop || cols.tablet || 3}`;
  };
  
  const getGapClass = () => {
    switch(gap) {
      case 'none': return 'gap-0';
      case 'xs': return 'gap-1 sm:gap-2';
      case 'sm': return 'gap-2 sm:gap-3';
      case 'lg': return 'gap-4 sm:gap-6';
      case 'xl': return 'gap-6 sm:gap-8';
      default: return 'gap-3 sm:gap-4';
    }
  };

  return (
    <div 
      className={`grid ${getColsClass()} ${getGapClass()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// نص متجاوب
export const ResponsiveText = ({ 
  children, 
  size = 'base', 
  color = 'default',
  weight = 'normal',
  truncate = false,
  className = '',
  ...props 
}) => {
  const { isMobile } = useResponsive();
  
  const getSizeClass = () => {
    if (isMobile) {
      switch(size) {
        case 'xs': return 'text-xs';
        case 'sm': return 'text-sm';
        case 'lg': return 'text-base';
        case 'xl': return 'text-lg';
        case '2xl': return 'text-xl';
        default: return 'text-sm';
      }
    }
    switch(size) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      default: return 'text-base';
    }
  };
  
  const getColorClass = () => {
    switch(color) {
      case 'primary': return 'text-amber-600';
      case 'secondary': return 'text-gray-600';
      case 'success': return 'text-green-600';
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'muted': return 'text-gray-500';
      default: return 'text-gray-800';
    }
  };
  
  const getWeightClass = () => {
    switch(weight) {
      case 'light': return 'font-light';
      case 'normal': return 'font-normal';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      default: return 'font-normal';
    }
  };
  
  const truncateClass = truncate ? 'truncate' : '';

  return (
    <p 
      className={`${getSizeClass()} ${getColorClass()} ${getWeightClass()} ${truncateClass} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

// Modal متجاوب
export const ResponsiveModal = ({ 
  children, 
  isOpen, 
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  className = '',
  ...props 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  if (!isOpen) return null;
  
  const getSizeClass = () => {
    if (isMobile) {
      switch(size) {
        case 'sm': return 'max-w-sm';
        case 'lg': return 'max-w-lg';
        case 'xl': return 'max-w-xl';
        default: return 'max-w-md';
      }
    }
    if (isTablet) {
      switch(size) {
        case 'sm': return 'max-w-md';
        case 'lg': return 'max-w-xl';
        case 'xl': return 'max-w-2xl';
        default: return 'max-w-lg';
      }
    }
    switch(size) {
      case 'sm': return 'max-w-lg';
      case 'lg': return 'max-w-3xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-2xl';
    }
  };
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
      onClick={handleOverlayClick}
    >
      <div 
        className={`${getSizeClass()} w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

// Navbar متجاوب (مكون مساعد)
export const ResponsiveNavbar = ({ children, className = '' }) => {
  const { isMobile } = useResponsive();
  
  return (
    <nav className={`${isMobile ? 'sticky top-0 z-50' : ''} bg-white shadow-md ${className}`}>
      <ResponsiveContainer fullWidth={isMobile}>
        {children}
      </ResponsiveContainer>
    </nav>
  );
};

// Footer متجاوب (مكون مساعد)
export const ResponsiveFooter = ({ children, className = '' }) => {
  const { isMobile } = useResponsive();
  
  return (
    <footer className={`${isMobile ? 'pb-20' : ''} bg-gray-900 text-white ${className}`}>
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </footer>
  );
};