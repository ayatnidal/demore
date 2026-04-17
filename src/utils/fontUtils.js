// src/utils/fontUtils.js

// دوال مساعدة للخطوط حسب اللغة
export const getFontClasses = (language) => {
  const classes = {
    heading: '',
    body: '',
    accent: '',
    button: '',
    hero: ''
  };
  
  if (language === 'ar') {
    classes.heading = 'font-arabic-heading';
    classes.body = 'font-arabic';
    classes.accent = 'font-arabic-elegant';
    classes.button = 'font-arabic-elegant';
    classes.hero = 'hero-title-ar';
  } else {
    classes.heading = 'font-english-heading';
    classes.body = 'font-english';
    classes.accent = 'font-english-elegant';
    classes.button = 'font-english-elegant';
    classes.hero = 'hero-title-en';
  }
  
  return classes;
};

// توليد أنماط CSS ديناميكيًا
export const applyLanguageStyles = (language) => {
  const styles = {
    ar: {
      heading: { fontFamily: "'El Messiri', serif", fontWeight: 700 },
      body: { fontFamily: "'Noto Naskh Arabic', serif", lineHeight: 1.8 },
      button: { fontFamily: "'Noto Naskh Arabic', serif", fontWeight: 500 }
    },
    en: {
      heading: { fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '-0.02em' },
      body: { fontFamily: "'Montserrat', sans-serif", lineHeight: 1.6, letterSpacing: '-0.01em' },
      button: { fontFamily: "'Poppins', sans-serif", fontWeight: 500, letterSpacing: '0.02em' }
    }
  };
  
  return styles[language] || styles.ar;
};