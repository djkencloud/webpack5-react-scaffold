import isMobile from 'ismobilejs';

export default {
  isMobile: isMobile.phone,
  isTablet: isMobile.tablet,
  isTouch: !!(isMobile.phone || isMobile.tablet),
};
