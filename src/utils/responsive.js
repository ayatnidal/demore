import { useState, useEffect } from 'react';

// Responsive Design System - Centralized
export const responsive = {
  breakpoints: {
    xs: 480,    // Extra Small Phones
    sm: 640,    // Small Phones
    md: 768,    // Tablets
    lg: 1024,   // Laptops
    xl: 1280,   // Desktops
    '2xl': 1536 // Large Screens
  },

  getCurrentBreakpoint() {
    if (typeof window === 'undefined') return 'lg';
    
    const width = window.innerWidth;
    if (width < this.breakpoints.xs) return 'xs';
    if (width < this.breakpoints.sm) return 'sm';
    if (width < this.breakpoints.md) return 'md';
    if (width < this.breakpoints.lg) return 'lg';
    if (width < this.breakpoints.xl) return 'xl';
    return '2xl';
  },

  isMobile(width = null) {
    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 0);
    return w < this.breakpoints.md;
  },

  isTablet(width = null) {
    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 0);
    return w >= this.breakpoints.md && w < this.breakpoints.lg;
  },

  isDesktop(width = null) {
    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 0);
    return w >= this.breakpoints.lg;
  },

  getTextSize(size) {
    const sizes = {
      'xs': 'text-xs',
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl'
    };

    // eslint-disable-next-line no-unused-vars
    const breakpoint = this.getCurrentBreakpoint();
    
    if (this.isMobile()) {
      // Mobile: أصغر حجماً
      const mobileMap = {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-base',
        'xl': 'text-lg',
        '2xl': 'text-xl',
        '3xl': 'text-2xl',
        '4xl': 'text-3xl',
        '5xl': 'text-4xl'
      };
      return mobileMap[size] || sizes[size];
    }
    
    if (this.isTablet()) {
      // Tablet: حجم متوسط
      return sizes[size];
    }
    
    // Desktop: الحجم الكامل
    return sizes[size];
  },

  getSpacing(size) {
    const spacing = {
      'none': 'p-0 m-0',
      'xs': 'p-1 m-1',
      'sm': 'p-2 m-2 md:p-3 md:m-3',
      'base': 'p-3 m-3 md:p-4 md:m-4',
      'lg': 'p-4 m-4 md:p-5 md:m-5',
      'xl': 'p-5 m-5 md:p-6 md:m-6',
      '2xl': 'p-6 m-6 md:p-8 md:m-8'
    };
    return spacing[size] || spacing.base;
  },

  getGrid(cols) {
    // eslint-disable-next-line no-unused-vars
    const breakpoint = this.getCurrentBreakpoint();
    
    if (this.isMobile()) {
      return `grid-cols-${cols.mobile || 1}`;
    }
    
    if (this.isTablet()) {
      return `grid-cols-${cols.tablet || cols.mobile || 2}`;
    }
    
    return `grid-cols-${cols.desktop || cols.tablet || 3}`;
  },

  truncateText(text, type = 'default') {
    // eslint-disable-next-line no-unused-vars
    const breakpoint = this.getCurrentBreakpoint();
    const maxLength = {
      xs: { default: 40, title: 20, description: 60 },
      sm: { default: 60, title: 30, description: 80 },
      md: { default: 100, title: 40, description: 120 },
      lg: { default: 150, title: 50, description: 180 },
      xl: { default: 200, title: 60, description: 240 },
      '2xl': { default: 250, title: 70, description: 300 }
    };
    
    const length = maxLength[breakpoint][type];
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
};

// React Hook for Responsive Design
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: responsive.isMobile(),
    isTablet: responsive.isTablet(),
    isDesktop: responsive.isDesktop(),
    breakpoint: responsive.getCurrentBreakpoint(),
    orientation: typeof window !== 'undefined' 
      ? window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      : 'landscape'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: responsive.isMobile(width),
        isTablet: responsive.isTablet(width),
        isDesktop: responsive.isDesktop(width),
        breakpoint: responsive.getCurrentBreakpoint(),
        orientation: width > height ? 'landscape' : 'portrait'
      });
      
      // إضافة فئة للـ body حسب الجهاز
      document.body.classList.toggle('mobile-view', responsive.isMobile(width));
      document.body.classList.toggle('tablet-view', responsive.isTablet(width));
      document.body.classList.toggle('desktop-view', responsive.isDesktop(width));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Initial call
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.body.classList.remove('mobile-view', 'tablet-view', 'desktop-view');
    };
  }, []);

  return windowSize;
};