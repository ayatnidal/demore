/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'studio-xs': '480px',
      'studio-sm': '640px',
      'studio-md': '768px',
      'studio-lg': '1024px',
      'studio-xl': '1280px',
      'studio-2xl': '1440px',
      'studio-3xl': '1920px',
    },
    extend: {
      // الحفاظ على النظام القديم
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem' }],
        'lg': ['1.0625rem', { lineHeight: '1.75rem' }],
        'xl': ['1.1875rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
        // Studio Design Tokens
        'studio-xs': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'studio-sm': ['0.9375rem', { lineHeight: '1.375rem', letterSpacing: '0.01em' }],
        'studio-base': ['1.0625rem', { lineHeight: '1.625rem', letterSpacing: '0.01em' }],
        'studio-lg': ['1.1875rem', { lineHeight: '1.75rem', letterSpacing: '0.005em' }],
        'studio-xl': ['1.375rem', { lineHeight: '1.875rem', letterSpacing: '0.005em' }],
        'studio-2xl': ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '0em' }],
        'studio-3xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em' }],
        'studio-4xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.02em' }],
        'studio-5xl': ['4rem', { lineHeight: '4.25rem', letterSpacing: '-0.02em' }],
        'studio-6xl': ['5rem', { lineHeight: '5.25rem', letterSpacing: '-0.03em' }],
        'studio-display': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        'studio-hero': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      spacing: {
        // الحفاظ على النظام القديم
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'sidebar': '16rem',
        'sidebar-collapsed': '5rem',
        'header': '4rem',
        'header-mobile': '3.5rem',
        'card-sm': '0.75rem',
        'card-md': '1rem',
        'card-lg': '1.5rem',
        'card-xl': '2rem',
        // Studio Design Tokens
        'section': '6rem',
        'section-sm': '4rem',
        'section-lg': '8rem',
        'section-xl': '12rem',
        'studio-xs': '0.5rem',
        'studio-sm': '0.75rem',
        'studio-md': '1rem',
        'studio-lg': '1.5rem',
        'studio-xl': '2rem',
        'studio-2xl': '3rem',
        'studio-3xl': '4rem',
        'studio-4xl': '6rem',
        'studio-5xl': '8rem',
        'studio-6xl': '12rem',
        'studio-8xl': '16rem',
        'studio-10xl': '20rem',
      },
      maxWidth: {
        'studio': '1440px',
        'studio-sm': '640px',
        'studio-md': '768px',
        'studio-lg': '1024px',
        'studio-xl': '1280px',
        'studio-2xl': '1440px',
        'studio-3xl': '1920px',
        'studio-content': '65ch',
        'studio-wide': '80ch',
        'studio-narrow': '45ch',
      },
      colors: {
        // الحفاظ على النظام القديم
        'orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          150: '#ffe5c4',
          200: '#fed7aa',
          250: '#fec89a',
          300: '#fdba74',
          350: '#fbae67',
          400: '#fb923c',
          450: '#fa8530',
          500: '#f97316',
          550: '#f76807',
          600: '#ea580c',
          650: '#e04e0b',
          700: '#c2410c',
          750: '#b33a0b',
          800: '#9a3412',
          850: '#8b2e0f',
          900: '#7c2d12',
          950: '#431407',
        },
        'amber': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        'admin': {
          'bg': '#f8fafc',
          'sidebar': '#ffffff',
          'card': '#ffffff',
          'header': '#ffffff',
          'text': '#1e293b',
          'text-light': '#64748b',
          'border': '#e2e8f0',
          'border-light': '#f1f5f9',
          'primary': '#3b82f6',
          'secondary': '#8b5cf6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'danger': '#ef4444',
          'info': '#06b6d4',
        },
        // Studio Design Tokens - Luxury Color Palette
        'studio': {
          // Primary Colors
          'primary': {
            DEFAULT: '#0a0a0a',
            light: '#2a2a2a',
            dark: '#000000',
            subtle: '#f8f8f8',
          },
          // Secondary Colors
          'secondary': {
            DEFAULT: '#e6e6e6',
            light: '#f5f5f5',
            dark: '#cccccc',
          },
          // Accent Colors
          'accent': {
            DEFAULT: '#b8860b',
            light: '#daa520',
            dark: '#8b6508',
            muted: '#f5e8cc',
          },
          // Background Colors
          'background': {
            DEFAULT: '#ffffff',
            light: '#fafafa',
            dark: '#0a0a0a',
            muted: '#f5f5f5',
          },
          // Text Colors
          'text': {
            DEFAULT: '#0a0a0a',
            light: '#666666',
            muted: '#999999',
            inverted: '#ffffff',
            onDark: '#f5f5f5',
          },
          // Border Colors
          'border': {
            DEFAULT: '#e6e6e6',
            light: '#f0f0f0',
            dark: '#cccccc',
            accent: '#b8860b',
          },
          // Status Colors
          'success': '#2e8b57',
          'warning': '#ff8c00',
          'error': '#dc143c',
          'info': '#1e90ff',
        },
      },
      fontFamily: {
        // الحفاظ على النظام القديم
        'arabic': ['Noto Naskh Arabic', 'serif'],
        'arabic-heading': ['El Messiri', 'serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
        'english': ['Montserrat', 'sans-serif'],
        'english-heading': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        // Studio Design Tokens
        'studio-sans': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'studio-serif': ['Playfair Display', 'Georgia', 'serif'],
        'studio-mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
        'studio-display': ['Cormorant Garamond', 'Georgia', 'serif'],
        'studio-subtle': ['Cormorant', 'Georgia', 'serif'],
      },
      borderRadius: {
        // الحفاظ على النظام القديم
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
        'card': '0.75rem',
        'card-lg': '1rem',
        'card-xl': '1.5rem',
        'button': '0.5rem',
        'button-lg': '0.75rem',
        'input': '0.5rem',
        'badge': '9999px',
        // Studio Design Tokens
        'studio-none': '0',
        'studio-sm': '0.125rem',
        'studio': '0.25rem',
        'studio-md': '0.375rem',
        'studio-lg': '0.5rem',
        'studio-xl': '0.75rem',
        'studio-2xl': '1rem',
        'studio-3xl': '1.5rem',
        'studio-4xl': '2rem',
        'studio-full': '9999px',
        'studio-pill': '9999px',
        'studio-image': '0.5rem',
        'studio-card': '0.5rem',
        'studio-button': '0.25rem',
      },
      boxShadow: {
        // الحفاظ على النظام القديم
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 6px 30px rgba(0, 0, 0, 0.12)',
        'hard': '0 10px 50px rgba(0, 0, 0, 0.15)',
        'hover': '0 20px 40px rgba(0, 0, 0, 0.1)',
        'float': '0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3)',
        'orange-sm': '0 2px 15px -3px rgba(249, 115, 22, 0.1), 0 1px 8px -1px rgba(249, 115, 22, 0.06)',
        'orange': '0 4px 25px -5px rgba(249, 115, 22, 0.15), 0 2px 12px -2px rgba(249, 115, 22, 0.08)',
        'orange-lg': '0 10px 50px -12px rgba(249, 115, 22, 0.25)',
        'admin-sidebar': '2px 0 15px rgba(0, 0, 0, 0.05)',
        'admin-card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'admin-card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'admin-header': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'admin-dropdown': '0 10px 40px rgba(0, 0, 0, 0.1)',
        // Studio Design Tokens
        'studio-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'studio-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'studio': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'studio-md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'studio-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'studio-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'studio-2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.15)',
        'studio-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'studio-accent': '0 4px 14px 0 rgba(184, 134, 11, 0.15)',
        'studio-image': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'studio-hover': '0 20px 40px rgba(0, 0, 0, 0.1)',
        'studio-card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'studio-elevation': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        // الحفاظ على النظام القديم
        'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
        'gradient-orange-light': 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #fdba74 100%)',
        'gradient-orange-dark': 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #9a3412 100%)',
        'gradient-amber': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
        'admin-gradient': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        'sidebar-gradient': 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        // Studio Design Tokens
        'studio-gradient': 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        'studio-gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)',
        'studio-gradient-accent': 'linear-gradient(135deg, #b8860b 0%, #daa520 100%)',
        'studio-gradient-subtle': 'linear-gradient(135deg, #f8f8f8 0%, #f5f5f5 100%)',
        'studio-gradient-image': 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
        'studio-gradient-overlay': 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, transparent 50%, rgba(0, 0, 0, 0.8) 100%)',
        'studio-pattern': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.02) 10px, rgba(0, 0, 0, 0.02) 20px)',
        'studio-grid': 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
      },
      animation: {
        // الحفاظ على النظام القديم
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'zoom-out': 'zoomOut 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'progress': 'progress 2s ease-in-out infinite',
        'sidebar-slide-in': 'sidebarSlideIn 0.3s ease-out',
        'sidebar-slide-out': 'sidebarSlideOut 0.3s ease-out',
        'notification-slide': 'notificationSlide 0.3s ease-out',
        'modal-fade': 'modalFade 0.3s ease-out',
        // Studio Design Tokens
        'studio-fade-in': 'studioFadeIn 0.6s ease-out',
        'studio-fade-up': 'studioFadeUp 0.8s ease-out',
        'studio-fade-down': 'studioFadeDown 0.8s ease-out',
        'studio-fade-left': 'studioFadeLeft 0.8s ease-out',
        'studio-fade-right': 'studioFadeRight 0.8s ease-out',
        'studio-scale-in': 'studioScaleIn 0.6s ease-out',
        'studio-slide-up': 'studioSlideUp 0.6s ease-out',
        'studio-slide-down': 'studioSlideDown 0.6s ease-out',
        'studio-slide-left': 'studioSlideLeft 0.6s ease-out',
        'studio-slide-right': 'studioSlideRight 0.6s ease-out',
        'studio-float': 'studioFloat 8s ease-in-out infinite',
        'studio-pulse': 'studioPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'studio-shimmer': 'studioShimmer 2.5s infinite linear',
        'studio-marquee': 'studioMarquee 20s linear infinite',
        'studio-typing': 'studioTyping 3.5s steps(40, end)',
        'studio-blink': 'studioBlink 1s step-end infinite',
        'studio-reveal': 'studioReveal 1.5s ease-out forwards',
        'studio-parallax': 'studioParallax 20s linear infinite',
      },
      keyframes: {
        // الحفاظ على النظام القديم
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideInUp: {
          from: { 
            transform: 'translateY(20px)',
            opacity: '0',
          },
          to: { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInDown: {
          from: { 
            transform: 'translateY(-20px)',
            opacity: '0',
          },
          to: { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInLeft: {
          from: { 
            transform: 'translateX(-20px)',
            opacity: '0',
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideInRight: {
          from: { 
            transform: 'translateX(20px)',
            opacity: '0',
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        zoomIn: {
          from: { 
            transform: 'scale(0.95)',
            opacity: '0',
          },
          to: { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        zoomOut: {
          from: { 
            transform: 'scale(1.05)',
            opacity: '0',
          },
          to: { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        sidebarSlideIn: {
          from: { 
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        sidebarSlideOut: {
          from: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
          to: { 
            transform: 'translateX(-100%)',
            opacity: '0',
          },
        },
        notificationSlide: {
          from: { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        modalFade: {
          from: { 
            opacity: '0',
            transform: 'scale(0.95) translateY(-20px)',
          },
          to: { 
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        // Studio Design Tokens
        studioFadeIn: {
          from: { 
            opacity: '0',
            transform: 'translateY(10px) scale(0.98)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        studioFadeUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        studioFadeDown: {
          from: { 
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        studioFadeLeft: {
          from: { 
            opacity: '0',
            transform: 'translateX(30px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        studioFadeRight: {
          from: { 
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        studioScaleIn: {
          from: { 
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        studioSlideUp: {
          from: { 
            transform: 'translateY(100%)',
            opacity: '0',
          },
          to: { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        studioSlideDown: {
          from: { 
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          to: { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        studioSlideLeft: {
          from: { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        studioSlideRight: {
          from: { 
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          to: { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        studioFloat: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)',
          },
          '33%': { 
            transform: 'translateY(-20px) rotate(1deg)',
          },
          '66%': { 
            transform: 'translateY(-10px) rotate(-1deg)',
          },
        },
        studioPulse: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(0.98)',
          },
        },
        studioShimmer: {
          '0%': { 
            backgroundPosition: '-1000px 0',
          },
          '100%': { 
            backgroundPosition: '1000px 0',
          },
        },
        studioMarquee: {
          '0%': { 
            transform: 'translateX(0)',
          },
          '100%': { 
            transform: 'translateX(-50%)',
          },
        },
        studioTyping: {
          from: { 
            width: '0',
          },
          to: { 
            width: '100%',
          },
        },
        studioBlink: {
          'from, to': { 
            borderColor: 'transparent',
          },
          '50%': { 
            borderColor: 'currentColor',
          },
        },
        studioReveal: {
          from: { 
            clipPath: 'inset(0 100% 0 0)',
          },
          to: { 
            clipPath: 'inset(0 0 0 0)',
          },
        },
        studioParallax: {
          '0%': { 
            transform: 'translateY(0)',
          },
          '100%': { 
            transform: 'translateY(-50%)',
          },
        },
      },
      zIndex: {
        // الحفاظ على النظام القديم
        'sidebar': '1000',
        'header': '900',
        'dropdown': '800',
        'modal': '700',
        'overlay': '600',
        'tooltip': '500',
        'notification': '400',
        // Studio Design Tokens
        'studio-background': '-10',
        'studio-base': '0',
        'studio-elevated': '10',
        'studio-dropdown': '100',
        'studio-sticky': '200',
        'studio-fixed': '300',
        'studio-modal': '400',
        'studio-popover': '500',
        'studio-tooltip': '600',
        'studio-toast': '700',
        'studio-overlay': '800',
        'studio-max': '9999',
      },
      gridTemplateColumns: {
        // الحفاظ على النظام القديم
        'admin-layout': '250px 1fr',
        'admin-layout-collapsed': '80px 1fr',
        'admin-grid-sm': 'repeat(auto-fill, minmax(150px, 1fr))',
        'admin-grid-md': 'repeat(auto-fill, minmax(200px, 1fr))',
        'admin-grid-lg': 'repeat(auto-fill, minmax(250px, 1fr))',
        'admin-grid-xl': 'repeat(auto-fill, minmax(300px, 1fr))',
        // Studio Design Tokens
        'studio-layout': '250px 1fr',
        'studio-gallery': 'repeat(auto-fit, minmax(300px, 1fr))',
        'studio-portfolio': 'repeat(auto-fit, minmax(350px, 1fr))',
        'studio-testimonials': 'repeat(auto-fit, minmax(400px, 1fr))',
        'studio-services': 'repeat(auto-fit, minmax(250px, 1fr))',
        'studio-team': 'repeat(auto-fit, minmax(280px, 1fr))',
        'studio-masonry-sm': 'repeat(auto-fill, minmax(200px, 1fr))',
        'studio-masonry-md': 'repeat(auto-fill, minmax(250px, 1fr))',
        'studio-masonry-lg': 'repeat(auto-fill, minmax(300px, 1fr))',
        'studio-responsive': 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
      },
      // Studio Design Custom Utilities
      backdropBlur: {
        'studio-sm': '4px',
        'studio': '8px',
        'studio-md': '12px',
        'studio-lg': '16px',
        'studio-xl': '24px',
      },
      backdropBrightness: {
        'studio-dark': '0.5',
        'studio-light': '1.1',
      },
      backdropSaturate: {
        'studio': '1.2',
        'studio-high': '1.5',
      },
      backdropContrast: {
        'studio': '1.1',
        'studio-high': '1.3',
      },
      backdropSepia: {
        'studio': '0.1',
      },
      lineClamp: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
      },
      transitionProperty: {
        'studio': 'all',
        'studio-transform': 'transform',
        'studio-colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'studio-opacity': 'opacity',
        'studio-shadow': 'box-shadow',
        'studio-filter': 'filter',
        'studio-all': 'all',
      },
      transitionDuration: {
        'studio-0': '0ms',
        'studio-75': '75ms',
        'studio-100': '100ms',
        'studio-150': '150ms',
        'studio-200': '200ms',
        'studio-300': '300ms',
        'studio-500': '500ms',
        'studio-700': '700ms',
        'studio-1000': '1000ms',
      },
      transitionTimingFunction: {
        'studio-linear': 'linear',
        'studio-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'studio-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'studio-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'studio-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'studio-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDelay: {
        'studio-0': '0ms',
        'studio-75': '75ms',
        'studio-100': '100ms',
        'studio-150': '150ms',
        'studio-200': '200ms',
        'studio-300': '300ms',
        'studio-500': '500ms',
        'studio-700': '700ms',
        'studio-1000': '1000ms',
      },
      scale: {
        'studio-90': '0.9',
        'studio-95': '0.95',
        'studio-105': '1.05',
        'studio-110': '1.1',
        'studio-125': '1.25',
        'studio-150': '1.5',
      },
      rotate: {
        'studio-1': '1deg',
        'studio-2': '2deg',
        'studio-3': '3deg',
        'studio-6': '6deg',
        'studio-12': '12deg',
        'studio-45': '45deg',
        'studio-90': '90deg',
        'studio-180': '180deg',
      },
      skew: {
        'studio-1': '1deg',
        'studio-2': '2deg',
        'studio-3': '3deg',
        'studio-6': '6deg',
        'studio-12': '12deg',
      },
      // Aspect Ratio
      aspectRatio: {
        'studio-square': '1 / 1',
        'studio-video': '16 / 9',
        'studio-vertical': '9 / 16',
        'studio-portrait': '3 / 4',
        'studio-landscape': '4 / 3',
        'studio-wide': '21 / 9',
        'studio-ultrawide': '32 / 9',
      },
      // Content
      content: {
        'empty': '""',
        'quote': '"\\201C"',
        'quote-end': '"\\201D"',
        'studio-arrow': '"→"',
        'studio-plus': '"+"',
        'studio-minus': '"-"',
        'studio-check': '"✓"',
        'studio-cross': '"✕"',
      },
      // Letter Spacing
      letterSpacing: {
        'studio-tighter': '-0.05em',
        'studio-tight': '-0.025em',
        'studio-normal': '0em',
        'studio-wide': '0.025em',
        'studio-wider': '0.05em',
        'studio-widest': '0.1em',
      },
      // Line Height
      lineHeight: {
        'studio-none': '1',
        'studio-tight': '1.25',
        'studio-snug': '1.375',
        'studio-normal': '1.5',
        'studio-relaxed': '1.625',
        'studio-loose': '2',
      },
      // Min/Max Height/Width
      minHeight: {
        'studio-screen': '100vh',
        'studio-full': '100%',
        'studio-0': '0',
        'studio-4': '1rem',
        'studio-8': '2rem',
        'studio-12': '3rem',
        'studio-16': '4rem',
        'studio-20': '5rem',
        'studio-24': '6rem',
        'studio-32': '8rem',
        'studio-40': '10rem',
        'studio-48': '12rem',
        'studio-64': '16rem',
        'studio-80': '20rem',
        'studio-96': '24rem',
      },
      minWidth: {
        'studio-0': '0',
        'studio-4': '1rem',
        'studio-8': '2rem',
        'studio-12': '3rem',
        'studio-16': '4rem',
        'studio-20': '5rem',
        'studio-24': '6rem',
        'studio-32': '8rem',
        'studio-40': '10rem',
        'studio-48': '12rem',
        'studio-64': '16rem',
        'studio-80': '20rem',
        'studio-96': '24rem',
      },
      maxHeight: {
        'studio-screen': '100vh',
        'studio-full': '100%',
        'studio-0': '0',
        'studio-4': '1rem',
        'studio-8': '2rem',
        'studio-12': '3rem',
        'studio-16': '4rem',
        'studio-20': '5rem',
        'studio-24': '6rem',
        'studio-32': '8rem',
        'studio-40': '10rem',
        'studio-48': '12rem',
        'studio-64': '16rem',
        'studio-80': '20rem',
        'studio-96': '24rem',
      },
      maxWidth: {
        'studio-xs': '20rem',
        'studio-sm': '24rem',
        'studio-md': '28rem',
        'studio-lg': '32rem',
        'studio-xl': '36rem',
        'studio-2xl': '42rem',
        'studio-3xl': '48rem',
        'studio-4xl': '56rem',
        'studio-5xl': '64rem',
        'studio-6xl': '72rem',
        'studio-7xl': '80rem',
        'studio-full': '100%',
        'studio-min': 'min-content',
        'studio-max': 'max-content',
        'studio-fit': 'fit-content',
        'studio-prose': '65ch',
      },
    },
  },
  plugins: [
    // إضافة plugin للاستفادة من التوكينات الجديدة
    function({ addComponents, addUtilities, theme }) {
      // إضافة مكونات مخصصة للستوديو
      addComponents({
        // مكونات الأقسام
        '.studio-page': {
          paddingTop: theme('spacing.section'),
          paddingBottom: theme('spacing.section'),
          '@screen md': {
            paddingTop: theme('spacing.section-lg'),
            paddingBottom: theme('spacing.section-lg'),
          },
        },
        '.studio-section': {
          paddingTop: theme('spacing.section'),
          paddingBottom: theme('spacing.section'),
          '@screen md': {
            paddingTop: theme('spacing.section-lg'),
            paddingBottom: theme('spacing.section-lg'),
          },
        },
        '.studio-section-sm': {
          paddingTop: theme('spacing.section-sm'),
          paddingBottom: theme('spacing.section-sm'),
        },
        '.studio-section-lg': {
          paddingTop: theme('spacing.section-lg'),
          paddingBottom: theme('spacing.section-lg'),
        },
        '.studio-section-xl': {
          paddingTop: theme('spacing.section-xl'),
          paddingBottom: theme('spacing.section-xl'),
        },
        
        // مكونات النصوص
        '.studio-title': {
          fontFamily: theme('fontFamily.studio-display'),
          fontWeight: '400',
          color: theme('colors.studio.text.DEFAULT'),
          letterSpacing: theme('letterSpacing.studio-tight'),
        },
        '.studio-subtitle': {
          fontFamily: theme('fontFamily.studio-subtle'),
          fontWeight: '300',
          color: theme('colors.studio.text.light'),
          letterSpacing: theme('letterSpacing.studio-normal'),
        },
        '.studio-heading': {
          fontFamily: theme('fontFamily.studio-serif'),
          fontWeight: '400',
          color: theme('colors.studio.text.DEFAULT'),
        },
        '.studio-body': {
          fontFamily: theme('fontFamily.studio-sans'),
          fontWeight: '300',
          color: theme('colors.studio.text.DEFAULT'),
          lineHeight: theme('lineHeight.studio-relaxed'),
        },
        
        // مكونات العناصر
        '.studio-card': {
          backgroundColor: theme('colors.studio.background.DEFAULT'),
          borderRadius: theme('borderRadius.studio-card'),
          boxShadow: theme('boxShadow.studio-card'),
          overflow: 'hidden',
          transition: 'all 300ms ease-out',
          '&:hover': {
            boxShadow: theme('boxShadow.studio-hover'),
            transform: 'translateY(-4px)',
          },
        },
        '.studio-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.studio-sm')} ${theme('spacing.studio-xl')}`,
          fontFamily: theme('fontFamily.studio-sans'),
          fontWeight: '400',
          fontSize: theme('fontSize.studio-base[0]'),
          lineHeight: theme('fontSize.studio-base[1].lineHeight'),
          color: theme('colors.studio.text.inverted'),
          backgroundColor: theme('colors.studio.accent.DEFAULT'),
          border: '1px solid transparent',
          borderRadius: theme('borderRadius.studio-button'),
          cursor: 'pointer',
          transition: 'all 300ms ease-out',
          textDecoration: 'none',
          '&:hover': {
            backgroundColor: theme('colors.studio.accent.dark'),
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.studio-accent'),
          },
          '&:focus': {
            outline: 'none',
            ring: '2px',
            ringColor: theme('colors.studio.accent.light'),
            ringOffset: '2px',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.studio-button-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.studio.accent.DEFAULT'),
          borderColor: theme('colors.studio.accent.DEFAULT'),
          '&:hover': {
            backgroundColor: theme('colors.studio.accent.muted'),
            color: theme('colors.studio.accent.dark'),
          },
        },
        '.studio-button-secondary': {
          backgroundColor: theme('colors.studio.secondary.DEFAULT'),
          '&:hover': {
            backgroundColor: theme('colors.studio.secondary.dark'),
          },
        },
        '.studio-button-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.studio.text.DEFAULT'),
          '&:hover': {
            backgroundColor: theme('colors.studio.background.muted'),
          },
        },
        
        // مكونات الصور
        '.studio-image': {
          borderRadius: theme('borderRadius.studio-image'),
          overflow: 'hidden',
          '& img': {
            width: '100%',
            height: 'auto',
            display: 'block',
            transition: 'transform 700ms ease-out',
          },
          '&:hover img': {
            transform: 'scale(1.05)',
          },
        },
        
        // مكونات الروابط
        '.studio-link': {
          color: theme('colors.studio.accent.DEFAULT'),
          textDecoration: 'none',
          transition: 'all 200ms ease-out',
          position: 'relative',
          '&:hover': {
            color: theme('colors.studio.accent.dark'),
            '&::after': {
              width: '100%',
            },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            width: '0',
            height: '1px',
            backgroundColor: 'currentColor',
            transition: 'width 300ms ease-out',
          },
        },
      });

      // إضافة utilities مخصصة للستوديو
      addUtilities({
        // تظليل نص
        '.text-shadow-studio': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-studio-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        
        // تدرجات خلفية
        '.bg-studio-gradient': {
          backgroundImage: theme('backgroundImage.studio-gradient'),
        },
        '.bg-studio-gradient-dark': {
          backgroundImage: theme('backgroundImage.studio-gradient-dark'),
        },
        '.bg-studio-gradient-accent': {
          backgroundImage: theme('backgroundImage.studio-gradient-accent'),
        },
        
        // تأثيرات الصور
        '.image-filter-studio': {
          filter: 'brightness(1.05) contrast(1.05) saturate(1.1)',
        },
        '.image-filter-studio-dark': {
          filter: 'brightness(0.9) contrast(1.1) saturate(1.2)',
        },
        
        // تمويه خلفية
        '.backdrop-studio': {
          backdropFilter: 'blur(8px) saturate(1.2) contrast(1.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
        '.backdrop-studio-dark': {
          backdropFilter: 'blur(12px) saturate(1.5) contrast(1.2)',
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
        },
        
        // تأثيرات الحواف
        '.border-studio-accent': {
          borderColor: theme('colors.studio.accent.DEFAULT'),
          borderWidth: '1px',
        },
        '.border-studio-subtle': {
          borderColor: theme('colors.studio.border.light'),
          borderWidth: '1px',
        },
        
        // تأثيرات التأشير
        '.cursor-studio-pointer': {
          cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'14\' fill=\'none\' stroke=\'%23b8860b\' stroke-width=\'2\'/></svg>") 16 16, pointer',
        },
        
        // إخفاء شريط التمرير مع الحفاظ على الوظيفة
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-studio': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.studio.background.muted'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.studio.border.DEFAULT'),
            borderRadius: '4px',
            '&:hover': {
              background: theme('colors.studio.border.dark'),
            },
          },
        },
        
        // تأثيرات النصوص المتعددة الأسطر
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        
        // تأثيرات الانتقال
        '.transition-studio': {
          transitionProperty: theme('transitionProperty.studio'),
          transitionTimingFunction: theme('transitionTimingFunction.studio-smooth'),
          transitionDuration: theme('transitionDuration.studio-300'),
        },
        '.transition-studio-slow': {
          transitionProperty: theme('transitionProperty.studio'),
          transitionTimingFunction: theme('transitionTimingFunction.studio-smooth'),
          transitionDuration: theme('transitionDuration.studio-700'),
        },
        
        // تأثيرات التحويل
        '.transform-studio-preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.transform-studio-perspective': {
          perspective: '1000px',
        },
        '.transform-studio-backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        
        // تأثيرات الفلترة
        '.filter-studio-sepia': {
          filter: 'sepia(0.1)',
        },
        '.filter-studio-grayscale': {
          filter: 'grayscale(100%)',
        },
        '.filter-studio-grayscale-hover': {
          filter: 'grayscale(100%)',
          transition: 'filter 300ms ease-out',
          '&:hover': {
            filter: 'grayscale(0%)',
          },
        },
      });
    },
  ],
  safelist: [
    // الحفاظ على القائمة القديمة
    'bg-emerald-100',
    'bg-amber-100',
    'bg-red-100',
    'bg-blue-100',
    'bg-orange-100',
    'text-emerald-800',
    'text-amber-800',
    'text-red-800',
    'text-blue-800',
    'text-orange-800',
    'border-emerald-200',
    'border-amber-200',
    'border-red-200',
    'border-blue-200',
    'border-orange-200',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'text-green-800',
    'text-yellow-800',
    'text-purple-800',
    'animate-fade-in',
    'animate-slide-in-up',
    'animate-float',
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'p-2',
    'p-3',
    'p-4',
    'p-6',
    'm-2',
    'm-3',
    'm-4',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'gap-2',
    'gap-3',
    'gap-4',
    'gap-6',
    
    // إضافة توكينات الستوديو الجديدة
    // الألوان
    'bg-studio-primary',
    'bg-studio-accent',
    'text-studio-primary',
    'text-studio-accent',
    'border-studio-border',
    'border-studio-accent',
    
    // الخطوط
    'font-studio-sans',
    'font-studio-serif',
    'font-studio-display',
    
    // الحجم
    'text-studio-3xl',
    'text-studio-4xl',
    'text-studio-5xl',
    'text-studio-display',
    
    // المسافات
    'py-section',
    'py-section-lg',
    'px-8',
    
    // الشبكات
    'grid',
    'md:grid-cols-2',
    'gap-12',
    
    // التأثيرات
    'hover:scale-105',
    'transition',
    'duration-700',
    
    // الأنيميشن
    'animate-studio-fade-in',
    'animate-studio-fade-up',
    'animate-studio-scale-in',
    'animate-studio-float',
    
    // الخلفيات
    'bg-studio-gradient',
    'bg-studio-gradient-dark',
    
    // الظلال
    'shadow-studio',
    'shadow-studio-lg',
    'shadow-studio-card',
    
    // الزوايا
    'rounded-studio',
    'rounded-studio-lg',
    'rounded-studio-xl',
    
    // التمركز
    'max-w-studio',
    'mx-auto',
    
    // العتامة
    'opacity-0',
    'opacity-100',
    
    // التحويلات
    'transform',
    'translate-y-0',
    'translate-y-4',
    
    // الكائنات
    'object-cover',
    'object-center',
    
    // الفلترة
    'filter',
    'brightness-105',
    'contrast-105',
    
    // المزيج
    'mix-blend-overlay',
    'mix-blend-multiply',
  ],
}